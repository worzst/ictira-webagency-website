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
    SectionHeading.astro # shared label + h2 component — used by Pricing, Faq, LP sections
    Pricing.astro       # prop-driven, 3 packages from data/packages.ts, CTA pre-selects radio
    Process.astro       # accent blue card, 5-step horizontal grid
    Portfolio.astro     # HIDDEN — waiting for real project screenshots
    Faq.astro           # accordion, single-open, prop-driven
    Contact.astro       # dark card, left details + right form + Turnstile
    CookieBanner.astro  # fixed bottom bar, localStorage consent, gtag update
    Footer.astro        # logo + nav + legal links
  data/
    packages.ts         # single source of truth for all 3 package definitions
  scripts/
    formSubmit.ts       # shared wireForm() utility used by Contact and LP forms
  assets/
    picture/
      StefanWorzallaSquareSmall.jpg  # Stefan's photo, processed to WebP via getImage()
  styles/
    global.css          # reset, design tokens, .section-inner, .reveal, .grid-3
  pages/lp/
    professionelle-website-basel.astro  # Google Ads LP — self-contained, no Nav/Footer
functions/
  contact.ts            # Cloudflare Pages Function — POST /contact → Resend API
public/
  favicon.svg           # logomark only (100×100, blue circle + red inner)
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

## Astro conventions — hard-won rules

- **`global.css` lives in `Layout.astro`**, not in page files. Moving it elsewhere breaks styles on any page that doesn't import it separately. Learned when `LegalLayout` was refactored to extend `Layout`.
- **`LegalLayout.astro` wraps `Layout.astro`** — never give it its own `<html>` shell. All head content (GTM, fonts, consent, canonical) flows through `Layout`. Adding a new legal-style page: use `LegalLayout`, everything else is automatic.
- **TypeScript global declarations live in `src/env.d.ts`**. Extend `Window` there for any third-party globals (`dataLayer`, `turnstile`, `gtag`, etc.). No `(window as any)`, no `@ts-ignore`.
- **Run `npm run build` after any layout, CSS, or config change** before considering the task done. Most regressions (broken imports, type errors, missing styles) surface immediately at build time.
- **noindex pages**: pass `noindex={true}` to `Layout.astro` — it injects the meta tag. Used on LP and legal pages.
- **`/lp/` pages are excluded from sitemap** via `filter: (page) => !page.includes('/lp/')` in `astro.config.mjs`. Any new LP added under `src/pages/lp/` is automatically excluded.

---

## Scroll reveal

`.reveal` → fade in + slide up 40px, IntersectionObserver threshold 0.12, wired in `Layout.astro`.
Stagger: `data-delay="60|80|100|120|160|180|200|240|300"` (ms).

---

## Shared components

### SectionHeading

`src/components/SectionHeading.astro` — renders a monospace label + bold h2 with optional italic em line. Used wherever a section has a standard label+heading block.

```typescript
interface Props {
  label?: string;       // mono uppercase label above heading
  heading: string;      // h2 first line
  headingEm?: string;   // italic em second line (adds <br> automatically)
  align?: 'left' | 'center';  // default 'center'
  size?: 'lg' | 'md' | 'sm'; // default 'md' = clamp(48px,7vw,96px)
  mb?: number;          // margin-bottom in px, default 56
}
```

Sizes: `sm` = `clamp(40px,5vw,72px)` · `md` = `clamp(48px,7vw,96px)` · `lg` = `clamp(56px,7vw,96px)`

**Do NOT use** for headings inside colored cards (Process blue card, Contact/abschluss dark card) — those inherit text color from the card and use opacity, not `var(--mute)`.

### Pricing

`src/components/Pricing.astro` — prop-driven pricing grid. Data from `src/data/packages.ts`.

```typescript
interface Props {
  label?: string; heading?: string; headingEm?: string;
  footnote?: string;
  ctaHref?: string;          // default '#kontakt'
  ctaLabel?: string;         // default '{pkg.name} wählen'
  bulletSet?: 'includes' | 'lpItems';  // default 'includes'
  showNumbers?: boolean;     // 01/03 numbering, default true
  tagField?: 'tag' | 'sub';  // which pkg field to show as subtitle, default 'tag'
  padTop?: boolean;          // section top padding, default true
  align?: 'left' | 'center'; // heading alignment, default 'center'
}
```

- Popular badge is hardcoded "Meistgewählt"
- Price formatted with Swiss apostrophe thousands separator (1'490)
- Sub line always shows "Fertig in {pkg.turnaround} Tagen"
- CTA click pre-selects matching radio in Contact form (safe no-op if no radio found)

### Faq

`src/components/Faq.astro` — prop-driven accordion. Accepts `questions`, `label`, `heading`, `headingEm`, `align`. Defaults to main-site questions if none passed.

### LeadForm

`src/components/LeadForm.astro` — generic, prop-driven lead capture form. Used by Contact.astro and both LP forms. Handles honeypot, `_source` tracking, Turnstile, success/error states, and wireForm wiring internally via data attributes (safe for multiple instances on one page).

```typescript
type Field =
  | { type: 'text'|'email'|'tel'|'url'|'number'|'password'; name: string; placeholder?: string; required?: boolean }
  | { type: 'textarea'; name: string; placeholder?: string; rows?: number; required?: boolean }
  | { type: 'radios'; name: string; options: string[] };

interface Props {
  id: string;              // element ID prefix: {id}Form, {id}Success, {id}Error, {id}Label
  source: string;          // value for hidden _source field (appears in email subject)
  fields: Field[];         // ordered field list
  action?: string;         // POST URL, default '/contact'
  submitLabel?: string;    // button text, default 'Absenden'
  submitVariant?: 'accent' | 'ink';  // button color, default 'accent'
  successTitle?: string;
  successBody?: string;
  errorHtml?: string;      // supports HTML (e.g. mailto links)
  turnstileTheme?: 'light' | 'dark';
  theme?: 'light' | 'dark';  // field color scheme, default 'light'
}
```

Named slot `after-submit` — rendered after the submit button (used for trust indicators on LP hero form).

### Turnstile

`src/components/Turnstile.astro` — renders the Cloudflare Turnstile widget div. Props: `theme?: 'light' | 'dark'`. The API script (`challenges.cloudflare.com`) is loaded once in `Layout.astro`.

### formSubmit

`src/scripts/formSubmit.ts` — exports `wireForm(formId, successId, errorId, labelId, defaultLabel)`. Called by LeadForm's internal script. Handles fetch, success state, turnstile reset on error, and `dataLayer.push({ event: 'form_submit_success' })`.

---

## Package data (`src/data/packages.ts`)

Single source of truth. Each package has:
- `name`, `price` (string, no separator — formatted in component), `tag`, `sub`, `turnaround` (days as string: `'7'`, `'7–10'`, `'14'`), `popular`
- `includes[]` — main site bullet list (7 items)
- `lpItems[]` — LP conversion bullet list (4–5 items, benefit-focused)

Packages: **Onepager** CHF 1'490 · **Standard** CHF 1'990 (popular) · **Grösser** CHF 2'990

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

### Contact

Fields: name (required), email (required), firm (optional), phone (optional, type=tel), package radios, message textarea.
Hidden field `_source` = `"Hauptseite"` — included in email subject for tracking.
Left column shows email + address. **Company phone hidden** (waiting for number — uncomment `.detail` block in `Contact.astro`).
On success: `dataLayer.push({ event: 'form_submit_success' })` for GTM conversion tracking.

### CookieBanner

Key: `ictira_consent` in localStorage. On load: if `granted` → call `gtag consent update`; if no value → show banner. Buttons write to localStorage and call `gtag consent update` immediately.

### Landing page (`/lp/professionelle-website-basel`)

Dedicated Google Ads conversion page. Self-contained — no `Nav.astro` or `Footer.astro`, uses `Layout.astro` (with `noindex={true}`) for GTM/fonts/consent. Excluded from sitemap.

**Sections (in order):** sticky LP header → hero (H1 + bullets + form) → Für wen → Was inklusive → Pakete (`<Pricing>`) → Prozess → Über Stefan → FAQ (`<Faq>`) → Abschluss-CTA → minimal footer.

**Two forms:** hero (`_source: "LP Basel · Hero"`) and abschluss (`_source: "LP Basel · Abschluss"`). Both use `wireForm()` and push `form_submit_success` to `dataLayer`.

**Icons:** uses `astro-icon` + `@iconify-json/tabler`. Import `{ Icon }` from `'astro-icon/components'`.

**Stefan's photo:** `src/assets/picture/StefanWorzallaSquareSmall.jpg` processed to WebP via `getImage()`. Float-right on mobile ≤768px with clearfix.

**Referenzen section:** currently commented out — waiting for real project screenshots.

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

Spam protection: honeypot `_hp` field + Cloudflare Turnstile (managed mode — intentionally visible so users can self-resolve challenges).

Flow: check honeypot → verify Turnstile token → send via Resend API → return 200/500.
Email subject includes `_source` field: `[LP Basel · Hero] Neue Anfrage von …`
Email includes reply-to set to submitter's address. `message` field is optional.

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

- `/sitemap-index.xml` — auto-generated by `@astrojs/sitemap`, covers `/`, `/impressum`, `/datenschutz`. All `/lp/` pages filtered out.
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
6. **LP referenzen** — replace commented-out section with real project screenshots once available
