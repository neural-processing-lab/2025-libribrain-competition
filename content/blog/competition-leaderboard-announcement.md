---
title: "Competition Leaderboard Announcement"
date: 2026-09-11T00:00:00Z
description: "A potential source of cross-track leakage in the public broad-track leaderboard has come to our attention. Public leaderboards stay as they are; final rankings will be based on code-reviewed submissions."
authors: ["PNPL Organising Team"]
tags: ["competition", "announcement", "2026", "broad-track", "deep-track"]
---

Dear competitors,

**tl;dr:** Small update: a potential source of cross-track leakage in the public broad-track leaderboard has come to our attention. We are posting this notice here for the sake of transparency and to describe the steps we're taking to address it. While some public leaderboard scores for the broad track may be inflated, all final rankings will be based on code-reviewed submissions - and will therefore be unaffected by the issue. The issue is most likely to affect the broad-track leaderboard, although the mapping can in principle be used in either direction. To minimise disruption, we are not resetting or rescoring the public leaderboards and no action will be needed from most competitors. The only teams who need to take action are those whose existing leaderboard submissions exploited the loophole described below, or whose submitted code will produce results that differ from their public leaderboard scores.

Of course, our aim with the competition is to reward methods that genuinely move non-invasive BCIs closer to useful real-world systems. Given that using the released metadata to map predictions between tracks does not contribute to that goal, it will not be permitted in the final evaluation.

### What happened

A couple of competitors brought to our attention that a mapping can be found between the labels in the deep track and the broad track. This could have allowed some teams to use their predictions made for the deep track for the corresponding samples in the broad track, artificially inflating some of the scores on the broad track leaderboard.

This was made possible because absolute timing information was included in the released `word_onset_s` metadata. This timing information allows predictions made for subject 0 (deep track) to be aligned to the corresponding indices for other subjects (broad track). We note that the `shuffle_seed` metadata could also be used to unshuffle the isolated-word samples for any subject, allowing them to correspond similarly.

We want to thank the competitors who noticed this and brought it to our attention, in particular Umur Yıldız, who identified the exploit and reported it to us. This is exactly the kind of community engagement that helps us improve the benchmark and accelerate progress on non-invasive BCIs together.

### What this means for your score

The final evaluation itself remains valid. The issue is most likely to affect the broad-track leaderboard, although the mapping can in principle be used in either direction. While some public leaderboard scores may therefore be inflated, the final rankings in both tracks will reflect only the code-reviewed submissions. So, don't lose heart if your public leaderboard score looks weak on the broad track - you may end up doing better in the final rankings. We are leaving both leaderboards as they are - no reset or rescoring - to minimise uncertainty and disruption for competitors.

### What counts as a valid broad-track submission

The intention of the broad track is to encourage methods that improve multi-subject generalisation. Consistent with that goal, we want to clarify that broad-track predictions must be generated for the broad-track subjects themselves, rather than obtained by mapping predictions from another track with the shared timing information. As general guidance, information should not be leaked between tracks in a way that bypasses the task being evaluated. This is in line with the purpose of the competition: developing methods that genuinely generalise across people and can ultimately contribute towards useful brain-computer interfaces.

### What to do if this affects you

If one of your existing leaderboard submissions used this mapping, the simplest option is to remove that entry, where possible, and submit a new one generated directly for the broad-track subjects. This will also minimise the risk of confusion when we review the final submissions.

In any case, when you submit your code, please let us know if there is any discrepancy between a score currently shown on the public leaderboard and the result we should expect when we run your submitted code. In particular, if an earlier leaderboard submission used the mapping described above but your submitted code does not, please tell us which entry was affected and explain the difference. The aim is to provide a clear opportunity to flag the issue before code review.

### For completeness

As part of the final evaluation, we will check the code for all prize-eligible submissions for cross-track leakage. If code submitted for final evaluation uses the mapping described above, or a similar form of cross-track leakage, the team will not be eligible for final ranking or prizes in either track. This is to avoid creating an incentive to exploit the leakage in one track while retaining eligibility in the other.

An earlier public leaderboard entry that used the mapping does not itself prevent you from putting forward a valid final submission: remove or replace the affected entry where possible, and tell us about any resulting discrepancy when you submit your code. The important requirement is that the code submitted for final evaluation must not use the cross-track leakage. If there is any uncertainty, please talk to us during the evaluation phase.

Finally, we want to thank you all for continuing to advance the frontiers of brain-to-text decoding.

Happy decoding,

The PNPL organising team
