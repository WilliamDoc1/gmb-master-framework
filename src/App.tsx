import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommercialLayout } from './components/layouts/CommercialLayout';
import { Home } from './pages/Home';
import { ServicePage } from './pages/ServicePage';
import { LocationPage } from './pages/LocationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import dna from './data/client-dna.json';

function App() {
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--color-primary', dna.brand.colors.primary);
    r.style.setProperty('--color-accent', dna.brand.colors.accent);
    r.style.setProperty('--color-light', dna.brand.colors.light);
    document.title = dna.seo.metaTitle;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommercialLayout />}>
          <Route index element={<Home />} />
          {dna.services.map(s => (
            <Route key={s.id} path={s.id} element={<ServicePage serviceId={s.id} />} />
          ))}
          {dna.locations.map(l => (
            <Route key={l.slug} path={`location/${l.slug}`} element={<LocationPage slug={l.slug} />} />
          ))}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
