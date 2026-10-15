# Dataset-page assets

Scripts that build the real-data assets under `public/datasets/` used by the
`/datasets/` pages. They are not part of the site build; run them by hand when
the assets need regenerating.

Everything is computed from the public Hugging Face releases
(`pnpl/LibriBrain`, `pnpl/LibriBrain2`). Run from an empty scratch directory
(the scripts read and write `data/`, `events/` and `npz/` relative to the
working directory) with a Python that has `numpy scipy h5py matplotlib`.
Audio is encoded with macOS `afconvert`.

```sh
WORK=$(mktemp -d) && cd "$WORK"
S=/path/to/repo/scripts/dataset-assets

python $S/list_hf_files.py          # -> hf_files.json (repo listing)
python $S/dl_events.py              # -> events/*.tsv (all event files, ~250 MB)
python $S/build_stats.py            # -> public/datasets/stats.json

# LibriBrain page: sub-0, A Study in Scarlet ch. 1
B=https://huggingface.co/datasets/pnpl/LibriBrain/resolve/main
mkdir -p data npz && cd data
curl -LO "$B/Sherlock1/derivatives/serialised/sub-0_ses-1_task-Sherlock1_run-1_proc-bads+headpos+sss+notch+bp+ds_meg.h5"
curl -LO "$B/Sherlock1/derivatives/events/sub-0_ses-1_task-Sherlock1_run-1_events.tsv"
curl -LO "$B/Sherlock1/stimuli/audio/studyinscarlet_01_doyle_64kb.wav"
curl -LO "$B/metadata/sensor_xyz.json"
cd ..
python $S/proc.py data/sub-0_ses-1_*_meg.h5 data/sub-0_ses-1_*_events.tsv data/studyinscarlet_01_doyle_64kb.wav npz/sub-0_ses-1.npz
python $S/build_lb.py /path/to/repo/public/datasets/libribrain

# LibriBrain100 page: ch. 11 for sub-0 and broad subjects (≈430 MB each, deleted after processing)
python $S/fetch_multi_subject.py
python $S/build_lb100.py /path/to/repo/public/datasets/libribrain100
```

`proc.py` is the shared analysis. Per session it:
- band-passes the 250 Hz data (0.5–20 Hz at 50 Hz for display, 1–20 Hz at 100 Hz for analysis),
- robustly z-scores each sensor,
- computes the word-onset evoked response (−0.2 to 0.8 s, dropping the 5% noisiest epochs) with split halves,
- computes the lagged correlation between the speech envelope and every sensor.

Chapters were presented in short segments with small gaps, so audio and MEG
clocks are related piecewise. The event files' `timemeg`/`timechapter` columns
are used as anchors to map between them.

Figures under `public/datasets/figures/` are taken from the LibriBrain and
LibriBrain100 papers (arXiv source), rendered to WebP on a white background.
