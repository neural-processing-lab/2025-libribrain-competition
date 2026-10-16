import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';
import { assetPath } from '../../../../lib/assetPath';

export default function WorkshopPapersPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Papers" subtitle="Paper template and submitted write-ups">
          <div className="prose-custom">
            <p>Teams we invite based on their competition results, as well as any team placing in the top 20 on the public leaderboard, can submit a paper describing their approach. Papers are up to six pages, excluding references and appendices, and must use the 2026 PNPL Competition LaTeX template below.</p>
            <p>The write-ups are a chance to showcase your work. We will publish submitted papers on this website, but this does not count as a formal publication, so you remain free to submit the same work to arXiv or to other workshops and conferences. We will read through each submission, but there is no formal peer-review process.</p>
            <p><strong>Deadline: 1 December 2026.</strong> If you need more time, let us know at <a href="mailto:libribrain@robots.ox.ac.uk">libribrain@robots.ox.ac.uk</a>.</p>

            <div style={{
              background: '#faf8ff',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: '6px',
              padding: '1rem 1.5rem',
              margin: '1.5rem 0 2rem',
              fontSize: '15px'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#7c3aed' }}>Paper Template</p>
              <p style={{ margin: 0, color: '#666' }}>
                LaTeX style file, example source and compiled instructions:{' '}
                <a href={assetPath('/pnpl-2026-paper-template.zip')} style={{ color: '#7c3aed' }}>Download</a>
              </p>
            </div>

            <p>Submitted papers will be listed here. See the <Link href="/editions/2025/workshop-papers/">2025 workshop papers</Link> for examples of past submissions.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
