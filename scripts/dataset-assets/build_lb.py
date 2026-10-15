"""Build the LibriBrain page assets from npz/sub-0_ses-1.npz + raw events/audio."""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile
from scipy import signal
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from proc import load_events

OUT = sys.argv[1]  # e.g. ../public/datasets/libribrain
os.makedirs(OUT, exist_ok=True)
A, B = 49.8, 89.6  # MEG-clock window: "Part one. Chapter one. Mr. Sherlock Holmes. In the year 1878 ..."

d = np.load("npz/sub-0_ses-1.npz")
types = d["types"]; mag = np.where(types == "mag")[0]; grad = np.where(types == "grad")[0]
xyz = np.array(json.load(open("data/sensor_xyz.json")))[mag]

# --- sensor layout: azimuthal equidistant projection from a point below the vertex
c = xyz - np.array([0, 0.0, -0.04]); r = np.linalg.norm(c, axis=1)
th = np.arccos(c[:, 2] / r); ph = np.arctan2(c[:, 1], c[:, 0])
X = th * np.cos(ph); Y = th * np.sin(ph)
s = max(np.abs(X).max(), np.abs(Y).max())
layout = dict(xy=np.round(np.stack([X / s, Y / s], 1), 4).tolist(),
              xyz=np.round(xyz / np.abs(xyz).max(), 4).tolist())

# --- MEG clip (50 Hz, z-scored): mags signed int8, combined planar gradient uint8
x50 = d["x50"].astype(np.float32)
i0, i1 = int(round(A * 50)), int(round(B * 50))
m = np.clip(x50[mag, i0:i1], -4, 4)
g1, g2 = x50[grad[0::2], i0:i1], x50[grad[1::2], i0:i1]
gc = np.clip(np.sqrt(g1 ** 2 + g2 ** 2), 0, 5)
buf = np.concatenate([np.round(m * 31.75).astype(np.int8).view(np.uint8).ravel(),
                      np.round(gc * 51).astype(np.uint8).ravel()])
buf.tofile(f"{OUT}/clip-meg.bin")

# --- audio re-rendered on the MEG clock
ev = load_events("data/sub-0_ses-1_task-Sherlock1_run-1_events.tsv")
at, ac = d["anc_t"], d["anc_c"]
sr, wav = wavfile.read("data/studyinscarlet_01_doyle_64kb.wav")
tm = np.arange(int(A * sr), int(B * sr)) / sr
idx = np.clip(np.round(np.interp(tm, at, ac) * sr).astype(int), 0, len(wav) - 1)
clip = wav[idx]
fade = int(0.05 * sr); clip = clip.astype(np.float32)
clip[:fade] *= np.linspace(0, 1, fade); clip[-fade:] *= np.linspace(1, 0, fade)
wavfile.write("clip.wav", sr, clip.astype(np.int16))
subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", "clip.wav", f"{OUT}/clip.m4a"], check=True)

# --- spectrogram (log-mel-ish), 60 columns / s
f, t, S = signal.spectrogram(clip, sr, nperseg=1024, noverlap=1024 - sr // 60)
S = S[f < 7000]; f = f[f < 7000]
mel = 2595 * np.log10(1 + f / 700); edges = np.linspace(mel[1], mel[-1], 97)
M = np.stack([S[(mel >= edges[k]) & (mel < edges[k + 1])].mean(0) for k in range(96)])
M = 10 * np.log10(M + 1e-10); M = np.clip((M - (M.max() - 70)) / 70, 0, 1)
cm = LinearSegmentedColormap.from_list("v", ["#0b0a1a", "#2e1065", "#7c3aed", "#c4b5fd", "#fdf4ff"])
plt.imsave(f"{OUT}/clip-spec.png", M[::-1], cmap=cm)

# --- transcript (words with phonemes) relative to clip start
words, phons = [], []
for e in ev:
    if A <= e["t"] < B:
        if e["kind"] == "word":
            words.append([e["seg"], round(e["t"] - A, 3), round(e["dur"], 3)])
        elif e["kind"] == "phoneme":
            phons.append([e["seg"].split("_")[0], round(e["t"] - A, 3), round(e["dur"], 3)])
sil = [[round(e["t"] - A, 3), round(e["dur"], 3)] for e in ev if e["kind"] == "silence" and A <= e["t"] < B]

json.dump(dict(fs=50, n=int(i1 - i0), nsens=len(mag), start=A, words=words, phonemes=phons, silences=sil,
               layout=layout, session="sub-0 · ses-1 · A Study in Scarlet, Chapter 1"),
          open(f"{OUT}/clip.json", "w"), separators=(",", ":"))

# --- evoked + tracking
ev_ = d["evoked"]; h1, h2 = d["evk_h1"], d["evk_h2"]
def comb(a): return np.sqrt(a[grad[0::2]] ** 2 + a[grad[1::2]] ** 2)
eg, em = comb(ev_), ev_[mag]
xc = d["xcorr"]; xg = comb(xc)
q = lambda a, k=1000: np.round(a * k).astype(int).tolist()
json.dump(dict(t0=-0.2, fs=100, n_epochs=int(d["n_epochs"]),
               grad=q(eg), mag=q(em), gfp=q(eg.mean(0)), gfp_h1=q(comb(h1).mean(0)), gfp_h2=q(comb(h2).mean(0)),
               lag0=-0.2, xcorr=q(xg, 10000), xcorr_mean=q(xg.mean(0), 10000), xcorr_mag=q(xc[mag], 10000)),
          open(f"{OUT}/evoked.json", "w"), separators=(",", ":"))
for fn in os.listdir(OUT):
    print(fn, os.path.getsize(f"{OUT}/{fn}"))
