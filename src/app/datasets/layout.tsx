import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './datasets.css';

export default function DatasetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="ds">{children}</main>
      <Footer />
    </>
  );
}
