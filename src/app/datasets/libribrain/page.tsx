import type { Metadata } from 'next';
import LibriBrainPage from './LibriBrainPage';

export const metadata: Metadata = {
  title: 'LibriBrain | 50+ Hours of Within-Subject MEG',
  description:
    'LibriBrain: over 50 hours of MEG from a single participant listening to the Sherlock Holmes canon. Explore the recordings, annotations, benchmarks and the ecosystem built around it.',
  alternates: { canonical: '/datasets/libribrain/' },
};

export default function Page() {
  return <LibriBrainPage />;
}
