---
layout: "simple"
---

## Frequently Asked Questions

### General Competition Questions

**Q: What is the LibriBrain Competition?**  
A: The LibriBrain Competition is presented at NeurIPS 2025 and invites AI researchers and students to take part in the challenge of non-invasively decoding language from the brain. Our goal is to spark an "ImageNet moment" for brain-computer interfaces, lowering the barrier of entry for researchers to contribute to this exciting field.

**Q: What tasks are included in the competition?**  
A: There are two core tasks:
- **Speech Detection**: Train a model to distinguish *speech* vs. *silence* based on brain activity measured by MEG during a listening session
- **Phoneme Classification**: Build a classifier that maps MEG data to the specific phonemes being heard

**Q: What are the different tracks?**  
A: We offer two tracks per task:
- **Standard Track**: Only LibriBrain training dataset allowed - designed to level the playing field and emphasize algorithmic innovation
- **Extended Track**: Any data allowed - designed to embrace scale and see how far teams with resources can go

**Q: Can I participate in multiple tracks?**  
A: Yes! You're welcome to enter any and all tracks. However, prize money will be awarded to each team only once - if you place in multiple tasks/tracks, the lower prize you would win rolls down to the next eligible team.

### Timeline & Deadlines

**Q: When does the competition run?**  
A: The competition runs in two phases:
- **Phase 1 (Speech Detection)**: June 1 - July 31, 2025
- **Phase 2 (Phoneme Classification)**: August 1 - September 30, 2025
- **Winners Announced**: October 10, 2025

**Q: When was the dataset released?**  
A: The LibriBrain dataset was released on June 1, 2025.

### Participation & Eligibility

**Q: Who can participate?**  
A: The competition is open to all! No domain-specific knowledge or specialized hardware is required - everyone is welcome to join. We aim for the broadest participation possible.

**Q: How do I get started?**  
A: Check out the ['Participate'](https://neural-processing-lab.github.io/2025-libribrain-competition/participate/) page, where we have put together detailed instructions and tutorials for both tasks as well as a submission tutorial.

### Team Composition & Rules

**Q: Can the same team participate in both phases?**  
A: Yes, the same team can participate in both Phase 1 (Speech Detection) and Phase 2 (Phoneme Classification). However, if the same team wins the same prize tier in both phases (e.g., 1st place in both), they will be bumped down to the next tier for one of the phases to ensure prize distribution across different teams.

**Q: Can I win the same tier for both phases?**  
A: Only if the majority of your team composition is different between phases. In this case, the teams would be considered distinct and eligible for the same prize tier in both phases.

**Q: Can one person join multiple teams?**  
A: No, each person can only be part of one team for each phase. You cannot join multiple teams simultaneously. You may switch teams between phases.

**Q: Can I change my team composition during a phase?**  
A: No, team composition must remain constant throughout each phase. Your team should be the same across both Standard and Extended tracks within the same phase.

**Q: Are there any restrictions on team size?**  
A: No, there are no minimum or maximum team size limits. You can compete individually or form teams of any size.

### Technical Questions

**Q: Where do I submit my results?**  
A: Submissions are made through EvalAI. You'll need to:
1. Create an account on EvalAI
2. Go to the challenge page
3. Create a participant team
4. Upload your predictions in CSV format
Find more details on the ['Participate'](https://neural-processing-lab.github.io/2025-libribrain-competition/participate/) page.

**Q: How do I access the data?**  
A: The LibriBrain dataset comes with a user-friendly Python library. Simply run `pip install pnpl` to get started with easy data access and integration with deep learning frameworks. You can also find the raw dataset on (HuggingFace)[https://huggingface.co/datasets/pnpl/LibriBrain].

**Q: What are the benchmark scores to beat?**  
A: To be eligible for prizes, submissions must exceed these benchmarks:
- **Speech Detection**: F1_macro ≥ 68%
- **Phoneme Classification**: F1_macro ≥ 60%
Note that these are based on our own internal benchmark models, not baseline/random scores!

**Q: What are the submission limits?**  
A: To ensure fair and sustainable competition, the following limits apply:
- **Max submissions/day**: 5
- **Max total submissions**: 50
- **Max concurrent submissions**: 3

These limits are per task and per track, meaning they apply individually to:
- Speech Detection (Standard and Extended separately)
- Phoneme Classification (Standard and Extended separately)

These limits aren't meant to be a barrier. If you have a good reason for running into these limits, please reach out - we may be able to help!

### Prizes & Evaluation

**Q: What prizes are available?**  
A: The total prize pool will be at least $10,000. Top 3 confirmed submissions in each track will win prizes, provided they exceed the benchmark scores. More details will follow.

**Q: How will final rankings be determined?**  
A: All final rankings are determined on an independent holdout dataset that participants cannot access, ensuring fairness and preventing data leakage. The data needed to rank submissions is included in the submissions you make through Eval.ai (and separate from the leaderboard split).

**Q: What verification is required for winners?**  
A: 
- **Standard Track finalists**: Organizers will request training code to confirm no external data was used
- **Extended Track finalists**: We expect less verification will be required, except to verify that multiple datasets *were* used and to discuss compute usage for efficiency analysis. Either way, we appreciate you sharing as many details as possible to make for a productive sessions at NeurIPS 2025.

### Data Usage & Rules

**Q: What data can I use in the Standard Track?**  
A: Only the LibriBrain training dataset may be used in the Standard Track.

**Q: What data can I use in the Extended Track?**  
A: You may use any publicly available or proprietary data you believe will help in the Extended Track.

**Q: Do I need to share my code?**  
A: While not strictly required, you are strongly encouraged to share your solution code publicly (e.g., on GitHub) and contribute to the PNPL library with any useful modifications (more details on this will follow).

### Support & Communication

**Q: Where can I get help or ask questions?**  
A: Join our [Discord server](https://neural-processing-lab.github.io/2025-libribrain-competition/links/discord) for real-time Q&A, technical support, and community discussion. You can also send questions to: libribrain@robots.ox.ac.uk

**Q: Where will important updates be posted?**  
A: Important rule changes, deadline reminders, and clarifications will be posted directly in the Discord channel.

**Q: How is this competition related to NeurIPS?**  
A: The LibriBrain Competition is part of the NeurIPS 2025 Competition Track, with the final awards ceremony taking place during NeurIPS (December 2-7, 2025). 
