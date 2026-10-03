# Performance verification

Measured on 28 September 2026 against https://siliconpeaks-snow.vercel.app/ with Lighthouse 13.0.3 in a fresh, headless Chrome profile with extensions disabled.

| Run | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Clean mobile baseline | 96 | 92 | 100 | 69 |
| Final mobile 1 | 98 | 100 | 100 | 100 |
| Final mobile 2 | 99 | 100 | 100 | 100 |
| Final mobile 3 | 99 | 100 | 100 | 100 |
| Final desktop | 100 | 100 | 100 | 100 |

The mobile median is **99 / 100 / 100 / 100**. Median measurements are FCP 1.38 seconds, LCP 1.94 seconds, Speed Index 1.49 seconds, total blocking time 44 milliseconds, and CLS 0. These are laboratory measurements, not field Core Web Vitals. Scores vary with hardware, network conditions and browser state. A consistent mobile 100 has not been established.

## Changes

- Removed the public beta's noindex header and restrictive robots file. The official canonical remains siliconpeaks.com.
- Corrected low-contrast secondary text and crowded mobile map targets. The full destination picker remains available.
- Consolidated the homepage styles into one compressed request and removed obsolete styles from earlier layouts.
- Added content-versioned asset paths with one-year immutable caching. Changed assets receive a new URL on deployment.
- Preloaded a 40 KB AVIF hero poster matching the first frame of the film. Structured data now follows the visible content so it does not delay discovery of critical styles and imagery.
- Kept the calculator and city collection out of the initial JavaScript. They load when the calculator opens.
- Removed synchronous navigation height reads, limited navigation custom-property inheritance, and stopped eagerly fetching mountain-profile images before the gallery approaches the viewport.
- Added the supplied footer artwork as 51 KB and 17 KB responsive WebP files.

The site still plays its hero video, animates the map, and advances the mountain profiles with page scrolling. No feature changes depend on Lighthouse or the browser's user agent.

## Reproduce

```sh
npx --yes lighthouse@13.0.3 https://siliconpeaks-snow.vercel.app/ \
  --chrome-flags="--headless --disable-extensions --no-first-run" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=lighthouse-mobile.json
```

Add `--preset=desktop` for the desktop configuration. Run sequentially in a clean profile and report the median of repeated mobile runs. The [recorded metrics](lighthouse.json) include timestamps, configuration and all final runs.
