---
title: "Phase 1 (Speech Detection) is Now Live!"
date: 2025-06-02T00:00:00Z
draft: false
description: "We are excited to announce that Phase 1 of the LibriBrain Competition is now accepting submissions for the Speech Detection task."
tags: ["competition", "speech-detection"]
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

We're excited to announce that **Phase 1 of the LibriBrain Competition is now live** and accepting submissions.

## What's Available Now

Starting today, participants can submit their solutions for the **Speech Detection** task in both:

- **Standard Track**: Using our own "LibriBrain" dataset
- **Extended Track**: Leverage any and all additional data sources

## Key Details

- **Submission Deadline**: July 31st, 2025
- **Evaluation Metric**: F1 Macro Score - the unweighted mean of F1 scores across both classes: {{< math >}}\text{F1}_{\text{macro}} = \frac{\text{F1}_{\text{speech}} + \text{F1}_{\text{non-speech}}}{2}{{< /math >}}
- **Leaderboard**: Competition updates available on our [leaderboard page](/leaderboard/)
- **Starter Kit**: Get up and running in under an hour with our [tutorials](/participate/)

## Getting Started

1. **Install the PNPL package**: `pip install pnpl`
2. **Download the dataset automatically with the PNPL package**: Follow our [participation guide](/participate/)
3. **Train your first mode using our tutorials**: Use our provided notebooks - or build something on your own
4. **Submit your results**: Upload via our submission portal on Eval.ai

## Dataset Features

This competition features the **deepest MEG dataset to date** - 5–50× deeper than most existing datasets in the field. This unprecedented depth enables researchers to explore neural patterns of speech processing at a level of detail not previously possible. This year, we've taken care of all preprocessing and provide simple Pytorch dataloaders.

## Questions?

Join our [Discord community](https://neural-processing-lab.github.io/2025-libribrain-competition/links/discord) for real-time support and discussions with fellow participants and organizers.

---

*Good luck to all participants. We look forward to seeing the innovative approaches you'll develop.* 