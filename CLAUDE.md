# ictira GmbH — Website

## Overview
Marketing site for **ictira GmbH**, fixed-price web design agency, Zunzgen BL, Switzerland. Targeting Swiss German SMEs. Copy is German, Du-Form. Positioning: bold, direct, no hidden costs.

**Stack:** Astro 6 (static), TypeScript, scoped CSS per component. No UI frameworks.

```
npm run dev      # dev server (localhost:4321)
npm run build    # production build → dist/
npm run preview  # preview build locally
```

**Deployed:** Cloudflare Pages — `https://www.ictira.com`
Apex `ictira.com` → redirect to `www` via Cloudflare Redirect Rule.

---

## File structure
```
src/
  layouts/
    Layout.astro        # HTML shell: fonts, canonical, GTM + Consent Mode v2, CookieBanner
    LegalLayout.astro   # legal pages: back nav + footer, noindex meta
  pages/
    index.astro         # single-page site, all sections composed here
    impressum.astro
    datenschutz.astro
  components/
    Nav.astro           # sticky, CSS Grid 1fr/auto/1fr centering, mobile hamburger
    Hero.astro          # dark card, animated orbs, two marquee strips (RAF loop)
    Services.astro      # 6 cards, 3-col grid
    Pricing.astro       # 3 packages, middle card popular/scaled, CTA pre-selects radio
    Process.astro       # accent blue card, 5-step horizontal grid
    Portfolio.astro     # HIDDEN — waiting for real project screenshots
    Faq.astro           # accordion, single-open
    Contact.astro       # dark card, left details + right form + Turnstile
    CookieBanner.astro  # fixed bottom bar, localStorage consent, gtag update
    Footer.astro        # logo + nav + legal links
  styles/
    global.css          # reset, design tokens, .section-inner, .reveal, .grid-3
functions/
  contact.ts            # Cloudflare Pages Function — POST /contact → Resend API
public/
  favicon.svg           # logomark only (100×100, blue circle + red inner)
  favicon.ico           # ico fallback
  logo-mark.svg         # same as favicon.svg, standalone asset
  logo.svg              # mark + "ictira" wordmark as SVG text
  robots.txt            # Allow all, Sitemap pointer
```

---

## Design tokens
```css
--bg:      #ECEAE4   /* warm off-white canvas */
--paper:   #F4F2EC   /* card backgrounds */
--ink:     #0E0F12   /* near-black — text + dark cards */
--mute:    #6A6D73   /* secondary text */
--line:    rgba(14,15,18,0.12)
--accent:  #3A2BFF   /* electric indigo — CTAs, highlights */
--hot:     #FF4D2E   /* orange-red — decorative */
--success: #8DFE4C   /* form success state */
--yellow:  #FEF08A   /* process section accent */
--font:    'Inter Tight'
--mono:    'JetBrains Mono'
```

Max content width: 1360px via `.section-inner`
Section padding: `96px 32px` → `16px` horizontal on mobile ≤480px
Card radii: 28px (services), 32px (pricing), 48px (hero/process/contact), 24px (FAQ)

---

## Scroll reveal
`.reveal` → fade in + slide up 40px, IntersectionObserver threshold 0.12, wired in `Layout.astro`.
Stagger: `data-delay="60|80|100|120|160|180|200|240|300"` (ms).

---

## Components

### Nav
CSS Grid `1fr auto 1fr` — logo `justify-self:start`, CTA `justify-self:end`. Mobile: hamburger `grid-column:3; justify-self:end`. Adds `.scrolled` (blur bg) at scroll > 20px. CTA copy: "3 Plätze frei · Q2/26".

**Link behaviour — always verify when adding pages:**
- Logo: `href="/"` always. JS intercepts on homepage to smooth-scroll to top instead of reloading.
- Nav section links + CTA: prefix is computed from `Astro.url.pathname` — empty string on `/`, leading `/` on all subpages. This means `#leistungen` on the homepage, `/#leistungen` on legal pages. Any new page using `Nav.astro` gets this automatically.
- Mobile menu links follow the same prefix logic.

### Hero
Marquee prices: `CHF 1490 · Onepager`, `CHF 1990 · Bis 5 Seiten`, `CHF 2990 · Grössere Sites`. RAF loop at 0.8px/frame (strip 1) and 0.45px/frame (strip 2, reversed).

### Pricing
- **CHF 1490** Onepager (7 Tage)
- **CHF 1990** Standard (14 Tage) — popular, dark bg, scale(1.04)
- **CHF 2990** Grösser (3–4 Wochen)
- CTAs: `<a href="#kontakt" data-pack="...">` — click pre-selects matching radio in Contact form
- Footnote: Domain CHF 19.90/yr, Hosting CHF 9.90/mo, 50/50 payment split

### Contact
Fields: name (required), email (required), firm (optional), **phone (optional, type=tel)**, package radios, message textarea.
Left column shows email + address. **Company phone hidden** (waiting for number — uncomment `.detail` block in `Contact.astro`).
On success: `dataLayer.push({ event: 'form_submit_success' })` for GTM conversion tracking.

### CookieBanner
Key: `ictira_consent` in localStorage. On load: if `granted` → call `gtag consent update`; if no value → show banner. Buttons write to localStorage and call `gtag consent update` immediately.

### Legal pages
- `/impressum` — Aufgendsweg 3, 4455 Zunzgen, CHE-476.809.964
- `/datenschutz` — covers Cloudflare, Google Fonts, Resend, Turnstile, GA4/GTM (consent-gated), localStorage
- Both use `LegalLayout.astro` (noindex)

---

## Tracking (GTM + GA4 + Consent Mode v2)

### Consent defaults (Layout.astro, runs before GTM)
- EEA + UK + CH: all denied, `wait_for_update: 500`
- All other regions: all granted (second default call, no region filter)

### GTM setup
Container ID stored in `PUBLIC_GTM_ID` (build env var). GTM not loaded if var is empty.
Tags to configure in GTM dashboard:
1. **GA4 Configuration** — trigger: Consent Initialization - All Pages
2. **GA4 Event: generate_lead** — trigger: Custom Event `form_submit_success`
3. **Google Ads Conversion** — trigger: Custom Event `form_submit_success` (needs Conversion ID + Label from Google Ads)

### Verifying events
Use **GA4 → Admin → DebugView** (real-time). Standard reports have up to 24h delay.
GTM Preview mode shows tags as "Fired" even when consent is denied — always test with cookie banner accepted.

---

## Form backend (`functions/contact.ts`)
Cloudflare Pages Function. POST to `/contact`.

Spam protection: honeypot `_hp` field + Cloudflare Turnstile (server-side token verification).

Flow: check honeypot → verify Turnstile token → send via Resend API → return 200/500.
Email includes reply-to set to submitter's address.

**Env vars** (Cloudflare Pages → Settings → Environment variables):
| Variable | Scope | Value |
|---|---|---|
| `PUBLIC_GTM_ID` | Build | `GTM-XXXXXXX` |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build | from CF Turnstile dashboard |
| `RESEND_API_KEY` | Runtime | `re_...` from resend.com |
| `CONTACT_TO` | Runtime | `hallo@ictira.com` |
| `CONTACT_FROM` | Runtime | `forms@ictira.com` (verified Resend domain) |
| `TURNSTILE_SECRET` | Runtime | from CF Turnstile dashboard |

Local dev: `.env` for build vars, `.dev.vars` for runtime vars (both gitignored).

---

## Sitemap + robots
- `/sitemap-index.xml` — auto-generated by `@astrojs/sitemap` at build time (covers `/`, `/impressum`, `/datenschutz`)
- `/robots.txt` — Allow all, points to sitemap

---

## Business details
- **Legal name:** ictira GmbH
- **Address:** Aufgendsweg 3, 4455 Zunzgen, Schweiz
- **UID/MWST:** CHE-476.809.964
- **Email:** hallo@ictira.com
- **Phone:** TBD — hidden in contact section left column

---

## TODO
1. **Portfolio** — unhide `Portfolio.astro` in `index.astro` + restore nav link when real screenshots ready (6 planned: Metzgerei Brunner, Atelier Widmer, Praxis Dr. Meier, Flux Coffee Roasters, Alpin Consulting AG, Verein KunstRaum)
2. **Company phone** — uncomment Telefon block in `Contact.astro` left column once number is active
3. **Resend domain** — verify sending domain in Resend dashboard
4. **Google Ads conversion tag in GTM** — create conversion action in Google Ads (Goals → Conversions → New → Website → "Submit lead form") → get Conversion ID (`AW-XXXXXXXXX`) + Conversion Label → in GTM add a "Google Ads Conversion Tracking" tag triggered by Custom Event `form_submit_success`. Do NOT use "Google tag found on your website" in campaign setup — it fails with permission denied because the tag belongs to the GA4 property, not the Ads account.
5. **Logo SVG** — convert wordmark text to paths in `logo.svg` for print/Figma use
