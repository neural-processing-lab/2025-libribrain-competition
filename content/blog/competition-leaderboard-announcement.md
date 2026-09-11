---
title: "Competition Leaderboard Announcement"
date: 2026-09-11T00:00:00Z
description: "A mapping between deep track and broad track labels was discoverable through released metadata. Using it is against the rules, and offending submissions will be disqualified."
authors: ["PNPL Organising Team"]
tags: ["competition", "announcement", "2026", "broad-track", "deep-track"]
---

Dear competitors,

We have recently been made aware that a mapping can be found between the labels in the deep track and the broad track. This could have allowed some teams to submit their (likely stronger) predictions made for the deep track to the corresponding samples in the broad track, artificially inflating some of the scores on the broad track leaderboard.

This was made possible due to an oversight on our part. Absolute timing information was made available through the released `word_onset_s` metadata. This timing information allows predictions made for subject 0 (deep track) to be aligned to the corresponding indices for other subjects (broad track). Furthermore, the `shuffle_seed` metadata could also be used to unshuffle the isolated-word samples for any subject, allowing them to correspond similarly. We apologise to competitors for this error.

The intention of the broad track is to encourage methods that improve multi-subject generalisation. In our view, using the metadata as described above goes against the spirit of the competition as those competitors would not be making predictions for each subject in the broad track and instead repurposing their predictions from other subjects. Therefore, we will treat this as against the rules.

At the end of the competition, we will check that all code submissions for the broad track follow these rules and any teams with submissions that do not will have both their broad and deep track submissions disqualified. They will also not be eligible for prizes and we will retrospectively delete those entries from the leaderboard. We implore any teams who have been using the metadata unfairly to remove those entries from the leaderboard and make a new attempt.

We thank competitors for continuing to push the boundaries of multi-subject generalisation in non-invasive brain-to-text decoding as part of the competition. We encourage those who initially felt that their entries were not competitive on the broad track to keep trying – it is possible that some of the top entries could be disallowed at the end of the competition and the true frontier is closer than it may seem.

Best of luck,

The PNPL organising team
