import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import dna from '../data/client-dna.json';
import SEOMeta from '../components/SEOMeta';
import SchemaMarkup from '../components/SchemaMarkup';

export function LocationPage({ slug }: { slug: string }) {
  const loc = dna.locations.find(l => l.slug === slug);
  if (!loc) return <div className="py-32 text-center"><h1 className="text-4xl font-black">Area not found</h1></div>;

  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;
  const title = `${dna.brand.name} ${loc.suburb}`;
  const desc = `Expert roofing, waterproofing and home improvement services in ${loc.suburb}. Free inspection. Same-day quote. ${dna.trust.guarantee}.`;

  return (
    <div className="w-full">
      <SEOMeta title={title} description={desc} canonicalUrl={`${dna._meta.siteUrl}/location/${slug}`} ogType="article"/>
      <SchemaMarkup pageType="LocalBusiness" pageTitle={title} pageUrl={`${dna._meta.siteUrl}/location/${slug}`}
        faqList={[
          { question: `Do you serve ${loc.suburb}?`, answer: `Yes. ${dna.brand.name} serves ${loc.suburb} and all surrounding areas. Call ${ph1.display} for a free inspection and same-day quote.` },
          { question: `What services are available in ${loc.suburb}?`, answer: `All our services are available in ${loc.suburb} including ${dna.services.slice(0,4).map(s=>s.title).join(', ')} and more.` },
        ]}
      />

      {/* HERO */}
      <div className="bg-[var(--color-primary)] py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)]"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-[var(--color-accent)] text-xs font-black uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white">{dna.brand.shortName}</Link> <span className="text-white/20 mx-2">/</span> {loc.suburb}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl mb-6">{dna.brand.name} in {loc.suburb}</h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl leading-relaxed mb-10">{desc}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`tel:${ph1.raw}`} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-8 py-4 rounded font-black uppercase tracking-wide text-lg flex items-center gap-3 justify-center"><Phone size={20}/>{ph1.display}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded font-black uppercase tracking-wide text-lg flex items-center gap-3 justify-center"><MessageCircle size={20}/>WhatsApp</a>
          </div>
        </div>
      </div>

      {/* SERVICES IN THIS AREA */}
      <div className="max-w-[1400px] mx-auto px-6 py-24">
        <h2 className="text-3xl font-black text-gray-900 mb-10">Services Available in {loc.suburb}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dna.services.map(s => (
            <Link to={`/${s.id}`} key={s.id} className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--color-accent)]/30 flex flex-col">
              <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-[var(--color-accent)] transition-colors">{s.title} {loc.suburb}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 flex-grow">{s.shortDesc}</p>
              <div className="flex items-center gap-1 text-[var(--color-accent)] font-black uppercase tracking-wide text-xs">Learn More<ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"/></div>
            </Link>
          ))}
        </div>
      </div>

      {/* TRUST + CTA */}
      <div className="bg-[var(--color-accent)] py-16 text-center px-6">
        <h2 className="text-3xl font-black text-[var(--color-primary)] mb-4">Need {dna.brand.shortName} in {loc.suburb}?</h2>
        <p className="text-[var(--color-primary)]/70 font-bold mb-8">{dna.trust.guarantee} · Free inspection · Same-day quote</p>
        <a href={`tel:${ph1.raw}`} className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-lg text-xl font-black uppercase inline-flex items-center gap-4 shadow-xl"><Phone size={22}/>{ph1.display}</a>
      </div>
    </div>
  );
}
