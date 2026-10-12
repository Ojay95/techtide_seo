# TechTide SEO website (complete project)

Astro static site with a blog, guides, light/dark theme, Formspree forms, cookie consent and an admin (Keystatic).

## 1. Run it locally
```
npm install
cp .env.example .env     # then fill in values (see section 3)
npm run dev              # http://localhost:4321
npm run build            # production build into /dist (run this before deploying)
```
If npm reports version conflicts, run `npx astro add react mdx cloudflare` and `npm i @keystatic/core @keystatic/astro` to get compatible versions. On macOS older than 13.5 the Cloudflare local emulator can't run, so `platformProxy` is disabled in `astro.config.mjs`.

## 2. What is in the site
- **Pages:** Home, Guides index (`/guides/`), Blog index (`/blog/`), Resources hub (`/resources/`), Services hub + 6 service pages, How we work, About, Contact, Free SEO audit, Resources hub, Privacy, Cookies, Terms, Accessibility, 404.
- **Blog (10 posts):** quick Google checks, SEO vs PPC, keyword research, Core Web Vitals, schema markup, backlinks, SEO for small businesses, Google reviews, local citations, Search Console. Write more in `src/content/blog/` or the admin.
- **Guides (8, published):** what is SEO, how much it costs, how long it takes, local SEO guide, Google Business Profile, technical checklist, on-page checklist, how to do an audit. Add more in `src/content/guides/` or `src/content/blog/`, or through the admin.
- **SEO built in:** unique titles and descriptions, canonical tags, sitemap, robots.txt, Organization, WebSite, Service, Article and Breadcrumb schema, clean URLs, self-hosted fonts, security headers (`public/_headers`).
- **Accessibility:** skip link, landmarks, visible focus, labelled forms, reduced-motion support, contrast checked in both themes, accessibility statement.

## 3. Settings (`.env` locally, and your host's environment variables in production)
| Variable | Purpose |
|---|---|
| `PUBLIC_FORMSPREE_ID` | Formspree form ID (the part after /f/). Powers the audit, contact and call-to-action forms. |
| `PUBLIC_GA_ID`, `PUBLIC_CLARITY_ID` | Optional analytics. They load only after a visitor accepts cookies. If both are empty, no cookie banner is shown. |
| `PUBLIC_BOOKING_URL` | Optional booking link shown on the Contact page. |
| `PUBLIC_KEYSTATIC_REPO` | Your GitHub repo as OWNER/REPO (admin in production). |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Created by Keystatic's GitHub app setup (follow Keystatic's GitHub mode docs). |

**Formspree:** create a free account at formspree.io, add a form, copy its ID. Forms send in the background with a spam trap and record where each lead came from.

## 4. Admin (Keystatic)
Open `/keystatic/`. Locally it edits the files directly. In production it commits to your GitHub repo and your host rebuilds. Only people with repo access can sign in; turn on two-factor authentication for each. The admin is excluded from the sitemap and blocked in robots.txt. New entries start as drafts; untick Draft to publish.

## 5. Deploy
1. Put the project in a private GitHub repo (the `.gitignore` keeps `node_modules`, `dist` and `.env` out).
2. Create a Cloudflare Pages project from the repo: build command `npm run build`, add the environment variables above.
3. Add the domain techtideseo.com. (Using Netlify or Vercel? Swap `@astrojs/cloudflare` for `@astrojs/netlify` or `@astrojs/vercel` in `astro.config.mjs`.)
4. After launch: add the site to Google Search Console and submit `/sitemap-index.xml`; check indexing; set up your Google Business Profile if you have a local presence.

## 6. Before you launch: fill every placeholder
Find them all with: `grep -rn "\[[A-Z][A-Za-z ,]*\]" src`
- Email, business name and address: `src/data/site.ts`
- "[X] business days": free audit, contact and accessibility pages
- Your story and business details: `src/pages/about.astro`
- Minimum commitment and plan-change notice: `src/pages/how-we-work.astro`
- Legal pages (`privacy`, `cookies`, `terms`, `accessibility`) are templates: have a qualified lawyer review them for your country, and make the tool list match what you enable.
- Add a "Results" section to the home page after your first real case study (see the comment in `src/pages/index.astro`).

## 7. Where things live
- Colours, fonts, spacing, light and dark themes: `src/styles/global.css`
- Service copy and prices: `src/data/services.ts`; pricing blocks: `src/pages/services/[slug].astro`; plans: `src/pages/how-we-work.astro`
- Navigation: `NAV` in `src/data/site.ts`
- Layout, meta tags and schema: `src/layouts/Base.astro`; articles: `src/layouts/ArticleLayout.astro`

## 8. Not included
Open Graph share image, RSS feed, case studies and testimonials (add real ones when you have them), and a booking tool account.

## 9. Images in posts: diagrams and screenshot placeholders
- **Diagrams** are SVG files in `public/images/diagrams/` (one per post). Edit or replace them freely.
- **Screenshot placeholders** are PNG files in `public/images/screenshots/`. Replace each with your own real screenshot **using the same file name** (16:9, about 1280 x 720) and the posts update automatically. Then update the alt text and caption in the post if needed.
- Add new images the same way: put the file in `public/images/` and reference it as `![Description](/images/...)`.
- Post dates: each post has a `published` date and an `updated` date in its header; the blog lists newest first.
