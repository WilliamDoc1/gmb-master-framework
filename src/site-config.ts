import dna from './data/client-dna.json';

export const siteConfig = {
  name: dna.brand.name,
  shortName: dna.brand.shortName,
  description: dna.seo.metaDescription,
  emergencyPhone: dna.contact.phone1.raw,
  emergencyPhoneDisplay: dna.contact.phone1.display,
  phone2: dna.contact.phone2,
  contactEmail: dna.contact.email,
  whatsapp: `https://wa.me/${dna.contact.whatsapp.replace('+','')}`,
  address: `${dna.contact.address.street}, ${dna.contact.address.city}`,
  locality: dna.contact.address.suburb,
  countryCode: dna.contact.address.countryCode,
  siteUrl: dna._meta.siteUrl,
  services: dna.services.map(s => ({ id: s.id, title: s.title, description: s.shortDesc })),
};
