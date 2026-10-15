"""Shared MEG processing for the dataset-page visuals.

Reads one serialised LibriBrain session (306 x T @ 250 Hz) + its events TSV + chapter
audio, and writes a compact npz with everything the web assets are derived from.
"""
import sys, json, os
import numpy as np, h5py, csv
from scipy import signal
from scipy.io import wavfile

FS = 250.0


def load_events(path):
    rows = list(csv.DictReader(open(path), delimiter="\t"))
    out = []
    for r in rows:
        try:
            out.append(dict(kind=r["kind"], seg=r["segment"], t=float(r["timemeg"]),
                            tc=float(r["timechapter"]) if r["timechapter"] else None,
                            dur=float(r["duration"]) if r["duration"] else 0.0))
        except ValueError:
            pass
    return out


def bandpass_resample(x, lo, hi, up, down):
    sos = signal.butter(4, [lo, hi], btype="band", fs=FS, output="sos")
    out = []
    for i in range(0, x.shape[0], 34):
        y = signal.sosfiltfilt(sos, x[i:i + 34].astype(np.float64), axis=1)
        out.append(signal.resample_poly(y, up, down, axis=1).astype(np.float32))
    return np.concatenate(out, 0)


def audio_envelope(wav_path, fs_out=100):
    sr, a = wavfile.read(wav_path)
    a = a.astype(np.float32)
    if a.ndim > 1:
        a = a.mean(1)
    # broadband envelope -> 8 Hz lowpass -> fs_out
    from scipy.fft import next_fast_len
    from fractions import Fraction
    env = np.abs(signal.hilbert(a, N=next_fast_len(len(a))))[: len(a)]
    sos = signal.butter(4, 8, fs=sr, output="sos")
    env = signal.sosfiltfilt(sos, env)
    fr = Fraction(fs_out, sr)
    env = signal.resample_poly(env, fr.numerator, fr.denominator)
    return env.astype(np.float32)


def process(h5_path, ev_path, wav_path, out_path):
    f = h5py.File(h5_path, "r")
    raw = f["data"][:]
    types = [t.strip() for t in f.attrs["channel_types"].split(",")]
    names = [n.strip() for n in f.attrs["channel_names"].split(",")]
    f.close()
    ev = load_events(ev_path)
    words = [e for e in ev if e["kind"] == "word"]
    sil = [e for e in ev if e["kind"] == "silence"]
    offs = np.array([w["t"] - w["tc"] for w in words if w["tc"] is not None])
    offset = float(np.median(offs))

    # 1) display copy: 0.5-20 Hz @ 50 Hz (z-scored per channel)
    x50 = bandpass_resample(raw, 0.5, 20, 1, 5)
    # 2) analysis copy: 1-20 Hz @ 100 Hz
    x100 = bandpass_resample(raw, 1, 20, 2, 5)
    del raw
    sd = np.median(np.abs(x100 - np.median(x100, 1, keepdims=True)), 1, keepdims=True) * 1.4826
    x100 /= sd
    sd50 = np.median(np.abs(x50 - np.median(x50, 1, keepdims=True)), 1, keepdims=True) * 1.4826
    x50 /= sd50

    # word-onset evoked, -0.2..0.8 s
    pre, post = 20, 80
    on = [int(round(w["t"] * 100)) for w in words]
    on = [o for o in on if o - pre >= 0 and o + post < x100.shape[1]]
    ep = np.stack([x100[:, o - pre:o + post] for o in on])  # n x 306 x 100
    # reject extreme epochs
    mx = np.abs(ep).max((1, 2))
    keep = mx < np.percentile(mx, 95)
    ep = ep[keep]
    evk = ep.mean(0)
    evk -= evk[:, :pre].mean(1, keepdims=True)
    # split-half reliability for error bands of GFP
    rng = np.random.default_rng(0)
    idx = rng.permutation(len(ep))
    h1 = ep[idx[: len(idx) // 2]].mean(0); h2 = ep[idx[len(idx) // 2:]].mean(0)

    # envelope tracking: corr(env(t), meg(t+lag)), lag -0.2..0.6 s
    env = audio_envelope(wav_path)
    # resample the chapter-time envelope onto the MEG clock (segments were presented with gaps)
    anc = sorted((e["t"], e["tc"]) for e in ev if e["tc"] is not None)
    at = np.array([a for a, _ in anc]); ac = np.array([c for _, c in anc])
    m0 = int(np.ceil(at[0] * 100)); m1 = int(np.floor(at[-1] * 100))
    tm = np.arange(m0, m1) / 100.0
    env_m = np.interp(np.interp(tm, at, ac) * 100, np.arange(len(env)), env)
    n = min(len(env_m), x100.shape[1] - m0 - 70)
    e = (env_m[:n] - env_m[:n].mean()) / env_m[:n].std()
    lags = np.arange(-20, 61)
    xc = np.zeros((306, len(lags)), np.float32)
    for j, L in enumerate(lags):
        seg = x100[:, m0 + L:m0 + L + n]
        segz = (seg - seg.mean(1, keepdims=True)) / seg.std(1, keepdims=True)
        xc[:, j] = (segz * e[None]).mean(1)

    np.savez_compressed(out_path, x50=x50.astype(np.float16), evoked=evk.astype(np.float32),
                        evk_h1=h1.astype(np.float32), evk_h2=h2.astype(np.float32),
                        n_epochs=len(ep), anc_t=at, anc_c=ac, xcorr=xc, lags=lags, offset=offset,
                        types=np.array(types), names=np.array(names))
    print("done", out_path, "epochs", len(ep), "offset", offset, flush=True)


if __name__ == "__main__":
    process(*sys.argv[1:5])
