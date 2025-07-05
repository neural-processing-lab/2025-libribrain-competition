---
layout: "simple"
---

## Rules
The primary aim of the competition is to foster innovation across all levels of expertise and resources. With that in mind, we have tried to make the rules as inclusive as possible.

---

### 1. Eligibility & Participation
- **Open to All**  
  No domain‐specific knowledge or specialized hardware is required—everyone is welcome to join.
- **Inclusivity**  
  We aim for the broadest participation. If you’re unable to complete a full submission, you will **not** be penalized; partial entries are still encouraged.

---

### 2. Tracks
We offer **two parallel tracks** to balance resource‐driven and method‐driven innovation:

1. **Standard Track**
    - **Data Constraint:** Only the LibriBrain training dataset may be used.
    - **Purpose:** Level the playing field for teams with limited compute or data access.
2. **Extended Track**
    - **No Data Limits:** Participants may use any publicly available or proprietary data they believe will help.
    - **Purpose:** Reward scale‐driven breakthroughs without data restrictions.

> **Note:** You may submit to both tracks. Your progress will appear on each leaderboard, but **prize money can only be won once per team**. If your team ranks first on both tracks, you’ll still be listed on both leaderboards; the prize for the second win rolls down to the next eligible team.

---

### 3. Prizes & Evaluation
- **Benchmarks to Beat**
    - Speech Detection: F1<sub>macro</sub> ≥ 68%
    - Phoneme Classification: F1<sub>macro</sub> ≥ 60%
- **Winners**
    - Top 3 confirmed submissions in each track, **provided** they exceed the example benchmarks.
    - In the unlikely event of a tie, the prize pool for that position will be **split equally**.
- **Verification**
    - Standard Track finalists: organizers will request training code to confirm no external data was used.
    - Extended Track finalists: we will reach out to discuss compute usage for a discussion on efficiency; to distinguish the Extended Track from the Standard Track (e.g., so that the same models aren’t submitted to both tracks without meaningful innovations), we may ask for evidence (e.g., code and baseline model using only the LibriBrain data) which demonstrates that submissions improve significantly from the inclusion of multiple datasets.

---

### 4. Code Sharing & Open Science
- **While not strictly required, you are strongly encouraged to**
    - Share your solution code publicly (e.g., GitHub).
    - Contribute to the [PNPL library](https://github.com/pnpl/pnpl) by submitting pull requests (e.g., new dataset dataloaders) with any modifications you found useful.

---

### 5. Data Leakage & Final Ranking
- To ensure fairness, all final rankings will be determined on an **independent holdout dataset** that participants cannot access.

---

### 6. Communication & Support
- **Primary Platform:**  
  Join our **[Discord server](https://neural-processing-lab.github.io/2025-libribrain-competition/links/discord)** for real-time Q&A, technical support, and community discussion.
- **Updates & Announcements:**  
  Important rule changes, deadline reminders, and clarifications will be posted directly in the Discord channel.

---

Thank you for participating! We look forward to seeing your innovative approaches and celebrating the societal impact of speech decoding technologies.
