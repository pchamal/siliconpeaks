# Silicon Peaks

The open repository for [siliconpeaks.com](https://siliconpeaks.com), Nepal's technology ecosystem: companies operating in Nepal or founded by Nepalis, wherever they build.

Silicon Peaks was coined and named by **Pukar Hamal**, founder and CEO of **SecurityPal**. [Origin story in Nepali Times](https://nepalitimes.com/bringing-silicon-peaks-to-nepal).

## Run locally

Requires Node.js 20 or newer. The static build, preview and tests use Node built-ins, without installing dependencies:

```sh
npm run build
npm run dev
```

Open **http://localhost:3000**. The dedicated static server fails explicitly if port 3000 is occupied. It does not switch ports, proxy another project or watch Cloudflare state. It serves public website assets only, with caching disabled for local review and HTTP byte ranges for video playback and seeking.

Wrangler remains the upstream deployment path. An isolated Vercel review build is available with `npm run build:preview`; see `deploy/vercel.json`. It serves only public files and is marked noindex so the review copy does not compete with siliconpeaks.com.

## Preserve the original website

This presentation rebuild starts from original repository commit `597f5dc`, preserving its section order apart from the explicitly removed relief and repeated community contact sections, with 113 company cards (112 unique companies), 98 institutions, 48 investors (the original 47 plus Entrepreneurs First), 24 press entries (23 original plus a sourced VentureBeat story), 19 organizations, 12 airlines and nine live clocks. The original community essays, events and diaspora sections remain. Contact and Discord actions appear in the hero and as simple footer links.

- `src/template.html`: authoritative page structure, listings and editorial content. Edit listings here and keep `data/directory.json` in sync for structured data and text exports.
- `assets/original-layout.css`: compact baseline layout rules retained from the original site.
- `assets/site.css`: shared typography, responsive layouts and components.
- `assets/snow.css`: Snow presentation, video hero, editorial columns and mountain photo footer.
- `assets/media/`: optimized owner-supplied video, posters and artwork.
- `assets/site.js`: live clocks, selectable map routes, automatic ambient motion, the essay reading guide, mountain scroll sequence and accessible dialogs.
- `assets/navigation.js`: shared responsive navigation, hidden on downward scroll and restored on upward scroll.
- `data/preservation.json`: original inventory and editorial paragraphs used by regression checks.
- `data/directory.json`: unique directory records for SEO and text exports, including logo provenance.
- `llms.txt` / `humans.txt`: origin, credits and sources.
- `npm run build`: generates the homepage, `/companies/`, `/startups/`, `/investors/`, `sitemap.xml`, `llms-full.txt` and `lms.txt`.
- `npm test`: verifies preserved content, anchors/assets, metadata and transfer budgets.

No framework, tracking service, remote font request or runtime directory API is required. Photography, logos and maps are local; below-the-fold images load lazily. The 23-second silent hero film and map animation stop offscreen and in background tabs. Snow is the only theme; no display or motion controls are shown. Operating-system reduced-motion and data-saving connections retain a static hero poster. The map offers selectable city connections and local clocks; Bangalore is included in the Snow-styled, keyboard-accessible destination menu. The footer combines the original landscape and CC0 definition with eight licensed mountain photographs and concise profiles. Vertical page scrolling advances the gallery slowly and reverses when scrolling up; short viewports and reduced motion retain native horizontal navigation. No display preference is written to local storage. Contribution dialogs prepare an email; they do not send it.

## Contributions

Pukar Hamal, [Jonathan Clarke](https://www.jonathanclarke.ie/) and [Aarjan Chaudhary](https://arjanchaudharyy.lol/) are credited in the repository and machine-readable summaries. See [all contributors](https://github.com/pchamal/siliconpeaks/graphs/contributors). These website credits do not imply employment at SecurityPal.

Submit a pull request with a source explaining a listing's connection to Nepal. Contact: scale@siliconpeaks.com; corrections: contribute@siliconpeaks.com. [Join Discord](https://discord.gg/Z7y3ZhvNCC).

## Sources and rights

See the [keyword and SEO plan](docs/SEO.md), [verification report](docs/QA.md), and [beta notes](docs/BETA.md) for content corrections and verification limits, and [asset provenance](docs/ASSETS.md) for photography, fonts, map data and logos. Original economic estimates are retained with visible qualifications, not represented as verified current statistics in structured data.

Code: [Apache-2.0](LICENSE). Name: original CC0 dedication. Third-party assets retain their stated licenses and trademark rights.
