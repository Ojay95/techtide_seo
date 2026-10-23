export const SITE = {
  name: 'TechTide SEO',
  url: 'https://techtideseo.com',
  tagline: 'Search growth for businesses in any market.',
  email: 'info@techtideseo.com',
  address: '2A Iyalla Street, Alausa, Ikeja, Lagos, Nigeria',
  street: '2A Iyalla Street, Alausa',
  city: 'Ikeja',
  region: 'Lagos',
  country: 'NG',
  // Paste your full profile URLs between the quotes. Empty ones are ignored automatically.
  sameAs: [
    'https://www.google.com/search?kgmid=/g/11p1y1rlw8', // Google Business Profile
    'https://www.linkedin.com/company/146745197/', // LinkedIn company page
    '', // X / Twitter, e.g. https://x.com/techtideseo
    '', // Instagram, e.g. https://www.instagram.com/techtideseo
    '', // Facebook, e.g. https://www.facebook.com/techtideseo
  ].filter(Boolean) as string[],
};

// Blog author (used in the byline and Article schema). Leave name empty to show "the TechTide SEO team".
export const AUTHOR = {
  name: 'Ojo Akinsola',
  role: 'SEO Expert | Web Developer | Marketing Strategist',
  bio: 'Ojo helps businesses in Nigeria and worldwide get found on Google, combining technical SEO, web development and marketing strategy.',
  url: '',      // optional: personal LinkedIn profile URL
};

export const NAV = [
  { href: '/services/', label: 'Services' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];

