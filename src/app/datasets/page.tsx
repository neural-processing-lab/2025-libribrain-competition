import type { Metadata } from 'next';
import DatasetsHub from './DatasetsHub';

export const metadata: Metadata = {
  title: 'Datasets | LibriBrain & LibriBrain100',
  description:
    'The LibriBrain family of open MEG datasets for neural speech decoding: LibriBrain (52 h, one listener) and LibriBrain100 (104 h, 33 listeners), with the pnpl library, competitions and benchmarks built on them.',
  alternates: { canonical: '/datasets/' },
};

export default function Page() {
  return <DatasetsHub />;
}
