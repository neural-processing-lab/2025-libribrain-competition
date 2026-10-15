import type { Metadata } from 'next';
import LibriBrain100Page from './LibriBrain100Page';

export const metadata: Metadata = {
  title: 'LibriBrain100 | 100+ Hours of Broad and Deep MEG',
  description:
    'LibriBrain100: 104 hours of MEG from 33 listeners: 80 hours from one person across the full Sherlock Holmes canon, TIMIT, MOCHA-TIMIT and The Moth, plus 32 new subjects for cross-subject decoding.',
  alternates: { canonical: '/datasets/libribrain100/' },
};

export default function Page() {
  return <LibriBrain100Page />;
}
