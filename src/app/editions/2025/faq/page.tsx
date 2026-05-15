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
        a: 'The PNPL Competition is presented at NeurIPS 2025 and invites AI researchers and students to take part in the challenge of non-invasively decoding language from the brain. The 2025 edition is built around the LibriBrain dataset. Our goal is to spark an "ImageNet moment" for brain-computer interfaces, lowering the barrier of entry for researchers to contribute to this exciting field.',
      },
      {
        q: 'What tasks are included in the competition?',
        a: 'There are two core tasks:\n\n- **Speech Detection**: Train a model to distinguish speech vs. silence based on brain activity measured by MEG during a listening session\n- **Phoneme Classification**: Build a classifier that maps MEG data to the specific phonemes being heard',
      },
      {
        q: 'What are the different tracks?',
        a: 'We offer two tracks per task:\n\n- **Standard Track**: Only LibriBrain training dataset allowed \u2014 designed to level the playing field and emphasise algorithmic innovation\n- **Extended Track**: Any data allowed \u2014 designed to embrace scale and see how far teams with resources can go',
      },
      {
        q: 'Can I participate in multiple tracks?',
        a: 'Yes! You\u2019re welcome to enter any and all tracks. However, prize money will be awarded to each team only once \u2014 if you place in multiple tasks/tracks, the lower prize you would win rolls down to the next eligible team.',
      },
    ],
  },
  {
    title: 'Timeline & Deadlines',
    items: [
      {
        q: 'When does the competition run?',
        a: 'The competition runs in two phases:\n\n- **Phase 1 (Speech Detection)**: June 1 \u2013 July 31, 2025\n- **Phase 2 (Phoneme Classification)**: August 1 \u2013 September 30, 2025\n- **Winners Announced**: October 10, 2025',
      },
      {
        q: 'When was the dataset released?',
        a: 'The LibriBrain dataset was released on June 1, 2025.',
      },
    ],
  },
  {
    title: 'Participation & Eligibility',
    items: [
      {
        q: 'Who can participate?',
        a: 'The competition is open to all! No domain-specific knowledge or specialised hardware is required \u2014 everyone is welcome to join.',
      },
      {
        q: 'How do I get started?',
        a: 'Check out the Participate page, where we have put together detailed instructions and tutorials for both tasks as well as a submission tutorial.',
      },
    ],
  },
  {
    title: 'Team Composition & Rules',
    items: [
      {
        q: 'Can the same team participate in both phases?',
        a: 'Yes, the same team can participate in both Phase 1 (Speech Detection) and Phase 2 (Phoneme Classification). However, if the same team wins the same prize tier in both phases, they will be bumped down to the next tier for one of the phases.',
      },
      {
        q: 'Can one person join multiple teams?',
        a: 'No, each person can only be part of one team for each phase. You cannot join multiple teams simultaneously. You may switch teams between phases.',
      },
      {
        q: 'Are there any restrictions on team size?',
        a: 'No, there are no minimum or maximum team size limits. You can compete individually or form teams of any size.',
      },
    ],
  },
  {
    title: 'Technical Questions',
    items: [
      {
        q: 'How do I access the data?',
        a: 'The LibriBrain dataset comes with a user-friendly Python library. Simply run `pip install pnpl` to get started. You can also find the raw dataset on HuggingFace.',
      },
      {
        q: 'What are the benchmark scores to beat?',
        a: 'To be eligible for prizes, submissions must exceed these benchmarks:\n\n- **Speech Detection**: F1_macro \u2265 68%\n- **Phoneme Classification**: F1_macro \u2265 6.1%\n\nNote that these are based on internal benchmark models, not baseline/random scores.',
      },
      {
        q: 'What are the submission limits?',
        a: 'Max submissions/day: 5, Max total submissions: 50, Max concurrent submissions: 3. These limits are per task and per track.',
      },
    ],
  },
  {
    title: 'Prizes & Evaluation',
    items: [
      {
        q: 'What prizes are available?',
        a: 'The total prize pool is $10,000. Top 3 confirmed submissions in each track win prizes, provided they exceed the benchmark scores.',
      },
      {
        q: 'How will final rankings be determined?',
        a: 'All final rankings are determined on an independent holdout dataset that participants cannot access, ensuring fairness and preventing data leakage.',
      },
    ],
  },
  {
    title: 'Support & Communication',
    items: [
      {
        q: 'Where can I get help or ask questions?',
        a: 'Join our Discord server for real-time Q&A, technical support, and community discussion. You can also send questions to: libribrain@robots.ox.ac.uk',
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

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="FAQ" subtitle="Frequently Asked Questions">
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
