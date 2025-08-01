---
title: "Phase 2 (Phoneme Classification) is Now Live!"
date: 2025-08-01T00:00:00Z
draft: false
description: "We are excited to announce that Phase 2 of the LibriBrain Competition is now accepting submissions for the Phoneme Classification task."
tags: ["competition", "phoneme-classification"]
categories: ["announcements"]
authors: ["LibriBrain Team"]
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: false
showBreadcrumbs: true
showEdit: false
showPagination: true
showTaxonomies: true
math: false
---

We're excited to announce that **Phase 2 of the LibriBrain Competition is now live** and accepting submissions for the **Phoneme Classification** task!

Today marks the launch of Phase 2 of the competition, which is independent from the first phase. The baseline to beat is our own Colab Tutorial Notebook model with `f1_macro=0.06`. We have just launched a whole set of things to support you:

## What's New

- **New leaderboards**: The new set of leaderboards ([standard]({{< ref "leaderboard" >}}) | [extended]({{< ref "leaderboard" >}})) is now live and we start accepting submissions from now until **September 30th, 2025** anywhere on earth
- **New pnpl release**: To generate a submission, ensure you update the 'pnpl' library to the new **0.0.5 release** we launched today (`pip install --upgrade pnpl`; full changelog below)
- **New tutorial notebooks**: On the ["Participate" page]({{< ref "participate" >}}), you can find two new tutorial notebooks - the first one is a general intro to the phoneme task, the other one explains how to make a submission
- **Fixed label files**: We have fixed the broken session Sherlock4-8. We have also fixed some (very minor) issues with some of the other label files. If you have a local copy of the labels, make sure to re-download them. (thanks @枫采唐 on the Discord for flagging this!)

## Key Details

- **Submission Deadline**: September 30th, 2025 (anywhere on earth)
- **Task**: Phoneme Classification using MEG data
- **Tracks**: Both Standard and Extended tracks available
- **Leaderboard**: Live leaderboards now accepting submissions

## Getting Started

1. **Upgrade the PNPL package**: `pip install --upgrade pnpl` (ensure you have version 0.0.5)
2. **Follow our new tutorials**: Check out the updated [participation guide]({{< ref "participate" >}}) with new phoneme classification notebooks
3. **Train your model**: Use our provided notebooks or build something on your own
4. **Submit your results**: Upload via our submission portal

## 🔥 Full `pnpl 0.0.5` Changelog

- Fixed first few seconds of each session accidentally being reported as speech (thanks to @ljh on Discord for flagging this!)
- Allow override of download functionality (disable completely via `download=False` or supplement with your own HF dataset by setting `HF_DATASET` and `HF_TOKEN`)
- Speed up dataset initialization (thanks @dogeon188 on Discord for providing the fix!)
- Support Phoneme Classification submission generation using the [new holdout data](https://huggingface.co/datasets/pnpl/LibriBrain-Competition-2025/blob/main/COMPETITION_HOLDOUT/derivatives/serialised/sub-0_ses-2025_task-COMPETITION_HOLDOUT_run-2_proc-bads%2Bheadpos%2Bsss%2Bnotch%2Bbp%2Bds_meg.pt)
- Allow remote override of dataset constants (set `PNPL_REMOTE_CONSTANTS_DISABLED=true` to prevent; note: we have added this to give us more flexibility in dealing with any issues moving forward)

Make sure you upgrade by running `pip install --upgrade pnpl`

**NB**: This is quite a big release for us, so while we have done a lot of testing in advance, please let us know if anything does not work as expected or if you encounter any issues. We look forward to seeing what you will build!

## Questions?

Join our [Discord community](https://neural-processing-lab.github.io/2025-libribrain-competition/links/discord) for real-time support and discussions with fellow participants and organizers.

---

*Good luck to all participants. We look forward to seeing the innovative approaches you'll develop.* 