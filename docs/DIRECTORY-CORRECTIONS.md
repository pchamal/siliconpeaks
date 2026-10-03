# Directory corrections, 29 September 2026

The following changes were checked against the supplied official websites. Logos are hosted locally and do not require third-party requests from visitors.

| Entry | Website | Logo treatment |
| --- | --- | --- |
| r0 Capital, formerly Uncorrelated Capital | https://r0capital.com/ | Official standalone mark |
| Uncommon Capital | https://investuncommon.com/ | Official standalone mark |
| Tectonic Capital | https://tectonic.vc/ | Blue symbol cropped from its published vector wordmark; the generic site-builder favicon is excluded |
| DBA | https://dba.xyz/ | Header wordmark with the site's computed light-theme color; the blank favicon is excluded |
| AITC International | https://aitc.ai/ | Official header SVG |
| ARKBO Tech | https://www.arkbotech.com/ | Official icon, resized to 160 pixels |
| Alpas Technology | https://alpastechnology.com/ | Official white logo on a dark background for contrast |
| Naamche Labs | https://naamchelabs.com/ | Official favicon; added separately from the existing Naamche company |
| Flowli Studio | https://flowli.studio/ | Official icon, resized to 160 pixels |
| Y Combinator | https://www.ycombinator.com/ | Existing vector confirmed against YC's own navigation logo; excess SVG padding removed and display size increased |
| Addressgraph | https://kataho.app/ | User-supplied product URL with Kataho's official app mark |
| British Embassy Nepal | https://www.gov.uk/world/organisations/british-embassy-kathmandu | Official embassy header coat of arms, replacing the generic GOV.UK icon |
| French Embassy Nepal | https://np.diplomatie.gouv.fr/ | Official Marianne favicon, converted from ICO to PNG |
| Swiss Embassy Nepal | https://www.schweiz-nepal.eda.admin.ch/en/embassy-of-switzerland | Official header shield in SVG |
| German Embassy Nepal | https://kathmandu.diplo.de/np-de | Official foreign office eagle in SVG; updated embassy URL verified in the ministry directory |
| Australian Embassy Nepal | https://nepal.embassy.gov.au/ | Official embassy header coat of arms |

One Point at `onepoint.com.np` was removed as requested. OnePoint Financial at `myonepoint.com` remains. The directory now contains 113 unique companies, rendered as 114 homepage cards including the final placeholder, and 48 investors.

Exact asset URLs and transformations are recorded in [directory.json](../data/directory.json) and [logo-audit.json](../data/logo-audit.json). All reviewed images decode in Chromium. Updated company links appear on the homepage, search pages, structured data and LLM directory output; embassy links appear on the homepage and LLM directory.

Embassy cards now contain one mark, without duplicate flag emoji. Their square frames and SVG padding are consistent at desktop and mobile widths. Existing U.S. and Canadian marks are retained. Japan currently uses a clean national flag in SVG, not a verified embassy-specific logo: its embassy and foreign ministry websites returned access denied, so the owner approved the national flag as the interim mark.

## Layout follow-up

- Press rows have consistent internal padding and separated publisher, title and arrow columns.
- The publisher-homepage disclosure was removed; six selected articles and ten archive stories remain.
- The featured strip is centered and no longer includes the extra coverage call to action.
- Community organizations and diaspora headings are centered.
- A restrained geometric motif inspired by Nepali Dhaka patterns separates all ten main content transitions. The hero remains attached to its featured-publication strip.
- The hero and footer artwork are unchanged. The mountain profiles continue to use credited real photographs.

All 10 tests pass. Desktop and mobile checks find no horizontal overflow, no stale corrected-domain links, and no console errors after a clean reload. The SVG padding fix makes YC visible without altering its official design.

## Logos still needing verified sources

These older records retain readable names, initials or the appropriate flag. This list concerns logo availability, not whether the organizations exist.

- Dots n Dashes
- Facet Tech
- Jasper IT
- Machnet
- Maitri Holdings
- Outside Studio
- Rite Teams
- Smarten Tech
- Trilokya Tech

![Section transition](screenshots/refined-section-transition.jpg)

![Centered community heading](screenshots/refined-community-heading.jpg)

![Corrected embassy logos](screenshots/refined-embassy-logos.jpg)
