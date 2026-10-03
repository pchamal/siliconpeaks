# Search strategy

Each topic has one primary page, a distinct introduction and contextual links from the homepage. Keyword selection follows the site's content and likely search intent. No measured keyword-volume or ranking claim is made.

| Page | Primary intent | Supporting terms |
| --- | --- | --- |
| `/` | Silicon Peaks | Nepal technology ecosystem, Nepali founders |
| `/companies/` | IT companies in Nepal | software companies in Nepal, Nepali tech companies |
| `/startups/` | Nepal startup ecosystem | startups in Nepal, Nepali entrepreneurs, startup funding |
| `/investors/` | venture capital in Nepal | investors in Nepal, private equity Nepal, startup investors |

The company directory explicitly distinguishes companies operating in Nepal from Nepali-founded companies abroad. The investor directory does not imply that every listed firm has funded every company or is currently accepting applications. Funding examples link to dated sources and separate a round extension from cumulative funding.

## Implemented

- Static, crawlable HTML with one H1 per page, unique titles and descriptions, canonical URLs, social metadata and local images.
- WebSite, CollectionPage or WebPage, BreadcrumbList and ItemList structured data where appropriate. No invented review, rating or funding schema.
- Internal links between the homepage and focused pages; a four-page sitemap and the existing production robots policy.
- Self-hosted fonts and assets, lazy images, automatic offscreen video pausing, reduced-motion support and explicit transfer budgets.
- Pukar Hamal's sourced naming credit and website contributor credits in appropriate metadata and text exports. LLM text files are informational, not a guarantee of ranking.

## Publication and measurement

The official canonical remains `https://siliconpeaks.com`. At the owner’s request, the public Vercel beta now allows crawling and has no noindex response header. Its social images resolve from the beta deployment. Canonical consolidation and search rankings remain decisions for search engines; a Lighthouse SEO score is a technical check, not a traffic forecast.

After the maintainers merge and publish the official site, submit its sitemap to their Search Console property, inspect the four URLs, and compare queries, impressions, click-through rates and clicks after enough traffic accumulates. Measure Core Web Vitals on the deployed site. No Search Console account changes or analytics tracking are included here.
