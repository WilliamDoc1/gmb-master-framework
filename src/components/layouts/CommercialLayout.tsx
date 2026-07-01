import { useState, useEffect } from 'react';
import { Phone, Mail, ChevronDown, Menu, X, MapPin, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import dna from '../../data/client-dna.json';
import { config } from '../IndustryConfig';

export function CommercialLayout() {
  const [drop, setDrop] = useState<string|null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const loc = useLocation();
  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;

  useEffect(() => { setMob(false); }, [loc]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Build nav items from taxonomy + service lookup
  const navTax = dna.navigation.taxonomy.map(cat => ({
    category: cat.category,
    services: cat.services.map(id => dna.services.find(s => s.id === id)!).filter(Boolean),
  }));

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">

      {/* TOP BAR */}
      <div className="bg-[var(--color-primary)] text-white py-2 px-4 text-xs z-50 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
              </span>
              <span className="text-[var(--color-accent)] uppercase text-[10px] font-black">{config.showEmergencyBar ? `${dna.trust.badges[0]} — ${dna.trust.badges[2]}` : dna.brand.tagline}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-white/60 text-[10px]">
              {dna.trust.badges.slice(1).map(b => (
                <span key={b} className="flex items-center gap-1"><Shield size={11} className="text-[var(--color-accent)]"/>{b}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-[10px]">
            <span className="hidden sm:flex items-center gap-1"><MapPin size={11} className="text-[var(--color-accent)]"/>{dna.seo.serviceRadius}</span>
            <a href={`mailto:${dna.contact.email}`} className="hover:text-[var(--color-accent)] flex items-center gap-1 transition-colors"><Mail size={11}/>{dna.contact.email}</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className={`bg-white z-40 sticky top-0 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-3 shadow-md'}`}>
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-3">
            {dna.brand.logo ? (
              <img src={dna.brand.logo} alt={dna.brand.name} className="h-14 w-auto"/>
            ) : (
              <div className="bg-[var(--color-primary)] px-3 py-2 rounded border-l-4 border-[var(--color-accent)]">
                <div className="text-[var(--color-accent)] text-lg font-black tracking-tight leading-none">{dna.brand.shortName.toUpperCase()}</div>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center text-xs font-black text-gray-800 uppercase tracking-wide">
            {navTax.map(cat => (
              <div key={cat.category} className="relative group px-3 py-6 -my-6"
                onMouseEnter={() => setDrop(cat.category)}
                onMouseLeave={() => setDrop(null)}>
                <button className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
                  {cat.category}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${drop === cat.category ? 'rotate-180 text-[var(--color-accent)]' : 'text-gray-400'}`}/>
                </button>
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[420px] transition-all duration-200 origin-top ${drop === cat.category ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                  <div className="bg-white shadow-2xl border-t-4 border-[var(--color-accent)] rounded-b-xl overflow-hidden flex">
                    <div className="w-2/5 bg-[var(--color-primary)] p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-[var(--color-accent)] text-[10px] font-black tracking-widest mb-2 uppercase">{cat.category}</div>
                        <h3 className="text-base font-black text-white mb-2 leading-tight normal-case">{cat.category} Services</h3>
                      </div>
                      <a href={`tel:${ph1.raw}`} className="text-[var(--color-accent)] flex items-center gap-2 font-bold text-xs mt-4 hover:text-white transition-colors normal-case">Free Quote <ArrowRight size={11}/></a>
                    </div>
                    <div className="w-3/5 p-6 space-y-2">
                      {cat.services.map(s => (
                        <Link key={s.id} to={`/${s.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded px-2 py-2 -mx-2 transition-colors group">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0"></div>
                          <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 normal-case">{s.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/about" className="px-3 py-6 -my-6 hover:text-[var(--color-accent)] transition-colors">About</Link>
            <Link to="/contact" className="px-3 py-6 -my-6 hover:text-[var(--color-accent)] transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded text-xs font-black uppercase tracking-wide transition-colors">
              <MessageCircle size={14}/> WhatsApp
            </a>
            {config.primaryCTA === 'phone' ? (
              <a href={`tel:${ph1.raw}`} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-4 py-3 rounded text-xs font-black uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg"><Phone size={14}/><span className="hidden sm:inline">{ph1.display}</span><span className="sm:hidden">Call</span></a>
            ) : (
              <a href="/contact" className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-4 py-3 rounded text-xs font-black uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg">{config.ctaLabel}</a>
            )}
            <button className="lg:hidden p-2 text-gray-800 hover:bg-gray-100 rounded" onClick={() => setMob(!mob)}>
              {mob ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>

        {mob && (
          <div className="lg:hidden bg-[var(--color-primary)] text-white border-t border-white/10 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {navTax.map(cat => (
                <div key={cat.category}>
                  <div className="text-[var(--color-accent)] font-black text-[10px] uppercase tracking-widest px-2 py-3 mt-3">{cat.category}</div>
                  {cat.services.map(s => (
                    <Link key={s.id} to={`/${s.id}`} className="block px-4 py-2.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded">{s.title}</Link>
                  ))}
                </div>
              ))}
              <div className="border-t border-white/10 pt-4 mt-4">
                <Link to="/about" className="block px-4 py-2.5 text-sm font-bold text-gray-300">About Us</Link>
                <Link to="/contact" className="block px-4 py-2.5 text-sm font-bold text-gray-300">Contact</Link>
              </div>
              <div className="pt-4 space-y-2">
                <a href={`tel:${ph1.raw}`} className="flex items-center justify-center gap-3 bg-[var(--color-accent)] text-[var(--color-primary)] px-6 py-4 rounded font-black text-base uppercase"><Phone size={18}/>{ph1.display}</a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded font-black text-base uppercase"><MessageCircle size={18}/>WhatsApp</a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center w-full"><Outlet/></main>

      {/* FOOTER */}
      <footer className="bg-[var(--color-primary)] text-gray-400 pt-20 pb-10 border-t-8 border-[var(--color-accent)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            <div className="space-y-6">
              {dna.brand.logo
                ? <img src={dna.brand.logo} alt={dna.brand.name} className="h-16 w-auto brightness-0 invert"/>
                : <div className="text-[var(--color-accent)] text-2xl font-black">{dna.brand.name}</div>
              }
              <p className="text-sm font-medium leading-relaxed text-gray-500">{dna.seo.metaDescription}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-500"><MapPin size={13} className="text-[var(--color-accent)] shrink-0 mt-0.5"/>{dna.contact.address.street}, {dna.contact.address.city}</div>
                <a href={`tel:${ph1.raw}`} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors"><Phone size={13} className="text-[var(--color-accent)]"/>{ph1.display}</a>
                <a href={`mailto:${dna.contact.email}`} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors"><Mail size={13} className="text-[var(--color-accent)]"/>{dna.contact.email}</a>
              </div>
              <div className="flex gap-2 flex-wrap">
                {dna.trust.badges.map(b => (
                  <div key={b} className="px-2 py-1 rounded bg-white/5 text-[10px] font-black text-white/40 border border-white/10 uppercase">{b}</div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2"><div className="w-2 h-2 bg-[var(--color-accent)] rounded-sm"></div>Services</h4>
              <ul className="space-y-2">
                {dna.services.map(s => (
                  <li key={s.id}><Link to={`/${s.id}`} className="text-gray-500 hover:text-[var(--color-accent)] transition-colors text-sm flex items-center gap-2"><ArrowRight size={11} className="opacity-40"/>{s.title}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-wider mb-6 flex items-center gap-2"><div className="w-2 h-2 bg-[var(--color-accent)] rounded-sm"></div>Service Areas</h4>
              <div className="flex flex-wrap gap-1.5">
                {dna.navigation.serviceAreas.map(a => (
                  <span key={a} className="text-[10px] bg-white/5 border border-white/10 text-gray-500 px-2 py-0.5 rounded font-medium">{a}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-white font-black uppercase tracking-wider mb-1">Free Quote</h4>
              <p className="text-xs text-gray-500 mb-5">Same-day response. No obligation.</p>
              <form className="space-y-3" onSubmit={e => e.preventDefault()} data-netlify="true" name="footer-quote" method="POST">
                <input type="hidden" name="form-name" value="footer-quote"/>
                <input type="text" placeholder="Your Name" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                <input type="tel" placeholder="Phone Number" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                <select className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-colors">
                  <option value="">Select Service...</option>
                  {dna.services.map(s => <option key={s.id}>{s.title}</option>)}
                </select>
                <button type="submit" className="w-full bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] font-black text-sm py-3 rounded transition-all uppercase tracking-wide">Request Free Quote</button>
              </form>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
            <div>© {new Date().getFullYear()} {dna.brand.name}. All Rights Reserved.</div>
            <div>{dna.contact.address.city}, {dna.contact.address.province}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
