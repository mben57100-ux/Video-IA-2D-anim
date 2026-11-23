"""Assemble les voix, resserre les pauses, aligne les mots (heuristique) -> build/voice.wav + build/timeline.json"""
import json, re, subprocess, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from clips import FILES, GAP_BEFORE, DEFAULT_GAP, TEMPO, MAX_PAUSE, FX

HERE = os.path.dirname(os.path.abspath(__file__))
VOIX = os.path.join(HERE, "audio", "voix")
OUT = os.path.join(HERE, "build"); os.makedirs(OUT, exist_ok=True)
SR = 44100
HOP = 0.01

def load(path, tempo, fx=None):
    af = f"atempo={tempo}" + ("," + fx if fx else "")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af", af,
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def envelope(x):
    n = int(SR * HOP)
    m = len(x) // n
    e = np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(e)

def speech_regions(x, thr=-40, min_sil=0.18):
    db = envelope(x)
    voiced = db > thr
    regions, i, m = [], 0, len(voiced)
    while i < m:
        if voiced[i]:
            j = i
            while j < m and voiced[j]: j += 1
            regions.append([i * HOP, j * HOP]); i = j
        else: i += 1
    # merge gaps shorter than min_sil
    merged = []
    for r in regions:
        if merged and r[0] - merged[-1][1] < min_sil: merged[-1][1] = r[1]
        else: merged.append(r)
    return [r for r in merged if r[1] - r[0] > 0.06]

def compress(x, regions, max_pause, pad=0.04):
    """Rebuild audio keeping regions, internal pauses capped. Returns new audio and new region times."""
    out, newreg, t = [], [], 0.0
    for k, (a, b) in enumerate(regions):
        a2, b2 = max(0, a - pad), min(len(x) / SR, b + pad)
        if k > 0:
            prev_b = regions[k - 1][1] + pad
            gap = min(max(a2 - prev_b, 0), max_pause)
            out.append(np.zeros(int(gap * SR), np.float32)); t += gap
        seg = x[int(a2 * SR):int(b2 * SR)]
        newreg.append([t + (a - a2), t + (a - a2) + (b - a)])
        out.append(seg); t += len(seg) / SR
    return np.concatenate(out), newreg

def parse_markup(s):
    words = []
    for tok in s.split():
        m = re.match(r"^(.*?)\[(.+?)\]([JR])(.*)$", tok)
        color = None
        if m:
            tok = m.group(1) + m.group(2) + m.group(4); color = m.group(3)
        words.append({"w": tok, "color": color})
    # multi-word brackets like [trois heures]J were split by whitespace: handle
    return words

def parse_markup_full(s):
    out = []
    for m in re.finditer(r"\[([^\]]+)\]([JR])|(\S+)", s):
        if m.group(1):
            parts = m.group(1).split()
            for p in parts: out.append({"w": p, "color": m.group(2)})
        else: out.append({"w": m.group(3), "color": None})
    # glue tokens: '[Algérie]J,' -> previous regex yields 'Algérie' then ','
    glued = []
    for w in out:
        if glued and re.fullmatch(r"[,.!?…»]+|\.\.\.", w["w"]) and w["color"] is None:
            glued[-1]["w"] += w["w"]
        elif glued and glued[-1]["w"].endswith("l'") and False:
            pass
        else: glued.append(w)
    # fix tokens like "l'[humain]R," -> "l'" + "humain," : merge "l'"-style prefixes
    fixed = []
    for w in glued:
        if fixed and fixed[-1]["w"].endswith("'") and fixed[-1]["color"] is None:
            fixed[-1]["w"] += w["w"]; fixed[-1]["color"] = w["color"]
        else: fixed.append(w)
    return fixed

def is_boundary(word):
    return bool(re.search(r"[,.!?…:»]$|\.\.\.$", word))

def weight(word):
    w = re.sub(r"[^\wÀ-ÿ']", "", word)
    return 0.6 + len(w)  # constant per word + chars

def align(words, regions):
    """DP: assign contiguous word groups to speech regions."""
    W, R = len(words), len(regions)
    wts = np.array([weight(w["w"]) for w in words])
    cum = np.concatenate([[0], np.cumsum(wts)])
    total_sp = sum(b - a for a, b in regions)
    rate = total_sp / cum[-1]
    INF = 1e18
    if R > W:  # too many regions: merge smallest gaps
        while len(regions) > W:
            gaps = [regions[i + 1][0] - regions[i][1] for i in range(len(regions) - 1)]
            i = int(np.argmin(gaps)); regions[i] = [regions[i][0], regions[i + 1][1]]; del regions[i + 1]
        R = len(regions)
    D = np.full((R + 1, W + 1), INF); D[0, 0] = 0; back = np.zeros((R + 1, W + 1), int)
    for r in range(1, R + 1):
        dur = regions[r - 1][1] - regions[r - 1][0]
        for j in range(r, W - (R - r) + 1):
            for i in range(r - 1, j):
                if D[r - 1, i] >= INF: continue
                exp = (cum[j] - cum[i]) * rate
                c = (np.log(dur / exp)) ** 2 * 4
                if j < W and not is_boundary(words[j - 1]["w"]): c += 1.5
                if D[r - 1, i] + c < D[r, j]: D[r, j] = D[r - 1, i] + c; back[r, j] = i
    j, groups = W, []
    for r in range(R, 0, -1):
        i = back[r, j]; groups.append((i, j)); j = i
    groups.reverse()
    for (i, j), (a, b) in zip(groups, regions):
        tot = cum[j] - cum[i]; t = a
        for k in range(i, j):
            d = (b - a) * wts[k] / tot
            words[k]["t0"], words[k]["t1"] = round(t, 3), round(t + d, 3); t += d
    return words

timeline, words_all, clips_out, audio, t = [], [], [], [], 0.3
audio.append(np.zeros(int(0.3 * SR), np.float32))
for fname, style, subs in FILES:
    gap = GAP_BEFORE.get(fname, DEFAULT_GAP) if words_all else 0
    audio.append(np.zeros(int(gap * SR), np.float32)); t += gap
    x = load(os.path.join(VOIX, fname), TEMPO[style], FX.get(fname))
    reg = speech_regions(x)
    y, reg2 = compress(x, reg, MAX_PAUSE if style == "narr" else MAX_PAUSE + 0.12)
    words = []
    for cid, txt in subs:
        for w in parse_markup_full(txt):
            w.update(clip=cid, style=style); words.append(w)
    align(words, [list(r) for r in reg2])
    for w in words: w["t0"] += t; w["t1"] += t
    words_all += words
    clips_out.append({"file": fname, "start": round(t, 3), "end": round(t + len(y) / SR, 3)})
    audio.append(y); t += len(y) / SR

audio.append(np.zeros(int(2.6 * SR), np.float32))  # jumpscare tail
full = np.concatenate(audio)
import wave
with wave.open(os.path.join(OUT, "voice.wav"), "wb") as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())
# per-clip ranges
clip_rng = {}
for w in words_all:
    c = clip_rng.setdefault(w["clip"], [w["t0"], w["t1"]]); c[0] = min(c[0], w["t0"]); c[1] = max(c[1], w["t1"])
json.dump({"duration": round(len(full) / SR, 3), "speech_end": round(t, 3), "words": words_all,
           "clips": {k: [round(a, 3), round(b, 3)] for k, (a, b) in clip_rng.items()}, "files": clips_out},
          open(os.path.join(OUT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print("duration", round(len(full) / SR, 2), "speech_end", round(t, 2))
for k, (a, b) in clip_rng.items(): print(k, round(a, 2), round(b, 2))
