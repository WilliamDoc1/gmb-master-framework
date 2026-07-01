import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import dna from '../data/client-dna.json';
import SEOMeta from '../components/SEOMeta';
import SchemaMarkup from '../components/SchemaMarkup';

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const ph1 = dna.contact.phone1;
  const wa = `https://wa.me/${dna.contact.whatsapp.replace('+','')}`;

  return (
    <div className="w-full">
      <SEOMeta title={`Contact ${dna.brand.name} — Free Quote`} description={`Contact ${dna.brand.name} for a free quote. Call ${ph1.display} or WhatsApp. ${dna.seo.serviceRadius}.`} canonicalUrl={`${dna._meta.siteUrl}/contact`}/>
      <SchemaMarkup pageType="LocalBusiness" pageTitle={`Contact ${dna.brand.name}`} pageUrl={`${dna._meta.siteUrl}/contact`}/>

      <div className="bg-[var(--color-primary)] py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)]"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-[var(--color-accent)] text-xs font-black uppercase tracking-widest mb-4"><Link to="/" className="hover:text-white">{dna.brand.shortName}</Link> <span className="text-white/20 mx-2">/</span> Contact</div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-2xl mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300 font-medium max-w-xl leading-relaxed">Free quote. Same-day response. {dna.trust.guarantee}.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <div className="space-y-4">
              {[
                { href: `tel:${ph1.raw}`, icon: <Phone size={20}/>, label: ph1.display, sub: dna.contact.phone1.label, bg: 'bg-[var(--color-accent)]', color: 'text-[var(--color-primary)]' },
                ...(dna.contact.phone2 && typeof dna.contact.phone2 === 'object' ? [{ href: `tel:${(dna.contact.phone2 as any).raw}`, icon: <Phone size={20}/>, label: (dna.contact.phone2 as any).display, sub: (dna.contact.phone2 as any).label, bg: 'bg-[var(--color-accent)]/80', color: 'text-[var(--color-primary)]' }] : []),
                { href: wa, icon: <MessageCircle size={20}/>, label: 'WhatsApp Us', sub: `${dna.contact.whatsapp} — Quick Response`, bg: 'bg-green-500', color: 'text-white' },
                { href: `mailto:${dna.contact.email}`, icon: <Mail size={20}/>, label: dna.contact.email, sub: 'Email Us', bg: 'bg-[var(--color-primary)]', color: 'text-[var(--color-accent)]' },
              ].map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-5 p-5 bg-[var(--color-light)] border border-gray-100 rounded-xl hover:border-[var(--color-accent)]/40 transition-colors group">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0`}>{item.icon}</div>
                  <div>
                    <div className="font-black text-gray-900 text-sm group-hover:text-[var(--color-accent)] transition-colors">{item.label}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{item.sub}</div>
                  </div>
                </a>
              ))}
              <div className="flex items-center gap-5 p-5 bg-[var(--color-light)] border border-gray-100 rounded-xl">
                <div className="w-12 h-12 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-xl flex items-center justify-center shrink-0"><MapPin size={20}/></div>
                <div>
                  <div className="font-black text-gray-900 text-sm">{dna.contact.address.street}</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">{dna.contact.address.city}, {dna.contact.address.province}</div>
                </div>
              </div>
            </div>
            {dna.contact.hours && <p className="text-sm text-gray-500 font-medium"><span className="font-black text-gray-900">Hours:</span> {dna.contact.hours}</p>}
          </div>

          <div>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><ArrowRight size={28} className="text-green-600"/></div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 font-medium">We'll be in touch within the same business day.</p>
              </div>
            ) : (
              <form className="space-y-5 bg-[var(--color-light)] border border-gray-100 rounded-2xl p-8" onSubmit={e => { e.preventDefault(); setSent(true); }} data-netlify="true" name="contact">
                <input type="hidden" name="form-name" value="contact"/>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Full Name</label>
                    <input type="text" name="name" required placeholder="Your name" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Phone</label>
                    <input type="tel" name="phone" required placeholder="Your number" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Email</label>
                  <input type="email" name="email" placeholder="your@email.com" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Service Required</label>
                  <select name="service" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors text-gray-600">
                    <option value="">Select a service...</option>
                    {dna.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Area / Suburb</label>
                  <input type="text" name="area" placeholder="e.g. Table View, Milnerton..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors"/>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">Message</label>
                  <textarea rows={4} name="message" required placeholder="Describe your project..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] py-4 rounded-lg font-black uppercase tracking-wide text-sm transition-all flex items-center justify-center gap-3">
                  <Phone size={17}/>Request Free Quote
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
