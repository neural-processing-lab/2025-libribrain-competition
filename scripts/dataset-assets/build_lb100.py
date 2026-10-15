"""Build the LibriBrain100 multi-subject assets from npz/sub-*_ses-11.npz (A Study in Scarlet, ch. 11)."""
import json, os, glob, subprocess, sys, re
import numpy as np
from scipy.io import wavfile
from scipy import signal
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from proc import load_events

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
A, B = 15.9, 37.5  # chapter clock: "On the morning which followed his interview with the Mormon Prophet ..."
FS = 50
tau = np.arange(int(A * FS), int(B * FS)) / FS
n = len(tau)

files = sorted(glob.glob("npz/sub-*_ses-11.npz"), key=lambda p: int(re.search(r"sub-(\d+)", p)[1]))
lay = json.load(open(os.path.join(OUT, "..", "libribrain", "clip.json")))["layout"]
xy = np.array(lay["xy"])
subjects, chunks = [], []
for f in files:
    sid = re.search(r"(sub-\d+)", f)[1]
    d = np.load(f)
    types = d["types"]; mag = np.where(types == "mag")[0]; grad = np.where(types == "grad")[0]
    tm = np.interp(tau, d["anc_c"], d["anc_t"])  # chapter → MEG clock
    x50 = d["x50"].astype(np.float32)
    idx = tm * FS
    i0 = np.floor(idx).astype(int); fr = idx - i0
    seg = x50[:, i0] * (1 - fr) + x50[:, i0 + 1] * fr
    gc = np.sqrt(seg[grad[0::2]] ** 2 + seg[grad[1::2]] ** 2)
    # most speech-tracking temporal gradiometer (lags 60-200 ms)
    xc = d["xcorr"]; lags = d["lags"]
    win = (lags >= 6) & (lags <= 20)
    score = np.abs(xc[grad][:, win]).max(1)
    site_of = np.repeat(np.arange(102), 2)
    temporal = np.abs(xy[site_of, 0]) > 0.55
    score[~temporal] = -1
    best = int(np.argmax(score))
    trace = seg[grad[best]]
    chunks.append(np.round(np.clip(gc[:, ::2], 0, 5) * 51).astype(np.uint8).ravel())  # 25 Hz for maps
    chunks.append(np.round(np.clip(trace, -4, 4) * 31.75).astype(np.int8).view(np.uint8))
    # evoked + tracking summaries
    ev = d["evoked"]; egc = np.sqrt(ev[grad[0::2]] ** 2 + ev[grad[1::2]] ** 2)
    gfp = egc[np.abs(xy[:, 0]) > 0.55].mean(0)  # temporal sites
    pk = 28 + int(np.argmax(gfp[28:50]))  # 80-300 ms
    topo = egc[:, pk]
    xg = np.sqrt(xc[grad[0::2]] ** 2 + xc[grad[1::2]] ** 2)
    xm = xg.mean(0)
    xpk = int(np.argmax(xm[20:60])) + 20
    subjects.append(dict(id=sid, site=int(site_of[best]), n_epochs=int(d["n_epochs"]),
                         gfp=np.round(gfp * 1000).astype(int).tolist(), peak_ms=int((pk - 20) * 10),
                         topo=np.round(topo / topo.max() * 1000).astype(int).tolist()))
    print(sid, "peak", subjects[-1]["peak_ms"])

np.concatenate(chunks).tofile(f"{OUT}/multi-meg.bin")

# audio + spectrogram on the chapter clock
sr, wav = wavfile.read("data/studyinscarlet_11_doyle_64kb.wav")
clip = wav[int(A * sr):int(A * sr) + int(n / FS * sr)].astype(np.float32)
fade = int(0.05 * sr); clip[:fade] *= np.linspace(0, 1, fade); clip[-fade:] *= np.linspace(1, 0, fade)
wavfile.write("clip11.wav", sr, clip.astype(np.int16))
subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", "clip11.wav", f"{OUT}/multi.m4a"], check=True)
f_, t_, S = signal.spectrogram(clip, sr, nperseg=1024, noverlap=1024 - sr // 60)
S = S[f_ < 7000]; f_ = f_[f_ < 7000]
mel = 2595 * np.log10(1 + f_ / 700); edges = np.linspace(mel[1], mel[-1], 97)
M = np.stack([S[(mel >= edges[k]) & (mel < edges[k + 1])].mean(0) for k in range(96)])
M = 10 * np.log10(M + 1e-10); M = np.clip((M - (M.max() - 70)) / 70, 0, 1)
cm = LinearSegmentedColormap.from_list("v", ["#0b0a1a", "#2e1065", "#7c3aed", "#c4b5fd", "#fdf4ff"])
plt.imsave(f"{OUT}/multi-spec.png", M[::-1], cmap=cm)

ev = load_events("events/LibriBrain__Sherlock1__derivatives__events__sub-0_ses-11_task-Sherlock1_run-2_events.tsv")
words = [[e["seg"], round(e["tc"] - A, 3), round(e["dur"], 3)] for e in ev if e["kind"] == "word" and e["tc"] is not None and A <= e["tc"] < B]
phons = [[e["seg"].split("_")[0], round(e["tc"] - A, 3), round(e["dur"], 3)] for e in ev if e["kind"] == "phoneme" and e["tc"] is not None and A <= e["tc"] < B]
sils = [[round(e["tc"] - A, 3), round(e["dur"], 3)] for e in ev if e["kind"] == "silence" and e["tc"] is not None and A <= e["tc"] < B]
json.dump(dict(fs=FS, n=n, map_fs=FS // 2, map_n=(n + 1) // 2, nsens=102, start=A, words=words, phonemes=phons, silences=sils, layout=lay,
               session="A Study in Scarlet, Book 2 Ch. 4 (session 11)", subjects=subjects),
          open(f"{OUT}/multi.json", "w"), separators=(",", ":"))
for fn in sorted(os.listdir(OUT)):
    print(fn, os.path.getsize(f"{OUT}/{fn}"))
