'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import { assetPath } from '../../../../lib/assetPath';

// Photos are served locally from /public/images/team. Affiliations are inferred from the
// author-list superscripts + the 2025 organisers page; profile links are reused from 2025
// where available. The initials avatar is a fallback if a local image ever fails to load.
const organisers = [
  { name: 'Francesco Mantegna', equal: true, affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/francesco.png'), url: 'https://neural-processing-lab.github.io/people/#francesco-mantegna' },
  { name: 'Gereon Elvers', equal: true, affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/gereon.jpg'), url: 'https://gereonelvers.com/' },
  { name: 'Dulhan Jayalath', equal: true, affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/dulhan.png'), url: 'https://neural-processing-lab.github.io/people/#dulhan-jayalath' },
  { name: 'Gilad Landau', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/gilad.png'), url: 'https://neural-processing-lab.github.io/people/#gilad-d-landau' },
  { name: 'Tasha Kim', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/tasha.jpeg'), url: null },
  { name: 'Miran Özdogan', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/miran.png'), url: 'https://neural-processing-lab.github.io/people/#miran-%C3%B6zdogan' },
  { name: 'Luisa Kurth', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/luisa.jpg'), url: 'https://neural-processing-lab.github.io/people/#luisa-kurth' },
  { name: 'Teyun Kwon', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/john.jpeg'), url: 'https://uk.linkedin.com/in/john-teyun-kwon' },
  { name: 'SungJun Cho', affiliation: 'PNPL & OHBA / WIN, University of Oxford', image: assetPath('/images/team/sungjun.jpg'), url: null },
  { name: 'Benjamin Ballyk', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/benjamin.jpeg'), url: null },
  { name: 'Alex Fung', affiliation: 'PNPL & FMRIB, Oxford Centre for Integrative Neuroimaging, University of Oxford', image: assetPath('/images/team/alex.jpeg'), url: null },
  { name: 'Anna Greer', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/anna.jpeg'), url: null },
  { name: 'Pratik Somaiya', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/pratik.jpg'), url: 'https://neural-processing-lab.github.io/people/#pratik-somaiya' },
  { name: 'Christian Herff', affiliation: 'Maastricht University', image: assetPath('/images/team/christian-herff.jpg'), url: null },
  { name: 'Yorguin Mantilla Ramos', affiliation: 'Mila, Université de Montréal', image: assetPath('/images/team/yorguin.jpeg'), url: 'https://mila.quebec/en/directory/yorguin-mantilla-ramos' },
  { name: 'Hamza Abdelhedi', affiliation: 'Mila, Université de Montréal', image: assetPath('/images/team/Hamza.webp'), url: 'https://mila.quebec/en/directory/hamza-abdelhedi' },
  { name: 'Karim Jerbi', affiliation: 'Mila, Université de Montréal', image: assetPath('/images/team/Karim.webp'), url: 'https://mila.quebec/en/directory/karim-jerbi' },
  { name: 'Greg Farquhar', affiliation: 'Google DeepMind', image: assetPath('/images/team/Greg.jpg'), url: 'https://scholar.google.co.uk/citations?user=6Z-RC-QAAAAJ&hl=en' },
  { name: 'Brendan Shillingford', affiliation: 'Google DeepMind', image: assetPath('/images/team/brendan.jpeg'), url: 'https://scholar.google.co.uk/citations?user=0tPZW4kAAAAJ&hl=en' },
  { name: 'Mark Woolrich', affiliation: 'OHBA, WIN, University of Oxford', image: assetPath('/images/team/Mark.jpg'), url: 'https://www.win.ox.ac.uk/people/mark-woolrich' },
  { name: 'Oiwi Parker Jones', affiliation: 'PNPL, University of Oxford', image: assetPath('/images/team/oiwi.png'), url: 'https://pnpl.robots.ox.ac.uk/people/#oiwi-parker-jones' },
];

function initialsOf(name: string) {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          display: 'block',
          border: '2px solid #f0f0f0'
        }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ede9fe',
        color: '#7c3aed',
        fontSize: '30px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        border: '2px solid #f0f0f0',
        userSelect: 'none'
      }}
    >
      {initialsOf(name)}
    </div>
  );
}

export default function OrganisersPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Organisers" subtitle="The team behind the 2026 PNPL Competition">
          <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#444', marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 1rem 0' }}>
              The 2026 PNPL Competition is organised by the{' '}
              <a href="https://pnpl.robots.ox.ac.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#776885' }}>
                Parker Jones Neural Processing Lab (PNPL)
              </a>{' '}
              at Oxford, with collaborators from OHBA, WIN, Mila &amp; Universit&eacute; de Montr&eacute;al,
              Maastricht University, and Google DeepMind.
            </p>
            <p style={{ margin: '0 0 2rem 0' }}>
              If you have any questions, please join our{' '}
              <a href="http://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer" style={{ color: '#776885' }}>Discord server</a>{' '}
              or email us at{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk" style={{ color: '#776885' }}>libribrain@robots.ox.ac.uk</a>.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {organisers.map((person) => {
              const inner = (
                <>
                  <Avatar name={person.name} src={person.image} />
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 0.3rem 0', color: '#0a0a0a' }}>
                    {person.name}
                    {person.equal && <sup style={{ color: '#7c3aed', marginLeft: '2px' }}>*</sup>}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: 1.4 }}>
                    {person.affiliation}
                  </p>
                </>
              );

              const cardStyle: React.CSSProperties = {
                textDecoration: 'none',
                color: 'inherit',
                padding: '1.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'block',
                background: '#fff'
              };

              return person.url ? (
                <a
                  key={person.name}
                  href={person.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card"
                  style={cardStyle}
                >
                  {inner}
                </a>
              ) : (
                <div key={person.name} className="card" style={cardStyle}>
                  {inner}
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '13px', color: '#999', margin: '1.5rem 0 0 0' }}>
            <sup style={{ color: '#7c3aed' }}>*</sup> Equal contribution.
          </p>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
