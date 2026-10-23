export interface Service {
  slug: string; name: string; short: string;
  metaTitle: string; metaDescription: string;
  h1: string; intro: string;
  items: [string, string][];
  resultTitle: string; resultText: string;
  extraTitle?: string; extraText?: string;
  price?: string;
  related: [string, string][]; // [href, label]
}

export const SERVICES: Service[] = [
  { slug: 'local-seo', name: 'Local SEO', short: 'Show up on Google Maps and in local results.',
    metaTitle: 'Local SEO Services | TechTide SEO',
    metaDescription: 'Get found on Google Maps and in local search. Profile optimisation, reviews, citations and local pages. Plans from $500 per month.',
    h1: 'Local SEO services that put you on the map',
    intro: 'When people search "near me" or add a city to their search, Google shows a map and three businesses. We help you earn one of those spots.',
    items: [['Google Business Profile','Correct categories, services, photos, posts and hours, fully completed.'],['Reviews','A simple system to ask for reviews and respond to every one.'],['Citations','Consistent name, address and phone number across the directories that matter.'],['Location pages','Useful pages for each area you serve, with real local content.'],['Local links and mentions','Partnerships and local coverage that build trust.'],['Map tracking','A heatmap showing where you appear, month by month.']],
    resultTitle: "What you'll see", resultText: 'More calls, more direction requests, more website visits from local searches, and a report that shows each one.',
    extraTitle: 'Good fit if', extraText: 'You serve customers in a specific area or have one or more locations.',
    price: 'Local SEO plans start from $500 per month',
    related: [['/services/google-business-profile-setup/','Google Business Profile Setup'],['/guides/local-seo-guide/','Local SEO guide'],['/guides/google-business-profile-optimization/','Google Business Profile optimization']] },
  { slug: 'google-business-profile-setup', name: 'Google Business Profile Setup', short: 'Set up, verify and optimise your profile to win the map pack.',
    metaTitle: 'Google Business Profile Setup & Optimisation | TechTide SEO',
    metaDescription: 'Get your Google Business Profile set up, verified and fully optimised so you show up on Google Maps and in local results. Done for you by TechTide SEO.',
    h1: 'Google Business Profile setup that gets you on the map',
    intro: 'Your Business Profile is often the first thing customers see on Google, before they ever visit your website. We create or claim it, get it verified, and complete every detail so Google trusts it and customers choose you.',
    items: [['Create or claim your profile','We set up a new profile or recover access to an existing one, including duplicate and ownership issues.'],['Verification support','We guide you through Google’s verification steps (video, phone, email or postcard) and handle common rejections.'],['Categories and services','The right primary and secondary categories, plus every service and product you offer, described clearly.'],['Photos, hours and details','Real photos, accurate hours, service areas, attributes, booking and WhatsApp links, all filled in.'],['Reviews setup','Your direct review link and QR code, plus a simple routine for asking and replying.'],['Consistency check','Your name, address and phone matched on your website and key directories, with LocalBusiness schema added.']],
    resultTitle: "What you'll get", resultText: 'A complete, verified profile that is ready to appear on Google Maps and in local results, plus a short handover showing you how to keep it fresh.',
    extraTitle: 'Good fit if', extraText: 'You don’t have a profile yet, can’t access the one you have, it was suspended, or it is incomplete and not showing up.',
    related: [['/guides/google-business-profile-optimization/','Google Business Profile optimization'],['/guides/local-seo-guide/','Local SEO guide'],['/services/local-seo/','Local SEO services']] },
  { slug: 'technical-seo', name: 'Technical SEO', short: 'Make your site fast, crawlable and error-free.',
    metaTitle: 'Technical SEO Services | TechTide SEO',
    metaDescription: 'Fix crawl errors, speed, indexing and site structure so Google can find and rank your pages. Technical SEO from TechTide SEO.',
    h1: 'Technical SEO that fixes what holds you back',
    intro: "If Google can't crawl, load or understand your site, great content won't rank. We fix the foundations first.",
    items: [['Crawl and index review',"Find pages Google can't reach or has ignored."],['Speed and Core Web Vitals','Faster loading and a smoother experience, especially on phones.'],['Site structure','Clean URLs, sensible navigation, and fixed redirects and broken pages.'],['Structured data','Schema markup so Google understands who you are and what you offer.'],['Mobile, security and accessibility basics','HTTPS, responsive layout and clear usability.']],
    resultTitle: "What you'll get", resultText: 'A prioritised fix list, the fixes implemented or briefed to your developer, and a re-crawl to confirm.',
    related: [['/guides/technical-seo-checklist/','Technical SEO checklist']] },
  { slug: 'on-page-seo', name: 'On-page SEO', short: 'Match every page to what people actually search.',
    metaTitle: 'On-Page SEO Services | TechTide SEO',
    metaDescription: 'Optimise titles, headings, content and internal links so every page matches what people search. On-page SEO from TechTide SEO.',
    h1: 'On-page SEO that matches what people search',
    intro: 'Google ranks the page that best answers a search. We shape each page to be that answer, and to turn visitors into enquiries.',
    items: [['Keyword mapping',"One main search term for each page, so pages don't compete."],['Titles and descriptions','Written to earn the click.'],['Page content','Clear structure, helpful detail, real experience and proof.'],['Internal links','Guide visitors and Google to your most important pages.'],['Calls to action','Make the next step obvious on every page.']],
    resultTitle: "What you'll get", resultText: 'A keyword map, rewritten key pages, and a tracking report showing which pages gain visibility.',
    related: [['/guides/on-page-seo-checklist/','On-page SEO checklist']] },
  { slug: 'content-seo', name: 'Content SEO', short: 'Publish guides and pages that earn traffic and trust.',
    metaTitle: 'SEO Content Services | TechTide SEO',
    metaDescription: 'Guides and pages built around real searches. Research, briefs, writing and updates that bring traffic and trust. TechTide SEO.',
    h1: 'SEO content that earns traffic and trust',
    intro: 'Your customers ask questions before they buy. We create content that answers them, and leads them to you.',
    items: [['Topic research','Find what your customers search and what competitors miss.'],['Content plan','A monthly calendar grouped into topics, so pages support each other.'],['Writing and editing','Clear, accurate pieces that show real expertise.'],['Publishing','Titles, links, images and schema set up correctly.'],['Refreshes','Update pages that are close to page one.']],
    resultTitle: "What you'll get", resultText: 'A monthly plan, finished content, and a report on the traffic and enquiries it brings.',
    related: [['/guides/what-is-seo/','What is SEO?']] },
  { slug: 'link-building', name: 'Link building', short: 'Earn links from sites that matter, safely.',
    metaTitle: 'Link Building Services | TechTide SEO',
    metaDescription: 'Earn trusted links through partnerships, digital PR and outreach. Safe link building with no paid schemes. TechTide SEO.',
    h1: 'Link building without the risk',
    intro: 'Links from trusted sites tell Google you matter. We earn them honestly, so your rankings last.',
    items: [['Link gap research','Find sites that link to your competitors but not you.'],['Local and industry partnerships','Suppliers, associations and community links.'],['Digital PR','Original data and expert comments pitched to publications.'],['Outreach','Personal, relevant messages, never mass spam.'],['Monitoring','Track new and lost links and brand mentions.']],
    resultTitle: 'What we never do', resultText: 'We never buy links, use private blog networks or join link schemes. These can get a site penalised.',
    related: [] },
  { slug: 'seo-audit', name: 'SEO audit', short: 'A clear list of what to fix, in priority order.',
    metaTitle: 'SEO Audit Service | TechTide SEO',
    metaDescription: 'A complete SEO audit covering technical, on-page, content, local and links, with a prioritised action plan. From $500.',
    h1: 'An SEO audit that tells you exactly what to fix',
    intro: "Most audits are long reports no one reads. Ours is a clear plan: what's wrong, how serious it is, and what to do first.",
    items: [['Technical review','Crawl, indexing, speed and Core Web Vitals.'],['Content and keywords','Keyword and content gap analysis, plus a review of your key pages.'],['Local and links','Profile and citation review, backlinks and competitor comparison.'],['Action plan','A prioritised list with quick wins, and a walkthrough call.']],
    resultTitle: 'Investment', resultText: "Paid audits start from $500, one time. The price depends on your site's size and number of locations.",
    price: 'Paid audits start from $500',
    related: [['/guides/how-to-do-an-seo-audit/','How to do an SEO audit']] },
];

// Monthly plans: shown on the homepage and /how-we-work/. [name, price, description, includes, highlighted]
export const PLANS: [string, string, string, string[], boolean][] = [
  ['Local Starter', 'from $500', 'For businesses serving one area.', ['Google Business Profile management', 'Citation cleanup', 'Review system', 'Core on-page fixes', 'Monthly report'], false],
  ['Growth', 'from $1,500', 'Everything in Local Starter, plus more.', ['Technical fixes', '2–4 content pieces a month', 'Service and location pages', 'Link building', 'Monthly strategy call'], true],
  ['Authority', 'from $3,500', 'Everything in Growth, plus more.', ['Multi-location or competitive markets', 'Digital PR', 'Conversion work', 'Dedicated strategist'], false],
];
