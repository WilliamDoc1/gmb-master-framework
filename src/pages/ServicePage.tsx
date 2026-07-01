import { useState } from 'react';
import { CheckCircle2, Phone, ArrowRight, MessageCircle, Shield, Award, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import dna from '../data/client-dna.json';
import { Img } from '../components/Img';
import SEOMeta from '../components/SEOMeta';
import SchemaMarkup from '../components/SchemaMarkup';

type Service = typeof dna.services[0];

export function ServicePage({ serviceId }: { serviceId: string }) {
  const svc = dna.services.find(s => s.id === serviceId) as Service;
  const [imgIdx, setImgIdx] = useState(0);
  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;
  const allImgs = [svc.heroImage, ...svc.galleryImages].filter(Boolean);

  if (!svc) return (
    <div className="max-w-[1400px] mx-auto px-6 py-32 text-center w-full">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Service Not Found</h1>
      <Link to="/" className="bg-[var(--color-accent)] text-[var(--color-primary)] px-8 py-4 rounded font-black uppercase">Home</Link>
    </div>
  );

  return (
    <div className="w-full">
      <SEOMeta
        title={svc.metaTitle}
        description={svc.metaDesc}
        canonicalUrl={`${dna._meta.siteUrl}/${svc.id}`}
        ogType="article"
      />
      <SchemaMarkup
        pageType="LocalBusiness"
        pageTitle={svc.metaTitle}
        pageUrl={`${dna._meta.siteUrl}/${svc.id}`}
        faqList={svc.faq.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* HERO */}
      <div className="bg-[var(--color-primary)] relative overflow-hidden min-h-[60vh] flex items-center">
        {svc.heroImage && (
          <>
            <img src={svc.heroImage} alt={svc.metaTitle} className="absolute inset-0 w-full h-full object-cover opacity-30"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/95 to-[var(--color-primary)]/60"></div>
          </>
        )}
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)]"></div>
        <div className="max-w-[1400px] mx-auto px-6 py-24 relative z-10 w-full">
          <div className="text-[var(--color-accent)] text-xs font-black uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-colors">{dna.brand.shortName}</Link>
            <span className="text-white/20 mx-2">/</span>{svc.title}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl mb-6">{svc.metaTitle}</h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl leading-relaxed mb-10">{svc.metaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`tel:${ph1.raw}`} className="bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-8 py-4 rounded font-black uppercase tracking-wide transition-all flex items-center gap-3 justify-center text-lg"><Phone size={20}/>{ph1.display}</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded font-black uppercase tracking-wide transition-colors flex items-center gap-3 justify-center text-lg"><MessageCircle size={20}/>WhatsApp</a>
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="bg-[var(--color-accent)] py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center gap-6 text-[var(--color-primary)] font-black text-xs uppercase tracking-wide">
          <span className="flex items-center gap-2"><CheckCircle2 size={15}/>Free Inspection</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={15}/>Same-Day Quote</span>
          <span className="flex items-center gap-2"><Shield size={15}/>{svc.guarantee}</span>
          <span className="flex items-center gap-2"><Award size={15}/>{dna.trust.badges[0]}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2 space-y-12">

            {/* Image Gallery */}
            {allImgs.length > 0 && (
              <div>
                <div className="relative rounded-2xl overflow-hidden h-80 shadow-xl group">
                  <Img src={allImgs[imgIdx]} alt={`${svc.title} Cape Town`} className="w-full h-full object-cover transition-all duration-500"/>
                  {allImgs.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImgs.map((_, i) => <button key={i} onClick={() => setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-[var(--color-accent)] w-10' : 'bg-white/50 w-5'}`}/>)}
                    </div>
                  )}
                </div>
                {allImgs.length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {allImgs.map((img, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={`rounded-xl overflow-hidden h-24 border-2 transition-all ${i === imgIdx ? 'border-[var(--color-accent)]' : 'border-transparent'}`}>
                        <Img src={img} alt={`${svc.title} ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Points */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {svc.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[var(--color-light)] p-5 rounded-xl border border-gray-100">
                    <div className="bg-[var(--color-accent)]/20 p-1.5 rounded-full shrink-0 mt-0.5 border border-[var(--color-accent)]/30"><CheckCircle2 className="text-[var(--color-accent)]" size={15}/></div>
                    <span className="font-bold text-gray-800 text-sm leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Our Process</h2>
              <div className="space-y-4">
                {dna.content.process.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full flex items-center justify-center font-black text-sm shrink-0">{s.step}</div>
                    <div>
                      <div className="font-black text-gray-900 text-sm mb-1">{s.title}</div>
                      <p className="font-medium text-gray-600 text-sm leading-snug">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service FAQ */}
            {svc.faq.length > 0 && (
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Common Questions</h2>
                <div className="space-y-3">
                  {svc.faq.map((f, i) => (
                    <div key={i} className="bg-[var(--color-light)] rounded-xl p-6 border border-gray-100">
                      <div className="font-black text-gray-900 text-sm mb-2">{f.q}</div>
                      <p className="text-gray-600 font-medium text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial pull */}
            <div className="bg-[var(--color-primary)] rounded-2xl p-8">
              <Quote className="text-[var(--color-accent)]/30 w-10 h-10 mb-4"/>
              <div className="flex gap-1 mb-3">{[...Array(dna.trust.testimonials[0].rating)].map((_,i) => <Star key={i} size={14} className="text-[var(--color-accent)] fill-[var(--color-accent)]"/>)}</div>
              <p className="text-white/70 leading-relaxed font-medium italic mb-4">"{dna.trust.testimonials[0].quote}"</p>
              <div className="text-[var(--color-accent)] font-black text-sm">— {dna.trust.testimonials[0].author}{dna.trust.testimonials[0].location ? `, ${dna.trust.testimonials[0].location}` : ''}</div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-[var(--color-primary)] text-white rounded-2xl p-8 sticky top-28">
              <h3 className="text-xl font-black mb-2">Get a Free Quote</h3>
              <p className="text-gray-400 text-sm mb-6">Same-day response. No obligation.</p>
              <div className="space-y-3">
                <a href={`tel:${ph1.raw}`} className="w-full bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] px-6 py-4 rounded font-black uppercase tracking-wide transition-all flex items-center gap-3 justify-center"><Phone size={17}/>{ph1.display}</a>
                {dna.contact.phone2 && typeof dna.contact.phone2 === 'object' && (<a href={`tel:${(dna.contact.phone2 as any).raw}`} className="w-full bg-[var(--color-accent)]/70 hover:opacity-90 text-[var(--color-primary)] px-6 py-4 rounded font-black uppercase tracking-wide transition-all flex items-center gap-3 justify-center"><Phone size={17}/>{(dna.contact.phone2 as any).display}</a>)}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded font-black uppercase tracking-wide transition-colors flex items-center gap-3 justify-center"><MessageCircle size={17}/>WhatsApp</a>
                <a href={`mailto:${dna.contact.email}`} className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded font-black text-xs uppercase tracking-wide transition-colors flex items-center gap-3 justify-center">{dna.contact.email}</a>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
                <div className="flex items-start gap-3"><CheckCircle2 size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5"/><span className="text-gray-400 font-medium">{svc.guarantee}</span></div>
                {dna.trust.badges.map(b => (
                  <div key={b} className="flex items-start gap-3"><CheckCircle2 size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5"/><span className="text-gray-400 font-medium">{b}</span></div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-light)] rounded-2xl p-6 border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide text-xs">Other Services</h3>
              <ul className="space-y-2">
                {dna.services.filter(s => s.id !== serviceId).map(s => (
                  <li key={s.id}><Link to={`/${s.id}`} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[var(--color-accent)] transition-colors py-1"><ArrowRight size={12} className="text-[var(--color-accent)] shrink-0"/>{s.title}</Link></li>
                ))}
              </ul>
            </div>

            {/* Location links */}
            <div className="bg-[var(--color-light)] rounded-2xl p-6 border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide text-xs">{svc.title} Near You</h3>
              <div className="flex flex-wrap gap-2">
                {dna.locations.slice(0, 8).map(l => (
                  <Link key={l.slug} to={`/location/${l.slug}`} className="text-xs bg-white border border-gray-200 hover:border-[var(--color-accent)] text-gray-600 hover:text-[var(--color-accent)] px-3 py-1.5 rounded-full font-bold transition-colors">{svc.title} {l.suburb}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--color-accent)] py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4">Ready to Get Started?</h2>
          <p className="text-[var(--color-primary)]/70 font-bold mb-8 text-lg">{svc.guarantee} · Free inspection · {dna.seo.serviceRadius}</p>
          <a href={`tel:${ph1.raw}`} className="bg-[var(--color-primary)] hover:opacity-90 text-white px-10 py-5 rounded-lg text-xl font-black uppercase tracking-wide transition-all inline-flex items-center gap-4 shadow-xl"><Phone size={22}/>{ph1.display}</a>
        </div>
      </div>
    </div>
  );
}
