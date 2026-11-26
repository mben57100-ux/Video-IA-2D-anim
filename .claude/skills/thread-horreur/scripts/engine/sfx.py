"""Bibliothèque de sons synthétisés (aucun fichier externe). Import : sys.path.insert(0, 'engine'); from sfx import *"""
import numpy as np

SR = 44100
R = np.random.default_rng(7)

def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=.01, r=.2):
    t = tt(d); return np.clip(np.minimum(1, t / max(a, 1e-4)) * np.minimum(1, (d - t) / max(r, 1e-4)), 0, 1)
def noise(d): return R.standard_normal(int(d * SR))
def bandnoise(d, lo, hi):
    x = noise(d); X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y

class Bus:
    """Piste stéréo : bus.add(t, signal, gain, pan)"""
    def __init__(self, dur): self.buf = np.zeros((int(dur * SR) + SR, 2))
    def add(self, t, x, gain=1.0, pan=0.0):
        i = int(t * SR); x = np.asarray(x, dtype=float)
        if x.ndim == 1: x = np.stack([x * (1 - max(pan, 0)), x * (1 + min(pan, 0))], 1)
        j = min(len(self.buf), i + len(x));
        if j > i: self.buf[i:j] += x[:j - i] * gain

# ---------- sons ----------
def hit(d=1.2, f=48):
    t = tt(d); return np.sin(2 * np.pi * f * t * (1 - .35 * t / d)) * np.exp(-t * 3.5) + noise(d) * np.exp(-t * 18) * .4
def whoosh(d=1.0, lo=300, hi=3000):
    t = tt(d); return bandnoise(d, lo, hi) * np.sin(np.pi * t / d) ** 2
def knock():
    t = tt(.18); return (np.sin(2 * np.pi * 95 * t) * .9 + bandnoise(.18, 80, 900) * .6) * np.exp(-t * 32)
def click():
    t = tt(.06); return bandnoise(.06, 1500, 6000) * np.exp(-t * 90)
def tick():
    t = tt(.04); return (bandnoise(.04, 2500, 8000) * .6 + np.sin(2 * np.pi * 1800 * t)) * np.exp(-t * 160)
def ding(f=1320):
    t = tt(1.2); return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.01 * t) + .25 * np.sin(2 * np.pi * f * 3.02 * t)) * np.exp(-t * 4)
def scratch(d=.35):
    t = tt(d); return bandnoise(d, 1200, 5000) * (0.4 + 0.6 * np.abs(np.sin(t * 60))) * env(d, .02, .1)
def sniff(d=.35): return bandnoise(d, 800, 4500) * env(d, .05, .15)
def step():
    t = tt(.12); return bandnoise(.12, 60, 700) * np.exp(-t * 35)
def snowstep():
    t = tt(.16); return bandnoise(.16, 300, 3000) * np.exp(-t * 25) * (0.6 + 0.4 * np.abs(np.sin(t * 300)))
def heartbeat():
    t = tt(.25); b = np.sin(2 * np.pi * 50 * t) * np.exp(-t * 20); return np.concatenate([b, np.zeros(int(.12 * SR)), b * .7])
def chains(d=1.0):
    """cliquetis de chaînes : petits impacts métalliques aléatoires"""
    out = np.zeros(int(d * SR)); n = int(d * 18)
    for _ in range(n):
        i = int(R.uniform(0, d - .08) * SR); t = tt(.08); f = R.uniform(2500, 5200)
        out[i:i + len(t)] += (np.sin(2 * np.pi * f * t) + .6 * np.sin(2 * np.pi * f * 1.47 * t)) * np.exp(-t * 60) * R.uniform(.3, 1)
    return out * env(d, .05, .2)
def bells(d=1.0):
    out = np.zeros(int(d * SR))
    for k in range(int(d * 6)):
        i = int(R.uniform(0, d - .3) * SR); t = tt(.3); f = R.uniform(1800, 2600)
        out[i:i + len(t)] += np.sin(2 * np.pi * f * t) * np.exp(-t * 12) * .5
    return out
def roar(d=1.6, f0=70):
    t = tt(d); f = f0 * (1 + .25 * np.sin(t * 9))
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + bandnoise(d, 80, 1200) * .7
    return lp(x, .12) * env(d, .08, .5) * 2
def scream(d=1.8):
    t = tt(d); return (np.sign(np.sin(2 * np.pi * 311 * t)) + np.sign(np.sin(2 * np.pi * 329 * t)) + bandnoise(d, 1000, 8000)) * np.exp(-t * 1.6) * .35
def wail(d=2.0, f=520):
    """cri / pleur spectral (Llorona) : sinus glissant + souffle"""
    t = tt(d); ff = f * (1 + .12 * np.sin(t * 5)) * (1 + .3 * t / d)
    return (np.sin(2 * np.pi * np.cumsum(ff) / SR) * .6 + bandnoise(d, 1500, 6000) * .2) * env(d, .2, .6)
def water_burst(d=2.0):
    t = tt(d); return (bandnoise(d, 100, 6000) * np.exp(-t * 1.2) + hit(d, 40) * .6)
def wind(d, lo=150, hi=900):
    t = tt(d); return bandnoise(d, lo, hi) * (0.5 + 0.5 * np.sin(t * .7 + 1) ** 2)
def engine_stop(d=1.0):
    sp = tt(d); return lp(np.sign(np.sin(2 * np.pi * 25 * sp * (1 - sp * .5))) * np.exp(-sp * 3), .05)
def riser(d):
    t = tt(d); return (bandnoise(d, 200, 3000) * .5 + np.sin(2 * np.pi * (60 + 80 * t / d) * t) * .5) * (t / d) ** 2
def drone(d, f=55):
    t = tt(d); return (np.sin(2 * np.pi * f * t) * .5 + np.sin(2 * np.pi * f * 1.498 * t + np.sin(t * .3)) * .3 + np.sin(2 * np.pi * f * 2.006 * t) * .12) * (0.6 + 0.4 * np.sin(t * .25))
def pluck(f, d=1.6, bright=.5):
    n = int(SR / f); buf = R.uniform(-1, 1, n); out = np.empty(int(d * SR))
    for i in range(len(out)):
        out[i] = buf[i % n]; buf[i % n] = .996 * (bright * buf[i % n] + (1 - bright) * buf[(i + 1) % n])
    return out * env(d, .002, .6)
def trailer_pulse(d, bpm=100, f=41):
    """pulsation grave « bande-annonce » (intro roue / combat)"""
    out = np.zeros(int(d * SR)); beat = 60 / bpm
    for k in range(int(d / beat)):
        b = hit(.5, f) * .8; i = int(k * beat * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out

def wheel_ticks(bus, t0, dur, n_cards, spins, target, gain=.35, pan=0):
    """Un clic à chaque carte qui passe, même courbe que wheelStrip (ease-out 3.2), + ding à l'arrêt"""
    total = spins * n_cards + target; last = -1
    for k in range(int(dur * 200)):
        p = k / (dur * 200); e = 1 - (1 - p) ** 3.2; pos = int(e * total)
        if pos != last: bus.add(t0 + p * dur, tick(), gain, pan); last = pos
    bus.add(t0 + dur, ding(), gain * .9, pan)

def master(voice, music, sfx, out_path, duck_amt=.45):
    """mix voix (mono np) + bus musique + bus sfx -> wav stéréo, ducking, soft-limit"""
    import wave
    N = max(len(music.buf), len(sfx.buf), len(voice))
    v = np.zeros((N, 2)); v[:len(voice)] = np.stack([voice, voice], 1)
    m = np.zeros((N, 2)); m[:len(music.buf)] = music.buf[:N]
    s = np.zeros((N, 2)); s[:len(sfx.buf)] = sfx.buf[:N]
    venv = np.convolve(np.abs(v[:, 0]), np.ones(2205) / 2205, "same")
    duck = 1 - duck_amt * np.clip(venv / .05, 0, 1)
    mix = v + m * duck[:, None] + s * .55
    mix /= max(1e-9, np.abs(v).max()) / .8
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    with wave.open(out_path, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((mix * 32767).astype(np.int16).tobytes())
