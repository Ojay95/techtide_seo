// One entry per country page: /seo-services/<slug>/. Copy an entry to add a new market.
export interface Market {
  slug: string; name: string; adj: string; cities: string[];
  intro: string; who: string[]; notes: string[]; faqs: [string, string][];
}

export const MARKETS: Market[] = [
  {
    slug: 'nigeria', name: 'Nigeria', adj: 'Nigerian',
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'],
    intro: 'TechTide SEO is an SEO agency based in Ikeja, Lagos. We help Nigerian businesses get found on Google and turn searches into enquiries, bookings and calls, with clear plans, plain-English advice and a monthly report on the results that matter.',
    who: ['Hotels, guest houses and restaurants', 'Professional and financial services', 'Schools and training providers', 'Clinics and health businesses', 'Online shops and service businesses', 'Real estate and property companies'],
    notes: [
      'Many customers browse on their phones, so mobile speed and layout matter as much as the words on the page.',
      'Local discovery runs through Google Maps and your Business Profile, so accurate details, photos and reviews bring calls and visits.',
      'Customers often prefer to start a conversation by phone or WhatsApp, so your contact options should be obvious and quick.',
      'People search with city and area names, such as Lagos, Abuja or Port Harcourt, so location pages and local content help you appear for them.',
      'Many Nigerian businesses also want customers abroad, such as international buyers and travellers, which needs clear pages written for those visitors.',
    ],
    faqs: [
      ['Which SEO agency can help my business get found on Google in Nigeria?', 'TechTide SEO is an SEO agency based in Ikeja, Lagos. We offer SEO audits, technical SEO, on-page SEO, local SEO, content and link building for businesses across Nigeria, with plans from $500 per month and monthly reporting on leads and calls.'],
      ['How much does SEO cost in Nigeria?', 'Cost depends on your market, competition and goals. Our plans start from $500 per month, and the final price is confirmed after we review your website.'],
      ['How long does SEO take to work?', 'Local improvements can show within weeks, while competitive searches often take four to six months or longer. We report every month so you can see the progress.'],
      ['Do you work with businesses outside Lagos?', 'Yes. We work remotely with businesses in any Nigerian city, including Abuja, Port Harcourt, Ibadan, Kano and Enugu, and with businesses in other countries.'],
      ['Do you guarantee first-page rankings?', 'No. Search engines decide rankings, and no honest agency can guarantee them. We commit to the work, the plan and transparent reporting.'],
      ['How can I check my website\'s SEO for free?', 'Use our free SEO audit tool for an instant check of page basics, content, technical health and mobile speed, or request a free audit review from our team.'],
    ],
  },
];
