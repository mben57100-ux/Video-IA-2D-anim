"""Musique (drone + luth hijaz), bruitages synthétisés, mix avec la voix -> build/mix.wav"""
import json, os, re, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, "build")
SR = 44100
tl = json.load(open(os.path.join(B, "timeline.json")))
DUR = tl["duration"]; N = int(DUR * SR) + SR
R = np.random.default_rng(7)
def C(c, k=0): return tl["clips"][c][k]
def W(c, s, n=0):
    s = re.sub(r"[^a-zà-ÿ'-]", "", s.lower())
    ws = [w for w in tl["words"] if w["clip"] == c and re.sub(r"[^a-zà-ÿ'-]", "", w["w"].lower()).startswith(s)]
    return ws[min(n, len(ws) - 1)]["t0"]

music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def add(buf, t, x, gain=1.0, pan=0.0):
    i = int(t * SR); x = np.asarray(x)
    if x.ndim == 1: x = np.stack([x * (1 - max(pan, 0)), x * (1 + min(pan, 0))], 1)
    j = min(N, i + len(x)); buf[i:j] += x[:j - i] * gain
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=.01, r=.2):
    t = tt(d); e = np.minimum(1, t / max(a, 1e-4)) * np.minimum(1, (d - t) / max(r, 1e-4)); return np.clip(e, 0, 1)
def lp(x, a):  # one-pole lowpass, a in (0,1): smaller = darker
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y
def noise(d): return R.standard_normal(int(d * SR))
def bandnoise(d, lo, hi):
    x = noise(d); X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)

# ---------- MUSIQUE ----------
t_all = tt(DUR)
# drone grave avec LFO
dr = (np.sin(2 * np.pi * 55 * t_all) * .5 + np.sin(2 * np.pi * 82.4 * t_all + np.sin(t_all * .3)) * .3
      + np.sin(2 * np.pi * 110.3 * t_all) * .12) * (0.6 + 0.4 * np.sin(t_all * .25))
# plus discret sur le hook / scène de jour, plus présent la nuit
lvl = np.interp(t_all, [0, C("02"), C("02") + 1, C("04"), C("04") + .5, W("04", "un"), W("04", "un") + 1, DUR],
                [.35, .35, 1, 1, .4, .4, 1, 1])
music[:len(dr)] += np.stack([dr * lvl, dr * lvl], 1) * .34
# vent du désert (bruit filtré), coupé net au "le vent s'arrête"
wind_d = DUR
wn = bandnoise(wind_d, 150, 900) * (0.5 + 0.5 * np.sin(t_all * .7 + 1) ** 2)
wl = np.interp(t_all, [0, C("05"), C("05") + .25, C("09"), C("09") + 1, C("11"), C("11") + .5, C("17"), C("17") + 1, C("20"), C("20") + .5, DUR],
               [.5, .5, 0, 0, .35, .35, 0, 0, .4, .4, 0, 0])
music[:len(wn)] += np.stack([wn * wl, wn * wl * .9], 1) * .12

# luth (Karplus-Strong) en mode hijaz (Ré)
HIJAZ = [146.8, 155.6, 185.0, 196.0, 220.0, 233.1, 261.6, 293.7]
def pluck(f, d=1.6, bright=.5):
    n = int(SR / f); buf = R.uniform(-1, 1, n); out = np.empty(int(d * SR))
    for i in range(len(out)):
        out[i] = buf[i % n]; buf[i % n] = .996 * (bright * buf[i % n] + (1 - bright) * buf[(i + 1) % n])
    return out * env(d, .002, .6)
melody_day = [(0, 4), (.45, 3), (.9, 2), (1.35, 1), (1.8, 0), (2.6, 4), (3.0, 5), (3.4, 4)]
for dt, k in melody_day: add(music, .3 + dt, pluck(HIJAZ[k]), .22, -.2)
for dt, k in [(0, 0), (.4, 2), (.8, 4), (1.2, 3), (1.6, 2), (2.4, 1), (2.8, 0)]: add(music, C("04") + dt, pluck(HIJAZ[k] * 2, 1.2), .16, .2)
for dt, k in [(0, 1), (1.4, 0), (2.8, 1), (4.2, 0)]: add(music, C("11") + dt, pluck(HIJAZ[k] / 2, 2.5, .3), .25)
for dt, k in [(0, 0), (1.2, 1), (2.6, 0)]: add(music, C("17") + dt, pluck(HIJAZ[k], 2.2, .4), .2)

# ---------- SFX ----------
def hit(d=1.2, f=48):
    t = tt(d); x = np.sin(2 * np.pi * f * t * (1 - .35 * t / d)) * np.exp(-t * 3.5) + noise(d) * np.exp(-t * 18) * .4
    return x
def knock():
    t = tt(.18); return (np.sin(2 * np.pi * 95 * t) * .9 + bandnoise(.18, 80, 900) * .6) * np.exp(-t * 32)
def click():
    t = tt(.06); return bandnoise(.06, 1500, 6000) * np.exp(-t * 90)
def whoosh(d=1.0, lo=300, hi=3000):
    t = tt(d); return bandnoise(d, lo, hi) * np.sin(np.pi * t / d) ** 2
def scratch(d=.35):
    t = tt(d); return bandnoise(d, 1200, 5000) * (0.4 + 0.6 * np.abs(np.sin(t * 60))) * env(d, .02, .1)
def sniff(d=.35):
    return bandnoise(d, 800, 4500) * env(d, .05, .15)
def step():
    t = tt(.12); return bandnoise(.12, 60, 700) * np.exp(-t * 35)
def heartbeat():
    t = tt(.25); b = np.sin(2 * np.pi * 50 * t) * np.exp(-t * 20); return np.concatenate([b, np.zeros(int(.12 * SR)), b * .7])
def tick():
    t = tt(.03); return bandnoise(.03, 2000, 7000) * np.exp(-t * 200)

add(sfx, W("02", "salam") - .1, whoosh(1.2, 200, 1500), .35)
add(sfx, W("02", "manger"), hit(1.4, 45), .9)
# affiche : coup de tampon + frappe + cases DANGER
add(sfx, C("03"), hit(.6, 70), .7)
for i in range(9): add(sfx, C("03") + .5 + i * .1, click(), .5)
for i in range(5): add(sfx, C("03") + 1.2 + i * .24, np.sin(2 * np.pi * (520 + i * 60) * tt(.12)) * env(.12, .005, .08), .18)
add(sfx, W("05", "coup"), whoosh(.6, 100, 800)[::-1], .4)
add(sfx, C("06"), hit(1.0, 60), 1.0); add(sfx, C("06"), whoosh(.5, 500, 5000), .5)
add(sfx, C("07"), whoosh(1.5, 80, 400), .3)
for k in range(12): add(sfx, C("09") + k * .27, step(), .6, (-1) ** k * .3)
for k in range(5): add(sfx, C("10") + k * .75, heartbeat(), .8)
add(sfx, W("11", "glisse"), scratch(.9) * .6, .35)
add(sfx, W("11", "ferme") + .25, click(), .9); add(sfx, W("11", "ferme") + .55, click(), .9)
for k in range(int((W("13", "on") - C("13")) / .5) + 1): add(sfx, C("13") + k * .5, tick(), .5)
fr = W("13", "frappe")
for k in range(3): add(sfx, fr + k * .45, knock(), 1.0)
for k in range(4): add(sfx, W("15", "alors") + k * .4, scratch(), .45)
for k in range(5): add(sfx, W("15", "puis") + k * .55, sniff(), .35)
add(sfx, C("17"), whoosh(2.0, 60, 300), .3)
# voiture : moteur puis calage
tm = W("18", "moteur"); d = tm - C("18") + .4; t = tt(d)
eng = (np.sign(np.sin(2 * np.pi * 38 * t)) * .3 + np.sin(2 * np.pi * 76 * t) * .3) * env(d, .5, .05)
add(sfx, C("18"), lp(eng, .08), .5)
sp = tt(1.0); add(sfx, tm + .3, lp(np.sign(np.sin(2 * np.pi * 25 * sp * (1 - sp * .5))) * np.exp(-sp * 3), .05), .5)
# montée de tension jusqu'à la fin
rd = tl["speech_end"] - C("20"); t = tt(rd)
riser = (bandnoise(rd, 200, 3000) * .5 + np.sin(2 * np.pi * (60 + 80 * t / rd) * t) * .5) * (t / rd) ** 2
add(sfx, C("20"), riser, .35)
# jumpscare
js = tl["speech_end"] + .1; t = tt(1.8)
scream = (np.sign(np.sin(2 * np.pi * 311 * t)) + np.sign(np.sin(2 * np.pi * 329 * t)) + bandnoise(1.8, 1000, 8000)) * np.exp(-t * 1.6) * .35
add(sfx, js, hit(2.0, 40), 1.2); add(sfx, js, scream, .6)

# ---------- MIX ----------
with wave.open(os.path.join(B, "voice.wav")) as f:
    v = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float64) / 32767
voice = np.zeros((N, 2)); voice[:len(v)] = np.stack([v, v], 1)
# ducking musique sous la voix
venv = np.convolve(np.abs(voice[:, 0]), np.ones(2205) / 2205, "same")
duck = 1 - .45 * np.clip(venv / .05, 0, 1)
mix = voice * 1.0 + music * duck[:, None] + sfx * .55
end = int((DUR) * SR); mix = mix[:end]
fade = int(.05 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= max(1e-9, np.abs(voice).max()) / .8
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
with wave.open(os.path.join(B, "mix.wav"), "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((mix * 32767).astype(np.int16).tobytes())
print("mix ok", round(len(mix) / SR, 2))
