import dna from '../data/client-dna.json';

type Industry = 'trade' | 'hospitality' | 'professional' | 'retail' | 'wellness';

interface IndustryProfile {
  heroStyle: 'conversion' | 'editorial' | 'authority';
  primaryCTA: 'phone' | 'book' | 'enquire' | 'shop';
  trustBarStyle: 'badges' | 'stats' | 'credentials' | 'none';
  serviceCardStyle: 'grid' | 'list' | 'showcase' | 'editorial';
  testimonialStyle: 'cards' | 'quotes' | 'case-studies';
  showEmergencyBar: boolean;
  showProcessSection: boolean;
  showServiceAreas: boolean;
  showGuarantee: boolean;
  ctaLabel: string;
  ctaSubLabel: string;
  heroOverlay: string;
  accentUsage: 'high' | 'medium' | 'low';
}

const INDUSTRY_PROFILES: Record<Industry, IndustryProfile> = {
  trade: {
    heroStyle: 'conversion',
    primaryCTA: 'phone',
    trustBarStyle: 'badges',
    serviceCardStyle: 'grid',
    testimonialStyle: 'cards',
    showEmergencyBar: true,
    showProcessSection: true,
    showServiceAreas: true,
    showGuarantee: true,
    ctaLabel: 'Call Now — Free Quote',
    ctaSubLabel: 'Same-day response. No obligation.',
    heroOverlay: 'from-[var(--color-primary)]/95 via-[var(--color-primary)]/80 to-[var(--color-primary)]/40',
    accentUsage: 'high',
  },
  hospitality: {
    heroStyle: 'editorial',
    primaryCTA: 'book',
    trustBarStyle: 'stats',
    serviceCardStyle: 'editorial',
    testimonialStyle: 'quotes',
    showEmergencyBar: false,
    showProcessSection: false,
    showServiceAreas: false,
    showGuarantee: false,
    ctaLabel: 'Reserve Your Experience',
    ctaSubLabel: 'Enquire for availability.',
    heroOverlay: 'from-[var(--color-primary)]/60 via-[var(--color-primary)]/30 to-transparent',
    accentUsage: 'low',
  },
  professional: {
    heroStyle: 'authority',
    primaryCTA: 'enquire',
    trustBarStyle: 'credentials',
    serviceCardStyle: 'list',
    testimonialStyle: 'case-studies',
    showEmergencyBar: false,
    showProcessSection: true,
    showServiceAreas: false,
    showGuarantee: true,
    ctaLabel: 'Schedule a Consultation',
    ctaSubLabel: 'Confidential. No commitment.',
    heroOverlay: 'from-[var(--color-primary)]/90 via-[var(--color-primary)]/70 to-[var(--color-primary)]/40',
    accentUsage: 'medium',
  },
  retail: {
    heroStyle: 'editorial',
    primaryCTA: 'shop',
    trustBarStyle: 'stats',
    serviceCardStyle: 'showcase',
    testimonialStyle: 'cards',
    showEmergencyBar: false,
    showProcessSection: false,
    showServiceAreas: true,
    showGuarantee: true,
    ctaLabel: 'Shop Now',
    ctaSubLabel: 'Free delivery available.',
    heroOverlay: 'from-[var(--color-primary)]/70 via-[var(--color-primary)]/40 to-transparent',
    accentUsage: 'high',
  },
  wellness: {
    heroStyle: 'editorial',
    primaryCTA: 'book',
    trustBarStyle: 'stats',
    serviceCardStyle: 'editorial',
    testimonialStyle: 'quotes',
    showEmergencyBar: false,
    showProcessSection: true,
    showServiceAreas: false,
    showGuarantee: false,
    ctaLabel: 'Book a Session',
    ctaSubLabel: 'Your journey starts here.',
    heroOverlay: 'from-[var(--color-primary)]/75 via-[var(--color-primary)]/40 to-transparent',
    accentUsage: 'low',
  },
};

export const industry = (dna._meta.industry as Industry) || 'trade';
export const config = INDUSTRY_PROFILES[industry];
export const isTrade = industry === 'trade';
export const isHospitality = industry === 'hospitality';
export const isProfessional = industry === 'professional';
