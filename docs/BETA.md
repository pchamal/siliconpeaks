# Snow redesign beta: 28 September 2026

## Current presentation

Snow is the only theme. The owner-supplied 23-second silent mountain / Golden Gate film remains in the hero. Theme and pause controls, the Kathmandu eyebrow, the verbose government subtitle and the hero CC0 badge are removed. Legacy stored preferences no longer affect the page.

Contact and Join Discord buttons appear only in the hero. The footer keeps plain email, Discord and GitHub links. Repeated contact blocks and the final community call-to-action section are removed. The floating navigation is rectangular, with square corners and no active-section or hover underline. Mobile navigation uses the same shape.

Company, university, capital and press introductions are centered. The community note uses self-hosted Literata italics alongside Geist. The original economic snapshot is centered in a square, width-constrained panel with six illustrated metric cards and its qualification intact. Listing controls and dialogs use square Snow styling; paired section rules carry a small geometric textile-inspired detail. “Higher ground. Wider horizons.” is now a three-chapter reading sequence with a sticky progress guide. The original essay paragraphs remain.

The map displays the world, preserves regional route data and adds selectable connections to the eight international cities in the clock strip plus Bangalore. Selecting a city via its Snow-styled keyboard-accessible menu or map pin updates the highlighted trail and that city's current local time and UTC offset. Static land geometry is cached; only route motion is repainted. This is an illustrative connection map, not a direct-flight schedule.

All 24 press entries and all 14 links in the Featured In strip have local publication marks. A VentureBeat feature about SecurityPal’s Kathmandu team adds one sourced story to the original 23 entries; the press section closes with “...and more...”.

The footer preserves the mountain/Golden Gate composite without a title overlay and retains the original public-domain definition. Eight licensed mountain photographs have short profiles, heights, ranks and linked credits. Native vertical page scrolling advances the pinned profiles at about one viewport per mountain, with a reading pause between transitions. Scrolling upward reverses the sequence. Short viewports and reduced-motion preferences fall back to the native horizontal gallery with keyboard and arrow controls. Visible scrollbars and the small peak drawings are removed. A separate, text-free footer image prompt is supplied in `docs/prompts/himalayan-footer.md`; no new bitmap was generated.

## Preserved content

The original repository at commit `597f5dc` remains the content baseline: 113 company cards (112 unique companies), 98 institutions, 47 original investor entries, 23 press entries, 19 organizations, 12 airlines and nine live clocks. Entrepreneurs First is listed in Venture & Private Capital, bringing the investor list to 48. Community essays, events (including the original Coming Soon state), diaspora and contact destinations remain. Relief content and repeated community contact blocks were explicitly removed at the owner's request.

Pukar Hamal, Jonathan Clarke and Aarjan Chaudhary remain in metadata and machine-readable credits. The origin of Silicon Peaks is sourced to [Nepali Times, 24 August 2026](https://nepalitimes.com/bringing-silicon-peaks-to-nepal). Website contribution credits do not imply SecurityPal employment.

## Capital sources

The three funding cards are ordered SecurityPal AI, Architect Labs, Niural.

- [SecurityPal AI — TechCrunch, 21 August 2025](https://techcrunch.com/2025/08/21/raising-multiple-rounds-of-venture-capital-might-be-wrong-for-your-startup/): a $21M Series A led by Craft Ventures, with participation from Martin Casado and Frederic Kerrest. The interview dates the round to 2021; the card labels the coverage date, not a new 2025/2026 raise. The article is linked from SecurityPal's own press archive.
- [Architect Labs, 18 June 2026](https://architectlabs.com/blog/seed): $24M seed led by Kindred Ventures, with Race Capital, TQ Ventures and Together Fund. [Together Fund's portfolio](https://www.together.fund/portfolio/architectlabs) also confirms the investment.
- [Niural company release, 23 June 2026](https://www.prnewswire.com/news-releases/niural-launches-niural-ai-labs-and-grows-its-series-a-to-52-million-302806440.html): $21M of additional strategic capital brings the Series A total to $52M; FOG Ventures and NewView Capital are named. The card distinguishes the extension from the cumulative total.
- [Entrepreneurs First](https://www.joinef.com/): listed with the other VC/private capital firms and its official website icon. No separate feature remains. Directory inclusion is not proof of a specific investment relationship.

## Additional coverage

[VentureBeat, Carl Franzen, 23 July 2025](https://venturebeat.com/security/securitypal-combines-ai-and-experts-in-nepal-to-speed-enterprise-security-questionnaires-by-87x-or-more/) reports on SecurityPal’s Kathmandu operation. The short card title identifies the story without presenting its claimed speed improvement as our independently verified metric.

## Limits and asset provenance

The original economic, diaspora and flight-reach estimates remain qualified community snapshots, not independently verified current statistics. Generic publisher links are preserved. Seventeen directory records still lack verified marks and retain readable names, initials or a flag. Official assets now correct Kathmandu University, NAAMII, Coca-Cola, FOG Ventures and Echowin; Techkraft and Codewing have verified marks and corrected links. Misleading parked-domain icons for DBA and Tectonic Capital are removed. See [asset provenance](ASSETS.md) and `data/logo-review-2026-09-28.json` for sources.

The public page has no framework runtime, tracking service, remote font request or directory API. There are no display preference cookies or local-storage writes. Email dialogs prepare drafts and send nothing automatically. Operating-system reduced motion and data-saving connections retain a still hero poster. Video and map animation pause offscreen and in background tabs. Archived Night media remain outside the public build. The Snow composite is restored as a lazy-loaded footer image.

Approximate gzip transfers: homepage HTML 26.5 KB, homepage scripts 10.9 KB combined, homepage CSS 29.0 KB combined. Focused search pages are 3.6–7.2 KB HTML each and use a 2.1 KB stylesheet plus the 0.9 KB navigation script. These are file measurements, not production Core Web Vitals. The eight mountain photos total about 389 KB and load lazily; the Snow video is about 1.1 MB.

## Search and verification

The `/companies/`, `/startups/` and `/investors/` pages target distinct search intents with original introductions, sourced context, unique titles, canonical links, social metadata, breadcrumbs and structured data. The sitemap includes all four pages. See [SEO plan](SEO.md) and [QA report](QA.md).

The upstream Cloudflare project and domain configuration are unchanged. The personal Vercel review deployment is intentionally noindex and contains only public assets. Local preview remains **http://localhost:3000**.
