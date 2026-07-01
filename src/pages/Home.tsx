import { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, Phone, ArrowRight, Quote, Star, MessageCircle, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import dna from '../data/client-dna.json';
import { Img } from '../components/Img';
import { config } from '../components/IndustryConfig';
import SEOMeta from '../components/SEOMeta';
import SchemaMarkup from '../components/SchemaMarkup';

export function Home() {
  const [slide, setSlide] = useState(0);
  const [faq, setFaq] = useState<number|null>(null);
  const { hero, about, process, faq: faqItems } = dna.content;
  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;
  const slides = hero.images;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="w-full">
      <SEOMeta title={dna.seo.metaTitle} description={dna.seo.metaDescription} canonicalUrl={dna._meta.siteUrl + '/'}/>
      <SchemaMarkup pageType="WebSite" faqList={faqItems.map(f => ({ question: f.q, answer: f.a }))}/>

      {/* HERO */}
      <div className="relative min-h-[92vh] flex items-center bg-[var(--color-primary)] overflow-hidden">
        {slides.map((src, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <Img src={src} alt={`${dna.brand.name} - ${dna.brand.tagline}`} className="w-full h-full object-cover object-center" eager={i === 0}/>
            <div className={`absolute inset-0 bg-gradient-to-r ${config.heroOverlay}`}></div>
          </div>
        ))}
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)] z-10"></div>
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'bg-[var(--color-accent)] w-10' : 'bg-white/30 w-5'}`}/>)}
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-6 py-24 w-full relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-[var(--color-accent)]/30">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span></span>
              {config.showEmergencyBar ? `${dna.seo.serviceRadius} — Free Quotes` : dna.brand.tagline}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              {hero.headline.split(' — ')[0]}<br/>
              <span className="text-[var(--color-accent)]">{hero.headline.split(' — ')[1] || ''}</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl border-l-4 border-[var(--color-accent)] pl-6 mb-10">{hero.subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href={hero.ctaPrimary.href} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-8 py-5 rounded font-black uppercase tracking-wide text-lg transition-all flex items-center justify-center gap-3 shadow-2xl">
                <Phone size={22}/>{config.primaryCTA === 'phone' ? hero.ctaPrimary.label : config.ctaLabel}
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-8 py-5 rounded font-black uppercase tracking-wide text-lg transition-colors flex items-center justify-center gap-3">
                <MessageCircle size={22}/>WhatsApp
              </a>
              <a href={hero.ctaSecondary.href} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-5 rounded font-black uppercase tracking-wide text-lg transition-all flex items-center justify-center gap-3">
                {hero.ctaSecondary.label}<ArrowRight size={20}/>
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-gray-400 font-bold uppercase tracking-wider">
              {dna.trust.badges.map(b => (
                <span key={b} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--color-accent)]"/>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="bg-white shadow-2xl relative z-20 -mt-10 mx-4 rounded-2xl border border-gray-100 max-w-[1300px] xl:mx-auto">
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-gray-100">
            {dna.trust.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 md:justify-center px-3">
                <div className="bg-[var(--color-light)] p-2.5 rounded-xl border border-gray-100 shrink-0">
                  <div className="text-xl font-black text-[var(--color-accent)]">{stat.value}</div>
                </div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="max-w-[1400px] mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs">About {dna.brand.shortName}</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{about.headline}</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">{about.body}</p>
            <ul className="space-y-3">
              {about.points.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="bg-[var(--color-accent)]/10 p-1 rounded-full shrink-0 mt-0.5 border border-[var(--color-accent)]/20"><CheckCircle2 className="text-[var(--color-accent)]" size={16}/></div>
                  <span className="font-bold text-gray-700 text-sm">{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <a href={`tel:${ph1.raw}`} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-7 py-4 rounded font-black uppercase tracking-wide transition-all flex items-center gap-3"><Phone size={17}/>Call Now</a>
              <Link to="/about" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-7 py-4 rounded font-black uppercase tracking-wide transition-colors flex items-center gap-3">About Us<ArrowRight size={17}/></Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden h-[560px]">
              <Img src={about.image} alt={`${dna.brand.name} — ${about.headline}`} className="w-full h-full object-cover"/>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[var(--color-primary)] text-white p-7 rounded-2xl shadow-2xl hidden md:block border-l-4 border-[var(--color-accent)]">
              <div className="text-4xl font-black text-[var(--color-accent)] mb-1">{dna.trust.stats[0].value}</div>
              <div className="font-black text-white uppercase tracking-wide text-sm">{dna.trust.stats[0].label}</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[var(--color-accent)] text-[var(--color-primary)] p-5 rounded-xl shadow-xl hidden md:block">
              <div className="text-2xl font-black leading-none">{dna.trust.stats[2].value}</div>
              <div className="text-xs font-black uppercase tracking-widest mt-1">{dna.trust.stats[2].label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="bg-gray-50 py-28 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs mb-3">What We Do</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Our Services</h2>
            <p className="text-gray-500 font-medium mt-4 max-w-2xl mx-auto">{dna.brand.tagline}</p>
          </div>
          <div className={`grid gap-6 ${config.serviceCardStyle === 'list' ? 'grid-cols-1 max-w-2xl mx-auto' : config.serviceCardStyle === 'showcase' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {dna.services.map(s => (
              <Link to={`/${s.id}`} key={s.id} className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--color-accent)]/30 flex flex-col">
                <div className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] p-3 rounded-xl w-fit mb-4 group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-primary)] transition-colors">
                  <Wrench size={26}/>
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-[var(--color-accent)] transition-colors leading-tight">{s.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 flex-grow">{s.shortDesc}</p>
                <div className="flex items-center gap-1 text-[var(--color-accent)] font-black uppercase tracking-wide text-xs">
                  Learn More<ChevronRight size={13} className="group-hover:translate-x-1 transition-transform"/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* PROCESS */}
      {config.showProcessSection && (
      <div className="bg-[var(--color-primary)] py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs mb-3">How We Work</div>
            <h2 className="text-4xl font-black text-white tracking-tight">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-[var(--color-accent)]/20"></div>
            {process.map((s, i) => (
              <div key={i} className="text-center space-y-5 relative z-10">
                <div className="w-20 h-20 mx-auto bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full flex items-center justify-center text-2xl font-black shadow-xl ring-4 ring-[var(--color-accent)]/20">{s.step}</div>
                <h3 className="text-lg font-black text-white">{s.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* TESTIMONIALS */}
      <div className="bg-[var(--color-light)] py-28 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs mb-3">Client Reviews</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dna.trust.testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-lg transition-shadow">
                <Quote className="text-[var(--color-accent)]/20 absolute top-6 right-6 w-10 h-10"/>
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-[var(--color-accent)] fill-[var(--color-accent)]"/>)}</div>
                <p className="text-gray-600 leading-relaxed mb-6 font-medium italic">"{t.quote}"</p>
                <div className="font-black text-gray-900 text-sm">— {t.author}{t.location ? `, ${t.location}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICE AREAS */}
      {config.showServiceAreas && (
      <div className="py-28 max-w-[1400px] mx-auto px-6 border-b border-gray-100">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs">Coverage</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Serving {dna.seo.serviceRadius}</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">From {dna.navigation.serviceAreas[0]} to {dna.navigation.serviceAreas[dna.navigation.serviceAreas.length - 1]} — one call connects you to a local team that covers every job.</p>
            <div className="flex flex-wrap gap-2">
              {dna.navigation.serviceAreas.map(a => (
                <span key={a} className="bg-[var(--color-light)] border border-gray-200 px-3 py-1.5 rounded-full font-bold text-gray-700 text-xs">{a}</span>
              ))}
            </div>
          </div>
          <div className="bg-[var(--color-primary)] rounded-3xl p-10 text-center space-y-8">
            <div className="text-[var(--color-accent)] font-black text-xs uppercase tracking-widest">Service Region</div>
            <div className="text-white text-4xl font-black">{dna.seo.locality}</div>
            <div className="text-gray-400 font-medium text-sm">{dna.seo.region}</div>
            <div className="grid grid-cols-2 gap-4">
              {dna.trust.stats.slice(0, 2).map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-[var(--color-accent)] text-2xl font-black">{s.value}</div>
                  <div className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
            <a href={`tel:${ph1.raw}`} className="inline-flex items-center gap-3 bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-8 py-4 rounded-lg font-black uppercase tracking-wide transition-all w-full justify-center">
              <Phone size={18}/>{ph1.display}
            </a>
          </div>
        </div>
      </div>
      )}

      {/* FAQ */}
      <div className="bg-gray-50 py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[var(--color-accent)] font-black tracking-widest uppercase text-xs mb-3">FAQ</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button className="w-full text-left px-8 py-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors" onClick={() => setFaq(faq === i ? null : i)}>
                  <span className="font-black text-gray-900 text-sm leading-snug">{item.q}</span>
                  <ChevronRight size={16} className={`text-[var(--color-accent)] shrink-0 mt-0.5 transition-transform duration-200 ${faq === i ? 'rotate-90' : ''}`}/>
                </button>
                {faq === i && <div className="px-8 pb-6 text-gray-600 font-medium text-sm leading-relaxed border-t border-gray-50"><div className="pt-4">{item.a}</div></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="bg-[var(--color-accent)] py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}}></div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] tracking-tight">{dna.brand.tagline}</h2>
          <p className="text-xl text-[var(--color-primary)]/70 font-bold max-w-2xl mx-auto">{dna.trust.guarantee}. Free inspections. {dna.seo.serviceRadius}.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a href={`tel:${ph1.raw}`} className="bg-[var(--color-primary)] hover:opacity-90 text-white px-10 py-5 rounded-lg text-xl font-black uppercase tracking-wide transition-all shadow-2xl flex items-center justify-center gap-4"><Phone size={24}/>{ph1.display}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-lg text-xl font-black uppercase tracking-wide transition-all flex items-center justify-center gap-4"><MessageCircle size={24}/>WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
