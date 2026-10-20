# Taamoo Studio SEO / AI search plan

Audit date: 2026-10-20. Scope: repository source and public reference pages. Changes are local; deployment, Google indexing and Search Console submission are not verified.

## Findings and implementation

Before: 13 HTML pages; 12 lacked descriptions, all lacked canonicals and JSON-LD; no robots.txt or sitemap; two App Store games existed only as homepage cards. The nine canvas prototypes lacked a consistent route back to the game catalogue. Three prototypes have Chinese interfaces despite the English homepage.

Now: 16 canonical HTML pages, each with unique titles/descriptions, canonical and social metadata. New `/games/`, `/games/tendril/` and `/games/panda-go/` pages are static HTML, readable without JavaScript. Homepage → directory → product/play pages → directory links make all pages reachable. Existing play URLs remain stable. The directory contains English instructions and an honest interface-language comparison. Navigation sits inside game menus and leaves gameplay unobstructed.

Schema: Organization and WebSite identify the studio; BreadcrumbList records page hierarchy; ItemList describes the catalogue; VideoGame describes prototypes; the two iOS games also use SoftwareApplication. Facts match the visible content. No invented ratings, review counts, prices, awards, competitor performance or release dates. These semantic annotations do not promise rich-result eligibility; SoftwareApplication rich results have additional documented requirements. Do not fabricate reviews to meet them.

Sitemap lists all 16 canonical pages once, including privacy and support. No fake `lastmod`, `priority` or `changefreq`. `robots.txt` allows crawling and declares the sitemap; CDN/hosting behavior must still be checked after deployment. Existing CNAME, app-ads.txt and analytics setup are retained.

## Search intent and page ownership

| Page | Primary English intent | Supporting questions |
| --- | --- | --- |
| `/` | Taamoo Studio; indie mobile games | Who makes Tendril and Panda Go? |
| `/games/` | Taamoo browser games; indie browser prototypes | How to play; controls; which games have English interfaces? |
| `/games/tendril/` | Tendril game; vine growing arcade game iOS | One-finger controls; Daily Garden; cosmetic skins; saved progress |
| `/games/panda-go/` | Panda Go; learn Go board game app; Baduk for beginners | Six difficulty levels; capture puzzles; free and no ads |
| `/play/{slug}/` | Specific game name + browser game/mechanic | Direct play; link to directory instructions |
| `/support.html` | Taamoo / Tendril support | Troubleshooting and contact |

These are intent hypotheses, not measured search volumes. Prioritize branded and specific mechanic queries before broad terms such as “free games”. Use Go / Baduk / Weiqi with “board game” to avoid programming-language ambiguity. Do not add hreflang until equivalent localized pages actually exist. Keep Chinese prototypes correctly marked `zh-CN`; an English description is not an English game translation.

## Five public references

These observations concern visible content, not demonstrated top-three rankings. Ranking positions, link authority and causal percentage weights cannot be established from these pages. The “why it could help” column is an inference.

| Reference | Observed on 2026-10-20 | Why it could help (inference) | Taamoo application |
| --- | --- | --- | --- |
| [Go Magic](https://gomagic.org/) | Course catalogue, beginner resources, linked learning topics and questions | Distinct topic pages make specific learning intentions easier to satisfy | Dedicated Panda Go page; explain beginner practice and link to support |
| [BadukPop](https://badukpop.com/) | Names Go / Baduk / Weiqi, explains tutorials and opponents, direct web play | Clear category vocabulary and playable CTA reduce ambiguity | Use board-game synonyms and state exactly what Panda Go contains |
| [GoQuest official listing](https://apps.apple.com/us/app/goquest/id834841918) | Describes online play and board sizes | Platform and mode specificity helps users compare options | State iOS availability and avoid implying online multiplayer in Panda Go |
| [Tanglevine](https://shahawiapps.com/games/tanglevine/) | Playable canvas plus HTML mechanics, controls, tips and links to other games | Text can explain a canvas experience to players and crawlers | Put English mechanics and instructions in the directory; link from game menus |
| [Nitrome](https://www.nitrome.com/) | Platform/category navigation and links to individual games | A catalogue connects discovery queries with playable destinations | Create a connected games hub rather than isolated play screens |

Not added to public product pages: unsupported “best game” claims or a competitive scoring table. The public comparison table compares Taamoo's own prototypes using source-verifiable controls and languages. Competitor prices and feature counts would require ongoing maintenance and are unnecessary for these landing pages.

## What to keep from the supplied SEO workflow

Keep descriptive titles, crawlable internal links, reliable facts, answer-first introductions, useful FAQs and sitemap checks. The product introductions are under 50 English words and FAQ answers are under 80 English words. Keep brand personality rather than deleting every subjective word from the site.

Do not require a number in every H2: controls and rules should be explained naturally. Counts such as six difficulty levels and 12 capture puzzles come from the existing product descriptions. Current App Store availability and compatibility should be checked per market; the Panda Go listing did not load through the research tool, so no extra OS version, price or regional claim was inferred.

FAQ content is for users. Google retired FAQ rich results starting May 7, 2026 and removed its documentation in June; FAQPage markup was therefore not added as a ranking tactic. AI Overviews does not require a special AI file or Schema. A seven-day top-three/AI recommendation guarantee and assertions of doubled crawl efficiency are unsupported.

Official guidance:
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google documentation updates: FAQ retirement, May/June 2026](https://developers.google.com/search/updates)
- [Software application structured data requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## Deployment and measurement

1. Deploy the reviewed static files using the existing hosting workflow. New folders need no build step. No commit, push or deployment was performed in this task.
2. Verify HTTPS and the preferred host `https://taamoo.com/`; check HTTP/www redirects, 200 responses for canonical pages, and a real 404 for missing pages. Canonical tags are signals, not redirects.
3. Verify `/robots.txt` and `/sitemap.xml` over public HTTPS. Use the Search Console domain property (DNS verification if needed) and submit `https://taamoo.com/sitemap.xml`. This task has no authenticated GSC access and does not claim submission.
4. Inspect the homepage, directory and both app landing URLs in GSC; request indexing where appropriate. Use Rich Results Test for supported features and Schema Markup Validator for broader vocabulary validation. Local JSON parsing alone does not certify Google's rich results.
5. Baseline before launch: record country/device/query/page data in GSC and existing GA4 reports. Separate brand queries from nonbrand terms. Outbound App Store clicks measure website handoffs, not confirmed installs. Enable/verify outbound click measurement in GA4 rather than assuming that page-view setup measures installs.
6. After 7 days: inspect fetch/indexing errors and sitemap processing. After 28 days and again after 8–12 weeks: compare impressions, clicks, CTR, query mix and App Store handoffs, taking geography and device into account. Low traffic may require longer observation.
7. For AI search, retain referral source/medium/landing page where available. Manually sample a fixed set of English prompts (brand, vine arcade iOS, Go beginner app with no ads) and record date, engine, locale and cited URL. Citation samples vary and do not prove causality. GSC Web reports include Google's AI-feature traffic without a dedicated AI Overviews breakout; missing referrers also prevent complete attribution.

Run `python3 scripts/check_seo.py` before each release. It checks metadata, JSON-LD parsing, canonical and OG URLs, local links/assets/fragments, graph reachability from the homepage, sitemap coverage and robots declaration. It does not measure rankings, Core Web Vitals, hosting redirects or app functionality.

## Remaining product work

- Translate Firefly Pond, Lantern and Echo Twins fully into English before promoting them as English-language games.
- Review general privacy policy versus Tendril-specific policy against actual shipped app behavior. They currently disagree about analytics and children. Support now links to the correct scope rather than repeating “no data” claims; legal policy text was not guessed or rewritten.
- Replace broad child-safety/offline promises in future marketing with per-game, verified statements. Homepage now uses concrete game descriptions instead of the blanket trust strip.
- Add original gameplay screenshots/video only when available. No Tendril artwork is used to represent unrelated prototype games in social metadata.
- Consider a standalone guide per prototype only when player demand and substantial unique content justify it; avoid creating thin keyword pages for every synonym.
