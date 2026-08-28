// Outreach kit content for /outreach/. Edit the copy here.
// Source files live in the private workspace folder ./outreach/ (poster PDF/PNG,
// "Shareable Text Snippets.md"); the poster files are copied to public/outreach/.
// House style: no em dashes in copy, and it is "Twitter", not "X".

export const OUTREACH = {
  siteUrl: 'https://libribrain.com',

  poster: {
    pdf: '/outreach/PNPL-Competition-2026-Poster.pdf',
    png: '/outreach/PNPL-Competition-2026-Poster.png',
    preview: '/outreach/PNPL-Competition-2026-Poster-preview.jpg',
    pdfLabel: 'PDF · 1.9 MB · 16:9 (1440 × 810 pt)',
    pngLabel: 'PNG · 0.9 MB · 1920 × 1080',
    alt: 'PNPL Competition 2026 poster: Apply your AI skills to push the limits of non-invasive speech brain-computer interfaces. $5,000 in prizes, 100 hours of open data, two tracks (Deep & Broad), tutorial materials, community Discord. Start training your models today at libribrain.com.',
  },

  /** Longer blurb for Slack, mailing lists, newsletters, Discord announcements. */
  shareText: `🧠 The 2026 PNPL Competition is live: decode words from the human brain.

The challenge: predict which of 50 words a subject is listening to, straight from non-invasive MEG brain recordings. No neuroscience background needed. Just open the Colab notebook, pip install pnpl, and you can train your first decoder in under an hour.

There are two tracks, and you can enter either or both:
- Deep asks how far you can push accuracy on a single, deeply-sampled brain.
- Broad asks whether your model can generalise to 32 unseen subjects.

📊 Both run on LibriBrain100: 100+ hours across 33 subjects, the deepest public MEG language dataset out there.

🏆 $5,000 in prizes. Submissions are open now and close 15 October 2026 (AoE), via Kaggle.

Organised by the Neural Processing Lab at Oxford, with collaborators from Google DeepMind, Mila, EPFL, OHBA and WIN. 👩‍💻 Get started at libribrain.com`,

  /** Fits Twitter (280 weighted characters) and Bluesky (300 graphemes). */
  tweet: `🧠 Decode words from the brain: the 2026 PNPL Competition is live.

Predict which of 50 words a listener hears from non-invasive MEG. No neuroscience needed: pip install pnpl. Two tracks, 100+ hours of data, 🏆 $5K in prizes. ⏳ Deadline 15 Oct 2026 → libribrain.com`,

  /** LinkedIn post (limit 3,000 characters). */
  linkedin: `🧠 Can you decode words from brain activity? The 2026 PNPL Competition is live.

The task: predict which of 50 words a person is listening to, using only non-invasive MEG recordings of their brain. It is a small but real step towards speech brain-computer interfaces that do not require surgery.

You do not need a neuroscience background. Open the Colab notebook, pip install pnpl, and you can train your first decoder in under an hour. Tutorials, baselines and standard data splits are all provided.

Two tracks, and you can enter either or both:
🔬 Deep: how far can you push accuracy on a single, deeply sampled brain, with more than 80 hours of recordings from one person?
🌍 Broad: does your model generalise to 32 subjects it has never seen before?

Both run on LibriBrain100, the deepest public MEG language dataset to date: over 100 hours across 33 subjects.

🏆 $5,000 in prizes. Submissions are open now on Kaggle and close on 15 October 2026 (Anywhere on Earth).

Organised by the Parker Jones Neural Processing Lab at the University of Oxford, with collaborators from Google DeepMind, Mila, EPFL, OHBA and WIN.

👉 Get started at libribrain.com. Please share with anyone who might enjoy the challenge!

#BCI #NeuroAI #MachineLearning #Neuroscience #MEG #SpeechDecoding`,

  links: [
    { label: 'Competition website', url: 'https://libribrain.com' },
    { label: '2026 edition: overview & task', url: 'https://libribrain.com/editions/2026/' },
    { label: 'Get started: tutorials & Colab notebooks', url: 'https://libribrain.com/editions/2026/participate/' },
    { label: 'Kaggle: Deep track', url: 'https://www.kaggle.com/competitions/pnpl-competition-2026-deep/' },
    { label: 'Kaggle: Broad track', url: 'https://www.kaggle.com/competitions/pnpl-competition-2026-broad/' },
    { label: 'Community Discord', url: 'https://libribrain.com/links/discord' },
    { label: 'pnpl Python package (GitHub)', url: 'https://github.com/neural-processing-lab/pnpl' },
  ],
};

/**
 * Approximation of Twitter's character weighting: URLs count as 23, most
 * Latin characters as 1, emoji and other symbols as 2. Good enough for a hint.
 */
export function tweetLength(text: string): number {
  const withUrls = text.replace(/https?:\/\/\S+|\b[\w-]+\.(?:com|org|ai|io|net)\b\S*/g, 'x'.repeat(23));
  let n = 0;
  for (const ch of withUrls) {
    const c = ch.codePointAt(0) ?? 0;
    n += c <= 4351 || (c >= 8192 && c <= 8205) || (c >= 8208 && c <= 8223) || (c >= 8242 && c <= 8247) ? 1 : 2;
  }
  return n;
}

export const TWEET_LIMIT = 280;
export const LINKEDIN_LIMIT = 3000;

/** LinkedIn counts plain characters. */
export function plainLength(text: string): number {
  return [...text].length;
}
