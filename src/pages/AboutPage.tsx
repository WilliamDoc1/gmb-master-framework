import { CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import dna from '../data/client-dna.json';
import SEOMeta from '../components/SEOMeta';
import SchemaMarkup from '../components/SchemaMarkup';

export function AboutPage() {
  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;
  return (
    <div className="w-full">
      <SEOMeta title={`About ${dna.brand.name}`} description={`${dna.brand.tagline}. ${dna.content.about.body.slice(0,120)}...`} canonicalUrl={`${dna._meta.siteUrl}/about`}/>
      <SchemaMarkup pageType="LocalBusiness" pageTitle={`About ${dna.brand.name}`} pageUrl={`${dna._meta.siteUrl}/about`}/>

      <div className="bg-[var(--color-primary)] py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)]"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-[var(--color-accent)] text-xs font-black uppercase tracking-widest mb-4"><Link to="/" className="hover:text-white">{dna.brand.shortName}</Link> <span className="text-white/20 mx-2">/</span> About</div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-3xl mb-6">About {dna.brand.name}</h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl leading-relaxed">{dna.brand.tagline}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-28 space-y-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{dna.content.about.headline}</h2>
            <div className="w-10 h-1 bg-[var(--color-accent)] rounded"></div>
            <p className="text-gray-600 font-medium leading-relaxed">{dna.content.about.body}</p>
            <ul className="space-y-3">
              {dna.content.about.points.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="bg-[var(--color-accent)]/15 p-1 rounded-full shrink-0 mt-0.5 border border-[var(--color-accent)]/20"><CheckCircle2 className="text-[var(--color-accent)]" size={16}/></div>
                  <span className="font-bold text-gray-700 text-sm">{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <a href={`tel:${ph1.raw}`} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-7 py-4 rounded font-black uppercase tracking-wide transition-all flex items-center gap-3"><Phone size={17}/>Call Us</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-7 py-4 rounded font-black uppercase tracking-wide transition-colors flex items-center gap-3"><MessageCircle size={17}/>WhatsApp</a>
            </div>
          </div>
          <div className="h-[500px] rounded-3xl overflow-hidden shadow-xl">
            <img src={dna.content.about.image} alt={`${dna.brand.name} team`} className="w-full h-full object-cover" loading="lazy"/>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {dna.trust.stats.map(s => (
            <div key={s.label} className="bg-[var(--color-light)] border border-gray-100 rounded-2xl p-8 text-center">
              <div className="text-4xl font-black text-[var(--color-accent)] mb-2">{s.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dna.services.map(s => (
            <Link to={`/${s.id}`} key={s.id} className="flex items-center gap-3 bg-[var(--color-light)] border border-gray-100 hover:border-[var(--color-accent)]/40 p-4 rounded-xl transition-colors group">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0"></div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-[var(--color-accent)] transition-colors">{s.title}</span>
              <ArrowRight size={12} className="ml-auto text-gray-400 group-hover:text-[var(--color-accent)] transition-colors"/>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
