import os, subprocess, urllib.request, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from proc import process
for d in ("data", "npz", "events"): os.makedirs(d, exist_ok=True)
B1="https://huggingface.co/datasets/pnpl/LibriBrain/resolve/main/"
B2="https://huggingface.co/datasets/pnpl/LibriBrain2/resolve/main/"
wav="data/studyinscarlet_11_doyle_64kb.wav"
if not os.path.exists(wav): urllib.request.urlretrieve(B1+"Sherlock1/stimuli/audio/studyinscarlet_11_doyle_64kb.wav", wav)
jobs=[("sub-0", B1, "LibriBrain", "sub-0_ses-11_task-Sherlock1_run-2")]+[(f"sub-{i}", B2, "LibriBrain2", f"sub-{i}_ses-11_task-Sherlock1_run-1") for i in range(1,13)]
for sub, base, repo, stem in jobs:
    out=f"npz/{sub}_ses-11.npz"
    if os.path.exists(out): continue
    h5=f"data/{stem}.h5"
    ev=f"events/{repo}__Sherlock1__derivatives__events__{stem}_events.tsv"
    url = base+f"Sherlock1/derivatives/serialised/{stem}_proc-bads+headpos+sss+notch+bp+ds_meg.h5"
    for attempt in range(8):
        r = subprocess.run(["curl", "-sL", "-C", "-", "--retry", "5", "--speed-limit", "20000", "--speed-time", "60", "-o", h5, url])
        if r.returncode == 0: break
    try:
        process(h5, ev, wav, out)
    finally:
        os.remove(h5)
print("ALL DONE")
