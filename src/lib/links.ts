// Short links served at /links/<slug>/ on every host (libribrain.com and the
// GitHub Pages mirror). Each becomes a tiny static redirect page at build time.
// These slugs are referenced from blog posts, tutorials and printed material,
// so keep existing ones stable.

export interface ShortLink {
  url: string;
  label: string;
}

const COLAB_2025 =
  'https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2025';

export const LINKS: Record<string, ShortLink> = {
  discord: { url: 'https://discord.gg/Fqr8gJnvSh', label: 'the PNPL Competition Discord' },
  'speech-colab': { url: `${COLAB_2025}/LibriBrain_Competition_Speech_Detection.ipynb`, label: 'the Speech Detection tutorial notebook (2025)' },
  'phoneme-colab': { url: `${COLAB_2025}/LibriBrain_Competition_Phoneme_Classification.ipynb`, label: 'the Phoneme Classification tutorial notebook (2025)' },
  'submission-colab': { url: `${COLAB_2025}/LibriBrain_Competition_Submission_Tutorial.ipynb`, label: 'the Speech Detection submission tutorial (2025)' },
  'phoneme-submission-colab': { url: `${COLAB_2025}/LibriBrain_Competition_Phoneme_Task_Submission_Tutorial.ipynb`, label: 'the Phoneme Classification submission tutorial (2025)' },
};
