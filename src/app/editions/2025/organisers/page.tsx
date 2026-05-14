import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const organisers = [
  { name: 'Oiwi Parker Jones', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/oiwi.png', url: 'https://pnpl.robots.ox.ac.uk/people/#oiwi-parker-jones' },
  { name: 'Francesco Mantegna', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/francesco.png', url: 'https://neural-processing-lab.github.io/people/#francesco-mantegna' },
  { name: 'Miran \u00d6zdogan', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/miran.png', url: 'https://neural-processing-lab.github.io/people/#miran-%C3%B6zdogan' },
  { name: 'Dulhan Jayalath', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/dulhan.png', url: 'https://neural-processing-lab.github.io/people/#dulhan-jayalath' },
  { name: 'Gilad Landau', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/gilad.png', url: 'https://neural-processing-lab.github.io/people/#gilad-d-landau' },
  { name: 'Pratik Somaiya', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/pratik.jpg', url: 'https://neural-processing-lab.github.io/people/#pratik-somaiya' },
  { name: 'Gereon Elvers', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/gereon.jpeg', url: 'https://gereonelvers.com/' },
  { name: 'Luisa Kurth', affiliation: 'PNPL, University of Oxford', image: 'https://neural-processing-lab.github.io/team/luisa.jpg', url: 'https://neural-processing-lab.github.io/people/#luisa-kurth' },
  { name: 'Teyun Kwon', affiliation: 'PNPL, University of Oxford', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzsr64C0yypJw82eoGUqhQZC-Xrg8kEp4Yrg&s', url: 'https://uk.linkedin.com/in/john-teyun-kwon' },
  { name: 'Brendan Shillingford', affiliation: 'Google DeepMind', image: 'https://www.cs.ox.ac.uk/files/6815//me.jpg', url: 'https://scholar.google.co.uk/citations?user=0tPZW4kAAAAJ&hl=en' },
  { name: 'Gregory Farquhar', affiliation: 'Google DeepMind', image: 'https://www.cs.ox.ac.uk/files/9700//greg.jpg', url: 'https://scholar.google.co.uk/citations?user=6Z-RC-QAAAAJ&hl=en' },
  { name: 'Minqi Jiang', affiliation: 'Meta AI', image: 'https://imbue.com/preview/minqi-jiang.jpg', url: 'https://minch.co/' },
  { name: 'Karim Jerbi', affiliation: 'Mila, Universit\u00e9 de Montr\u00e9al', image: 'https://mila.quebec/sites/default/files/styles/member_full/public/member/5183/portrait-of-karim-jerbi.jpeg.webp?itok=a5PTCGVH', url: 'https://mila.quebec/en/directory/karim-jerbi' },
  { name: 'Hamza Abdelhedi', affiliation: 'Mila, Universit\u00e9 de Montr\u00e9al', image: 'https://mila.quebec/sites/default/files/styles/member_full/public/member/10372/portrait-of-hamza-abdelhedi.jpeg.webp?itok=Jv2k3ttN', url: 'https://mila.quebec/en/directory/hamza-abdelhedi' },
  { name: 'Yorguin Mantilla Ramos', affiliation: 'Mila, Universit\u00e9 de Montr\u00e9al', image: 'https://media.licdn.com/dms/image/v2/D5603AQGT6bxwmPI6Cg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1688798083899?e=2147483647&v=beta&t=usD9Qbd6WJO5x-jvZoPLMn1WJeZS6Jv1CmwxmJezsdk', url: 'https://mila.quebec/en/directory/yorguin-mantilla-ramos' },
  { name: 'Caglar Gulcehre', affiliation: 'EPFL', image: 'https://static.wixstatic.com/media/d07d46_6f5a859836124649bcbe3d22bbb70cf9~mv2.jpg/v1/fill/w_640,h_880,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d07d46_6f5a859836124649bcbe3d22bbb70cf9~mv2.jpg', url: 'https://people.epfl.ch/caglar.gulcehre?lang=en' },
  { name: 'Mark Woolrich', affiliation: 'OHBA, WIN, University of Oxford', image: 'https://res.cloudinary.com/dwccfildc/c_limit,f_auto,w_1140/v1585272380/prod/2a44928aabbef9b3dd2b97e038fc49a0.jpg', url: 'https://www.win.ox.ac.uk/people/mark-woolrich' },
  { name: 'Natalie Voets', affiliation: 'WIN, University of Oxford', image: 'https://res.cloudinary.com/dwccfildc/c_limit,f_auto,w_1140/v1585061763/prod/0021a3e112be4f8ff4dc95552683f651.jpg', url: 'https://www.ndcn.ox.ac.uk/team/natalie-voets' },
];

export default function OrganisersPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Organisers" subtitle="The team behind the 2025 PNPL Competition">
          <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#444', marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 1rem 0' }}>
              The 2025 PNPL Competition is organised by the{' '}
              <a href="https://pnpl.robots.ox.ac.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#776885' }}>
                Parker Jones Neural Processing Lab (PNPL)
              </a>{' '}
              at Oxford with collaborators from OHBA, WIN, Mila &amp; Universit&eacute; de Montr&eacute;al, EPFL, Google DeepMind, and Meta AI.
            </p>
            <p style={{ margin: '0 0 2rem 0' }}>
              If you have any questions, please check our Discord server or email us at{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk" style={{ color: '#776885' }}>libribrain@robots.ox.ac.uk</a>
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {organisers.map((person) => (
              <a
                key={person.name}
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '1.5rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  textAlign: 'center',
                  display: 'block',
                  background: '#fff'
                }}
              >
                <img
                  src={person.image}
                  alt={person.name}
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
                <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 0.3rem 0', color: '#0a0a0a' }}>
                  {person.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: 1.4 }}>
                  {person.affiliation}
                </p>
              </a>
            ))}
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
