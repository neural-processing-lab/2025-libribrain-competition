import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const speechDetection = {
  extended: [
    { place: '1st', team: 'Sherlock Holmes', prize: '$1,200', icon: '🥇' },
    { place: '2nd', team: 'SHINE', prize: '$1,000', icon: '🥈' },
    { place: 'HM', team: 'I_love_silksong', prize: '$300', icon: '⭐' },
  ],
  standard: [
    { place: '1st', team: 'Parameter Team', prize: '$1,200', icon: '🥇' },
    { place: '2nd', team: 'TheLimbicLad', prize: '$1,000', icon: '🥈' },
    { place: '3rd', team: 'alvi', prize: '$800', icon: '🥉' },
  ],
  longAcquisition: [
    { place: '1st', team: 'NeuroAI', prize: '$600', icon: '🥇' },
  ],
};

const phonemeClassification = {
  extended: [
    { place: 'HM', team: 'I_love_silksong', prize: '$300', icon: '⭐' },
  ],
  standard: [
    { place: '1st', team: 'neural2speech', prize: '$1,200', icon: '🥇' },
    { place: '2nd', team: 'BrainWatson', prize: '$1,000', icon: '🥈' },
    { place: '3rd', team: 'sigint', prize: '$800', icon: '🥉' },
  ],
  singleTrial: [
    { place: '1st', team: 'September Labs', prize: '$600', icon: '🥇' },
  ],
};

function WinnerTable({ entries }: { entries: { place: string; team: string; prize: string; icon: string }[] }) {
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9f9f9' }}>
            <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Place</th>
            <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Team</th>
            <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Prize</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
              <td style={{ padding: '0.8rem 1rem', fontSize: '15px' }}>{e.icon} {e.place}</td>
              <td style={{ padding: '0.8rem 1rem', fontSize: '15px', fontWeight: 500 }}>{e.team}</td>
              <td style={{ padding: '0.8rem 1rem', fontSize: '15px', textAlign: 'right', color: '#776885', fontWeight: 600 }}>{e.prize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrizesPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Competition Winners" subtitle="$10,000 total prize pool">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              Congratulations to all the winners of the 2025 PNPL Competition!
            </p>

            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '2.5rem 0 1rem 0', color: '#0a0a0a' }}>
              Speech Detection Track
            </h2>

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Extended Track</h3>
            <WinnerTable entries={speechDetection.extended} />

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Standard Track</h3>
            <WinnerTable entries={speechDetection.standard} />

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Long Acquisition Track</h3>
            <WinnerTable entries={speechDetection.longAcquisition} />

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2.5rem 0' }} />

            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 1rem 0', color: '#0a0a0a' }}>
              Phoneme Classification Track
            </h2>

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Extended Track</h3>
            <WinnerTable entries={phonemeClassification.extended} />

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Standard Track</h3>
            <WinnerTable entries={phonemeClassification.standard} />

            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '1.5rem 0 0.5rem 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Single Trial Track</h3>
            <WinnerTable entries={phonemeClassification.singleTrial} />

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2.5rem 0' }} />
            <p style={{ textAlign: 'center', color: '#888' }}>
              Thank you to all participants for making this competition a success!
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
