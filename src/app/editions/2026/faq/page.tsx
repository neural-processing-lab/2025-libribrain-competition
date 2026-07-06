'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const faqSections = [
  {
    title: 'General Competition Questions',
    items: [
      {
        q: 'What is the PNPL Competition?',
        a: 'The PNPL Competition is an annual challenge on non-invasively decoding language from the brain, organised by the Parker Jones Neural Processing Lab (PNPL) at Oxford together with collaborators. Following the inaugural 2025 edition at NeurIPS, the 2026 competition centres on word classification using the new LibriBrain100 dataset. Our goal is to spark an "ImageNet moment" for brain-computer interfaces, lowering the barrier of entry for the research community to contribute to this field.',
      },
      {
        q: 'What is the task this year?',
        a: 'Word classification. Given a short window of MEG brain activity recorded while someone listens to spoken English, predict which word they were hearing from a fixed vocabulary of 50 words. The task is closed-vocabulary — it is not open-vocabulary decoding.',
      },
      {
        q: 'How is 2026 different from 2025?',
        a: 'The 2025 edition focused on speech detection and phoneme classification on the original LibriBrain dataset. In 2026 we step up to word classification and introduce LibriBrain100 — over 100 hours of MEG across 33 subjects — with two tracks (Deep and Broad), hosted on Kaggle.',
      },
      {
        q: 'What are the two tracks?',
        a: 'Both tracks share the same word-classification task but ask different questions about generalisation:\n\n- Track 1 — Deep: word classification on a single, deeply-sampled subject (subj0). How far can you push accuracy when data from one brain is abundant?\n- Track 2 — Broad: word classification across 32 held-out subjects (subj1–subj32). How well can a model generalise to new brains from limited data?',
      },
      {
        q: 'Can I enter both tracks?',
        a: 'Yes! You are welcome to submit to either or both. Your progress appears on each track’s leaderboard. However, prize money is awarded only once per team — if you place in the top 3 on multiple leaderboards, the additional prize rolls down to the next eligible team.',
      },
    ],
  },
  {
    title: 'Timeline & Deadlines',
    items: [
      {
        q: 'When does the competition run?',
        a: 'Resources and our first tutorial are available now (soft launch). Submissions open on 15 July 2026 and close on 15 October 2026, Anywhere on Earth (AoE) — a three-month window.',
      },
      {
        q: 'Can I start now, before submissions open?',
        a: 'Yes. The data and the intro tutorial are already live, so you can explore the dataset and start building a model before submissions open on 15 July. More tutorial material will follow over the coming weeks.',
      },
    ],
  },
  {
    title: 'Participation & Eligibility',
    items: [
      {
        q: 'Who can participate?',
        a: 'Everyone is welcome. No neuroscience background or specialised hardware is required, and free GPU access is available through Google Colab.',
      },
      {
        q: 'How do I get started?',
        a: 'Head to the Participate page. Read the rules and the task description, then work through the intro Colab notebook, which takes you from zero to a trained, evaluated word-classification model on a free GPU.',
      },
      {
        q: 'Do I have to compete as a team?',
        a: 'No — you can enter individually or as a team of any size. Note that prize money is awarded only once per team.',
      },
    ],
  },
  {
    title: 'Data & Evaluation',
    items: [
      {
        q: 'What is LibriBrain100?',
        a: 'LibriBrain100 is a major expansion of the original LibriBrain dataset, bringing the total to over 100 hours of MEG data across 33 subjects. It pairs the deeply-sampled subj0 recordings behind Track 1 — spanning audiobooks, phonetically balanced speech corpora (TIMIT, MOCHA-TIMIT), and narrative podcasts — with data from 32 additional subjects behind Track 2.',
      },
      {
        q: 'How do I access the data?',
        a: 'Through the pnpl Python library — simply run `pip install pnpl` to get started. The intro tutorial walks you through loading the data and looking at a single MEG example.',
      },
      {
        q: 'How are submissions evaluated?',
        a: 'By top-10 balanced accuracy (BAcc@10) over the 50-word vocabulary: a prediction counts as correct if the true word is among your model’s ten most likely candidates, balanced across classes so that rarer words matter as much as common ones.',
      },
      {
        q: 'How much training data is available per Broad subject?',
        a: 'Track 2 subjects are split into three groups by the amount of fine-tuning data, so the competition can study how performance scales:\n\n- 100%: 12 subjects, ~40 min of audiobook listening each\n- 50%: 10 subjects, ~20 min each\n- 25%: 10 subjects, ~10 min each',
      },
    ],
  },
  {
    title: 'Submissions & Prizes',
    items: [
      {
        q: 'Where do I submit?',
        a: 'Each track has its own Kaggle competition — pnpl-competition-2026-deep and pnpl-competition-2026-broad. Create a Kaggle account, accept the competition rules on the relevant track page, and upload your submission via Submit Predictions. Submissions open 15 July 2026.',
      },
      {
        q: 'How will final rankings be determined?',
        a: 'All final rankings are determined on independent holdout data that participants cannot access, recorded with stimuli entirely different from anything released — ensuring fairness and preventing data leakage.',
      },
      {
        q: 'What prizes are available?',
        a: 'The top 3 confirmed teams per track win prizes, provided they beat the reference baselines. Each team may win prize money only once across the competition. Prize amounts and baseline values will be announced ahead of the submission window.',
      },
      {
        q: 'How are winners verified?',
        a: 'After the deadline, all top-ranking teams are asked to provide runnable model checkpoints, and we may ask specific teams for their training code, so we can verify no cheating took place. The top 3 confirmed teams per track are declared the winners.',
      },
      {
        q: 'Are there submission limits?',
        a: 'Submission limits (per day and in total) are shown on each Kaggle competition page.',
      },
    ],
  },
  {
    title: 'Support & Open Science',
    items: [
      {
        q: 'Where can I get help or ask questions?',
        a: 'Join our Discord server for real-time Q&A, technical support, and community discussion: libribrain.com/links/discord. You can also email us at libribrain@robots.ox.ac.uk.',
      },
      {
        q: 'Do I have to share my code?',
        a: 'It is not required, but strongly encouraged. We also welcome pull requests to the pnpl library — for example, adding data loaders for new datasets — to help accelerate the whole community.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      borderBottom: '1px solid #eee',
      padding: '0',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.2rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
          color: '#0a0a0a',
          textAlign: 'left',
          lineHeight: 1.4,
          gap: '1rem'
        }}
      >
        {q}
        <span style={{
          fontSize: '18px',
          color: '#999',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
          flexShrink: 0
        }}>
          +
        </span>
      </button>
      {isOpen && (
        <div style={{
          paddingBottom: '1.2rem',
          fontSize: '15px',
          lineHeight: 1.7,
          color: '#555',
          whiteSpace: 'pre-line'
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="FAQ" subtitle="Frequently Asked Questions">
          <div>
            {faqSections.map((section) => (
              <div key={section.title} style={{ marginBottom: '2.5rem' }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#776885',
                  margin: '0 0 0.5rem 0'
                }}>
                  {section.title}
                </h3>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
