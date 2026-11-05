---
title: "Timing Shortcut Review and Re-opened Verification"
date: 2026-11-05T00:00:00Z
description: "Our review suggests a timing shortcut may have contributed to many high-scoring submissions. We are temporarily re-opening verification in both tracks until 15 November 2026, including for a second model that decodes from brain data."
authors: ["PNPL Organising Team"]
tags: ["competition", "announcement", "2026", "deep-track", "broad-track"]
---

Thank you to everyone who has shared checkpoints, code and write-ups. Our review so far suggests that a timing shortcut (detailed [here](https://arxiv.org/abs/2609.40359)) may have contributed to many high-scoring submissions. We are still assessing individual models and will report what we can establish through verification.

The timing shortcut was identified in a recent preprint [Removing Timing Shortcuts Improves Non-Invasive Brain-to-Text](https://arxiv.org/abs/2609.40359) (Jayalath and Parker Jones 2026). When neighbouring word-aligned MEG windows overlap, their shared samples can reveal interval durations between words and thus individual word length (which goes some way to identifying individual words). As the preprint shows, when real brain data is replaced with simulated noise, it was possible to replicate the main result from an important prior word-decoding paper ([d’Ascoli et al. 2025](https://www.nature.com/articles/s41467-025-65499-0)). This means that the timing shortcut can predict word identity without decoding the underlying brain activity. Decoding brain activity is of course the goal, in order to develop safe and effective BCIs for paralysed individuals.

Given that this was discovered late in the competition, we are not proposing to disqualify an otherwise compliant submission solely because it benefits from the timing shortcut. We are working to come up with a solution that will recognise strong machine learning submissions within the competition parameters, while also highlighting contributions that advance brain decoding results. As of writing, we are still on track to announce winners on December 1st – thank you to everyone who has been in touch and shared checkpoints and code for final verification. We note that the timing shortcut is distinct from the cross-track prediction mapping prohibited in our [September notice](https://libribrain.com/blog/competition-leaderboard-announcement/); we are checking code to make sure that submissions are not making use of that.

Finding and explaining limitations in current practices definitely counts as progress when it helps to move the field forward. We mention this to welcome write-ups that investigate transparent timing-only analyses, especially if they go beyond the findings outlined in the preprint mentioned above.

**What this means for you**  
In order to accommodate teams who may want to put forward an alternative model that explicitly excludes the timing-shortcut, we are temporarily re-opening verification for submissions in either track, regardless of leaderboard position or whether you met the earlier deadlines. Please email libribrain@robots.ox.ac.uk by 15 November 2026 (AoE). This deadline applies to verification for both the original and any additional prizes.

Each team may submit up to two models per track: their original entry and, if they believe it is affected by the shortcut, a second existing submission that definitely decodes from brain data. Provided the results show significant improvements over benchmarks (including noise-only inputs), we hope to add an additional prize for this. Unaffected original entries will automatically be considered for any additional prizes, so no action required if your submission did not exploit the timing shortcut. If you would like to submit a second model, please note the following:

* Include your team name, track and the Kaggle submission ID for the result you want us to assess.  
* Provide the corresponding checkpoint, inference and training code, configuration and instructions needed to reproduce it. If you have already supplied these materials, just identify the relevant submission.  
* Ideally: Briefly explain what timing or sequence information your model can access, including information recoverable from overlapping windows, and share any relevant controls or ablations you have already run.

For the sake of fairness, only models submitted to the competition before the original deadline are eligible. Please submit the model as it existed then. Newly trained or modified models are not eligible. Models that mix brain and timing information will be considered; in evaluation, we will try to tease apart the respective contributions and report our findings.

We apologize for any confusion this may have caused. Thank you for helping us make the competition a useful and transparent contribution to neural decoding research.

We still aim to announce the final standings and winners by 1 December 2026\. The workshop write-up deadline remains 1 December; details and the template are on the [workshop papers page](https://libribrain.com/editions/2026/workshop-papers/).

The PNPL organising team
