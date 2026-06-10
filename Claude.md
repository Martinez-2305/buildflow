#CLAUDE.md
Project guidance for Claude Code. Read this file in full before doing anything. These are standing instructions for the whole project — follow them on every task unless the user explicitly overrides them in chat.


1. What we're building
A marketing landing page for a demo SaaS product: a Quote & Invoicing + CRM app for builders and trades (electricians, plumbers, builders, roofers, joiners, decorators, etc.).

Goal of the page: convince a busy tradesperson, in under 30 seconds, that this tool will get them paid faster and chasing quotes less. Drive one primary action (book/try the demo).
Audience: non-technical, time-poor, mostly on a phone, often standing on a job site. Plain language, no SaaS jargon, no buzzwords.
Deliverable: a static site — hand-coded HTML, CSS, and JavaScript. No framework, no build step, no bundler unless I explicitly ask. It should be deployable straight to Vercel as static files.

If anything about the brief is ambiguous, make a sensible decision, state the assumption in your summary, and keep moving. Don't stall waiting for clarification on small things.


2. Hard rules (do not skip)
These are non-negotiable. If you're about to violate one, stop and reconsider.

Invoke the frontend-design skill BEFORE writing a single line of frontend code. This means before any HTML structure, any CSS, any layout work. Run it first, produce the design plan (tokens + type + layout + signature element), critique that plan against the brief, and only then write code. Do not "just start coding" the page. If you've written frontend code without having run frontend-design first, you've made a mistake — back up and do it properly.
Separate files, properly linked. HTML, CSS, and JS live in their own files (see structure below). No inline <style> blocks, no inline style="..." attributes, no inline <script> with logic, no JS-in-HTML event attributes (onclick="..."). CSS is linked via <link> in <head>; JS is linked via <script defer src="..."> before </body>.
Branding comes from the logo. Analyse the logo image before choosing any colours or fonts (see section 5). The page's palette and typography must be derived from the logo, not invented and not defaulted.
Apply the installed plugin skills where relevant. This project has plugins installed — use them at the right moments rather than reimplementing what they do by hand (see section 6).


3. Project structure
Create and maintain this layout. Keep concerns separated; don't dump everything into one folder.

/

├── index.html

├── css/

│   ├── styles.css          # main stylesheet

│   └── reset.css           # optional: normalise/reset (or @import into styles.css)

├── js/

│   └── main.js             # interactions only — keep it lean

├── assets/

│   ├── logo/               # the source logo lives here

│   └── images/             # optimised images (WebP/AVIF where possible)

├── favicon.ico             # generated from the logo

├── robots.txt

├── sitemap.xml

└── CLAUDE.md

Linking convention in index.html:

<link rel="stylesheet" href="css/styles.css">

...

<script defer src="js/main.js"></script>

If a reset stylesheet is used, link it before styles.css so cascade order is correct.


4. Coding standards
HTML: semantic HTML5 — <header>, <nav>, <main>, <section>, <footer>, real heading hierarchy (one <h1>, logical <h2>/<h3> order). Every image has meaningful alt text. Buttons are <button>, links are <a>; don't fake either with <div>.
CSS: use CSS custom properties (:root { --color-... }) for the design tokens derived from the logo, so the whole palette is changeable in one place. Mobile-first media queries. Use a layout system (flexbox/grid) rather than hacks. Watch selector specificity — avoid classes that cancel each other's padding/margin between sections (a common bug; the frontend-design skill flags this too).
JS: vanilla, minimal, progressive enhancement. The page must read and convert with JS disabled. No external JS libraries unless I ask. Use defer. Keep main.js to genuine interactions (mobile nav toggle, smooth scroll, FAQ accordion, scroll reveals if used).
Accessibility (a11y): WCAG AA as a floor. Visible keyboard focus states, sufficient colour contrast (check the logo-derived palette against this — adjust shades if contrast fails), prefers-reduced-motion respected, ARIA only where semantics can't carry it, labelled form controls.
Responsive: test mental layouts at ~375px, ~768px, ~1280px. The phone view is the primary view for this audience — design it first, not last.
Performance: optimise and correctly size images, lazy-load below-the-fold images (loading="lazy"), no render-blocking junk, system fonts or properly preloaded web fonts (font-display: swap), keep total weight low. This page should score well on Core Web Vitals.
Comments: brief, useful comments at the top of each file and around any non-obvious block. Don't over-comment.
Git: make small, focused commits with clear messages as you complete logical chunks (e.g. feat: hero section, style: derive palette from logo, chore: add schema markup). Don't commit one giant blob at the end.


5. Logo analysis & branding (do this in the design phase)
Before designing, locate the logo (check assets/logo/; if it's not there, ask me where it is or to drop it in). Then:

Inspect the actual image — open it, look at it, sample the colours. Don't guess from the filename.
Extract a palette of 4–6 named hex values: a primary, an accent, a near-neutral dark, a near-neutral light, and one or two supporting tones. Derive these from the logo's actual colours. If a colour fails contrast for body text or buttons, create a darker/lighter variant rather than abandoning the brand colour.
Identify or match the typography. If the logo uses a recognisable typeface (or a close match exists), pair a display face that echoes the logo's character with a clean, legible body face. Don't reach for the same default pairing you'd use on any project — let the logo's personality lead. Load fonts performantly.
Build these into CSS custom properties as the single source of truth for the page's brand.
Generate a favicon from the logo and wire it up.

The logo is the brand brief. The page should look like it belongs to the product, not like a generic template that happens to have a logo pasted in the corner.


6. Installed plugins — when to use each
Plugins are installed for this project. Apply them at the right stage rather than doing their job by hand. Recommended sequencing:

Before/during design & build

frontend-design — run FIRST, before any frontend code (see Hard Rules). This is the most important one.
keyword-clustering — early, to decide which search terms the page should target (e.g. "invoicing app for builders", "send quotes from phone tradesperson", "CRM for trades"). Feeds the copy and on-page work.
content-strategy / content-brief — to structure the page's sections and messaging before writing final copy, so the page is built around what the audience actually searches for and needs to read.

After the page structure exists

on-page-seo — optimise the <title>, meta description, H1, heading structure, internal copy, and image alt text around the target keywords.
schema-markup — add JSON-LD structured data: SoftwareApplication (or Product) for the app, Organization, and FAQPage if there's an FAQ section. This is high-value for a SaaS landing page.
internal-linking — apply lightly. It's a single page, but use it for sensible anchor links between sections and to plan links to any future pages (pricing, features, blog).

As QA before "done"

technical-seo — check page speed, Core Web Vitals, mobile-friendliness, robots.txt, and sitemap.xml.
broken-links — verify no dead links or 404s.
seo-audit — run a final comprehensive pass to catch anything missed.
ai-visibility (GEO/AEO) — apply so the product is well-described for AI assistants and answer engines, not just classic search. Worthwhile for a new demo product trying to get discovered.

Use judgement: if a plugin clearly doesn't fit a given task, say so and skip it rather than forcing it. Don't run all ten just to tick boxes — run the ones that earn their place for this page.


7. Suggested page sections
A starting structure for a trades SaaS landing page (adapt as the frontend-design plan and content-strategy work suggest — this is a guide, not a mandate):

Header / nav — logo, a couple of anchor links, and the primary CTA button.
Hero — the page's thesis. Lead with the single most compelling promise for this audience (get paid faster / quote in minutes from your phone). One clear primary CTA. Treat this per the frontend-design guidance — avoid the generic "big headline + stat + gradient" default unless it's genuinely the best answer.
The problem — the pain in the tradesperson's own words (chasing payments, quotes lost in WhatsApp, paperwork at 9pm).
How it works — 3 simple steps (quote → send → get paid / track in CRM). Only use numbered markers because it's a real sequence.
Features / benefits — framed as outcomes for the user, not a feature dump. Plain verbs.
Social proof — testimonials/logos placeholder (clearly marked as demo content; don't fabricate real customer quotes or company names).
Pricing or "try the demo" — depending on what I confirm; default to a single demo CTA for now.
FAQ — short, real objections. Wire to FAQPage schema.
Final CTA — restate the primary action.
Footer — minimal: logo, contact, legal placeholders, links.

Copy rules: active voice, sentence case, plain trade-friendly language, specific over clever. A button says exactly what happens ("Try the demo", "Book a walkthrough"). No lorem ipsum in the final version — write real, on-brand placeholder copy. Don't invent fake statistics, real customer names, or unverifiable claims.


8. Definition of done
Before you tell me a task is complete, confirm:

frontend-design skill was run before any frontend code, and the design derives from the logo.
HTML / CSS / JS are in separate files and correctly linked; no inline styles or scripts.
Palette and fonts come from the logo and are set as CSS custom properties; favicon generated.
Semantic HTML, single <h1>, logical headings, alt text on all images.
Responsive and tested at phone / tablet / desktop widths; mobile looks intentional, not squashed.
Keyboard-navigable, visible focus, AA contrast, reduced-motion respected.
Page works with JavaScript disabled.
On-page SEO, JSON-LD schema, robots.txt, and sitemap.xml in place.
broken-links and seo-audit run clean; performance/Core Web Vitals checked via technical-seo.
Copy is real, on-brand, jargon-free, with no fabricated claims; CTAs are clear and consistent.
Committed in clear, logical commits; deployable to Vercel as static files.


9. Working style
Plan briefly, then build. Show me the design plan (tokens, type, layout concept, signature element) before building the full page so I can react early.
Take a real aesthetic risk in one place (the signature element) and keep everything else disciplined and quiet.
Tell me which plugins/skills you used for each chunk of work.
Flag assumptions and anything you skipped, with the reason.
If you hit something genuinely blocking (missing logo, unclear product detail that changes the design), ask — otherwise keep moving.

