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
            <p>Teams we invite based on their competition results, as well as any team placing in the top 20 on the public leaderboard, can submit a write-up describing their approach. Write-ups are up to six pages, excluding references and appendices, and must use the 2026 PNPL Competition LaTeX template below.</p>
            <p>We plan to host submitted write-ups here on the competition website, as a way for teams to receive credit for their work and as a useful resource for the community going forward. We read every submission and apply light quality control: if we spot any issues, we will get back to the authors and give them the chance to address them. There is no formal peer review, and hosting a write-up here is not a formal publication, so you are free to submit the same work to arXiv, workshops, conferences or other competitions without restriction.</p>
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

            <p>Submitted write-ups will be listed here. See the <Link href="/editions/2025/workshop-papers/">2025 workshop papers</Link> for examples of past submissions.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
