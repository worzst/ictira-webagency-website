# ictira GmbH — Website

## Overview

Marketing site for **ictira GmbH**, fixed-price web design agency, Zunzgen BL, Switzerland. Targeting Swiss German SMEs. Copy is German, Du-Form. Positioning: bold, direct, no hidden costs.

**Stack:** Astro 6 (static), TypeScript, scoped CSS per component. No UI frameworks.

```
npm run dev           # dev server (localhost:4321)
npm run build         # env check → astro check → astro build → dist/
npm run preview       # preview build locally
npm run lint          # ESLint
npm run lint:fix      # ESLint --fix
npm run format        # Prettier --write
npm run format:check  # Prettier --check
```

**Deployed:** Cloudflare Pages — `https://www.ictira.com`
Apex `ictira.com` → redirect to `www` via Cloudflare Redirect Rule.

---

## File structure

```
src/
  layouts/
    Layout.astro        # HTML shell: fonts, canonical, GTM + Consent Mode v2, CookieBanner, Turnstile script
    LegalLayout.astro   # wraps Layout.astro — back nav + footer, noindex meta
  pages/
    index.astro         # single-page site, all sections composed here
    impressum.astro
    datenschutz.astro
    lp/
      professionelle-website-basel.astro  # Google Ads LP — no Nav/Footer, noindex, excluded from sitemap
  components/
    Nav.astro           # sticky, CSS Grid 1fr/auto/1fr, mobile hamburger
    Hero.astro          # dark card, animated orbs, two marquee strips (RAF loop)
    Services.astro      # 6 cards, 3-col grid
    SectionHeading.astro
    Pricing.astro       # prop-driven, data from packages.ts, CTA pre-selects Contact radio
    Process.astro       # accent blue card, 5-step horizontal grid
    Portfolio.astro     # HIDDEN — waiting for real screenshots
    Faq.astro           # accordion, single-open, prop-driven
    Contact.astro       # dark card, left details + right LeadForm
    LeadForm.astro      # generic reusable form — used by Contact + LP
    Turnstile.astro     # CF Turnstile widget div (API script loaded once in Layout.astro)
    GTM.astro           # GTM loader via set:html — avoids Prettier/define:vars conflict
    CookieBanner.astro  # fixed bottom bar, localStorage consent, gtag update
    Footer.astro        # logo + nav + legal links
  data/
    packages.ts         # single source of truth for all 3 package definitions
  scripts/
    formSubmit.ts       # wireForm() — used by LeadForm internally
  assets/
    picture/
      StefanWorzallaSquareSmall.jpg  # processed to WebP via getImage()
  styles/
    global.css          # reset, design tokens, .section-inner, .reveal, .grid-3
  env.d.ts              # TypeScript global declarations (Window, dataLayer, gtag, turnstile)
scripts/
  check-env.js          # pre-build guard — fails CF Pages deploy if runtime vars missing
functions/
  contact.ts            # Cloudflare Pages Function — POST /contact → Resend API
public/
  favicon.svg           # logomark only (100×100, blue circle + red inner)
  logo-mark.svg
  logo.svg              # mark + "ictira" wordmark as SVG text
  robots.txt
```

---

## Design tokens

```css
:root {
  --bg: #eceae4; /* warm off-white canvas */
  --paper: #f4f2ec; /* card backgrounds */
  --ink: #0e0f12; /* near-black — text + dark cards */
  --mute: #6a6d73; /* secondary text */
  --line: rgba(14, 15, 18, 0.12);
  --accent: #3a2bff; /* electric indigo — CTAs, highlights */
  --hot: #ff4d2e; /* orange-red — decorative */
  --success: #8dfe4c; /* form success state */
  --yellow: #fef08a; /* process section accent */
  --font: 'Inter Tight';
  --mono: 'JetBrains Mono';
}
```

Max content width: 1360px via `.section-inner`
Section padding: `96px 32px` → `16px` horizontal on mobile ≤480px
Card radii: 28px (services), 32px (pricing), 48px (hero/process/contact), 24px (FAQ)

---

## Tooling

### ESLint (`eslint.config.mjs`)

Flat config: `typescript-eslint` + `eslint-plugin-astro`. Two overrides for `.astro` files:

- `@typescript-eslint/no-empty-object-type: off` — `interface Props {}` is idiomatic Astro
- `no-unused-vars` ignores `Props` — framework uses it implicitly
- `src/layouts/Layout.astro` excluded from linting (Consent Mode `is:inline` script)

### Prettier (`.prettierrc`)

`printWidth: 120`, `singleQuote: true`, `prettier-plugin-astro`. `.prettierignore` excludes `dist/`, `node_modules/`, `.astro/`, `public/`. No other file exclusions — `GTM.astro` uses `set:html` to keep the snippet out of the template parser.

### Build-time env guard (`scripts/check-env.js`)

Runs only on Cloudflare Pages (`CF_PAGES === '1'`). Exits 1 if any of `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `TURNSTILE_SECRET` are unset — fails the deploy before Astro runs. Local builds skip this check.

---

## Env vars

| Variable                    | Scope   | Value                                       |
| --------------------------- | ------- | ------------------------------------------- |
| `PUBLIC_GTM_ID`             | Build   | `GTM-XXXXXXX`                               |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build   | CF Turnstile dashboard                      |
| `RESEND_API_KEY`            | Runtime | `re_...` from resend.com                    |
| `CONTACT_TO`                | Runtime | `hallo@ictira.com`                          |
| `CONTACT_FROM`              | Runtime | `forms@ictira.com` (verified Resend domain) |
| `TURNSTILE_SECRET`          | Runtime | CF Turnstile dashboard                      |

`PUBLIC_*` validated by Astro `env.schema` at build time. Runtime vars validated by `scripts/check-env.js` on CF Pages.
Local dev: `.env` for build vars, `.dev.vars` for runtime vars (both gitignored).

---

## Astro conventions

- **`global.css` lives in `Layout.astro`** — any page not using Layout loses all styles.
- **`LegalLayout.astro` wraps `Layout.astro`** — never give it its own `<html>` shell. New legal-style page: use `LegalLayout`.
- **TypeScript globals in `src/env.d.ts`** — extend `Window` there for `dataLayer`, `turnstile`, `gtag`. No `as any`, no `@ts-ignore`.
- **`noindex` pages**: pass `noindex={true}` to `Layout.astro`.
- **`/lp/` pages excluded from sitemap** via filter in `astro.config.mjs` — automatic for any new file under `src/pages/lp/`.
- **Run `npm run build` after any layout/CSS/config change** — most regressions surface immediately.

---

## Scroll reveal

`.reveal` → fade in + slide up 40px, `IntersectionObserver` threshold 0.12, wired in `Layout.astro`.
Stagger: `data-delay="60|80|100|120|160|180|200|240|300"` (ms).

---

## Shared components

### SectionHeading

```typescript
interface Props {
  label?: string; // mono uppercase label above heading
  heading: string; // h2 first line
  headingEm?: string; // italic em second line (adds <br> automatically)
  align?: 'left' | 'center'; // default 'center'
  size?: 'lg' | 'md' | 'sm'; // default 'md' = clamp(48px,7vw,96px)
  mb?: number; // margin-bottom in px, default 56
}
```

Sizes: `sm` = `clamp(40px,5vw,72px)` · `md` = `clamp(48px,7vw,96px)` · `lg` = `clamp(56px,7vw,96px)`

**Do NOT use** inside colored cards (Process blue, Contact dark) — those inherit text color from the card.

### Pricing

Data from `src/data/packages.ts`.

```typescript
interface Props {
  label?: string;
  heading?: string;
  headingEm?: string;
  footnote?: string;
  ctaHref?: string; // default '#kontakt'
  ctaLabel?: string; // default '{pkg.name} wählen'
  bulletSet?: 'includes' | 'lpItems'; // default 'includes'
  showNumbers?: boolean; // 01/03 numbering, default true
  tagField?: 'tag' | 'sub'; // subtitle field, default 'tag'
  padTop?: boolean; // default true
  align?: 'left' | 'center'; // default 'center'
}
```

Price formatted with Swiss apostrophe thousands separator (1'490). Sub line: "Fertig in {turnaround} Tagen". CTA pre-selects matching radio in Contact form.

### Faq

Accepts `questions`, `label`, `heading`, `headingEm`, `align`. Defaults to main-site Q&A if no `questions` passed.

### LeadForm

Generic lead capture form. Used by `Contact.astro` and both LP forms.

```typescript
type Field =
  | {
      type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'password';
      name: string;
      placeholder?: string;
      required?: boolean;
    }
  | { type: 'textarea'; name: string; placeholder?: string; rows?: number; required?: boolean }
  | { type: 'radios'; name: string; options: string[] };

interface Props {
  id: string; // ID prefix: {id}Form, {id}Success, {id}Error, {id}Label
  source: string; // hidden _source field value (appears in email subject)
  fields: Field[];
  action?: string; // default '/contact'
  submitLabel?: string; // default 'Absenden'
  submitVariant?: 'accent' | 'ink'; // default 'accent'
  successTitle?: string;
  successBody?: string;
  errorHtml?: string; // supports HTML (e.g. mailto links)
  turnstileTheme?: 'light' | 'dark';
  theme?: 'light' | 'dark'; // field color scheme, default 'light'
}
```

Named slot `after-submit` — rendered after submit button (LP hero trust indicators).
Wiring uses data attributes so multiple instances on one page work (Astro deduplicates `<script>` blocks).

### Turnstile

`theme?: 'light' | 'dark'`. API script loaded once in `Layout.astro` — do not add it elsewhere.

### GTM

`id: string` (required). Injects the GTM loader script via `set:html` to avoid `prettier-plugin-astro`'s inability to parse `define:vars` + IIFE content. Used as `{gtmId && <GTM id={gtmId} />}` in `Layout.astro`.

---

## Package data (`src/data/packages.ts`)

Each package: `name`, `price` (raw string, formatted in component), `tag`, `sub`, `turnaround` (string: `'7'`/`'7–10'`/`'14'`), `popular`, `includes[]` (main site bullets), `lpItems[]` (LP conversion bullets).

**Onepager** CHF 1'490 · **Standard** CHF 1'990 (popular) · **Grösser** CHF 2'990

---

## Key component notes

### Nav

CSS Grid `1fr auto 1fr`. CTA copy: "3 Plätze frei · Q2/26". Link prefix computed from `Astro.url.pathname` — empty on `/`, `/#` on subpages. Works automatically for any new page — no changes needed to Nav.

### Hero

Marquee: `CHF 1490 · Onepager`, `CHF 1990 · Bis 5 Seiten`, `CHF 2990 · Grössere Sites`. RAF loop: 0.8px/frame strip 1, 0.45px/frame strip 2 (reversed).

### Contact

`LeadForm` fields: name*, email*, firm, phone (tel), package radios, message textarea. `source="Hauptseite"`. Theme dark. **Phone hidden** — uncomment `.detail` block once number is active.

### CookieBanner

localStorage key: `ictira_consent`. On load: `granted` → `gtag consent update`; no value → show banner.

### Landing page (`/lp/professionelle-website-basel`)

No Nav/Footer. Uses `Layout.astro` with `noindex={true}`. Two `LeadForm` instances: `source="LP Basel · Hero"` (hero, `submitVariant="ink"`, trust indicators in `after-submit` slot) and `source="LP Basel · Abschluss"` (dark theme). Uses `astro-icon` + `@iconify-json/tabler`. Stefan's photo via `getImage()` to WebP. Referenzen section commented out — waiting for screenshots.

### Legal pages

`/impressum`, `/datenschutz` — both use `LegalLayout.astro` (noindex). Address: Aufgendsweg 3, 4455 Zunzgen. UID: CHE-476.809.964.

---

## Tracking (GTM + GA4 + Consent Mode v2)

Consent defaults run before GTM in `Layout.astro`:

- EEA + UK + CH: all denied, `wait_for_update: 500`
- All other regions: all granted

GTM container ID: `PUBLIC_GTM_ID`. Not loaded if empty. GTM tags to configure:

1. **GA4 Configuration** — trigger: Consent Initialization - All Pages
2. **GA4 Event: generate_lead** — trigger: Custom Event `form_submit_success`
3. **Google Ads Conversion** — trigger: Custom Event `form_submit_success` (needs Conversion ID + Label)

⚠️ Do NOT use "Google tag found on your website" in Google Ads campaign setup — fails with permission denied (tag belongs to GA4 property, not Ads account). Create a new Conversion Action manually.

Verify events: GA4 → Admin → DebugView. GTM Preview shows tags "Fired" even with consent denied — always test with cookie banner accepted.

---

## Form backend (`functions/contact.ts`)

POST `/contact`. Flow: honeypot check → Turnstile verify → Resend API → 200/500.
Email subject: `[{_source}] Neue Anfrage von {name}`. Reply-to set to submitter's email. `message` optional.

---

## Business details

- **Legal name:** ictira GmbH
- **Address:** Aufgendsweg 3, 4455 Zunzgen, Schweiz
- **UID/MWST:** CHE-476.809.964
- **Email:** hallo@ictira.com
- **Phone:** TBD — hidden in Contact left column

---

## TODO

1. **Portfolio** — unhide `Portfolio.astro` in `index.astro` + restore nav link when screenshots ready (6 planned: Metzgerei Brunner, Atelier Widmer, Praxis Dr. Meier, Flux Coffee Roasters, Alpin Consulting AG, Verein KunstRaum)
2. **Company phone** — uncomment Telefon block in `Contact.astro` left column
3. **Resend domain** — verify sending domain in Resend dashboard
4. **Google Ads conversion tag** — create in Google Ads (Goals → Conversions → New → Website) → get Conversion ID + Label → add "Google Ads Conversion Tracking" tag in GTM triggered by `form_submit_success`
5. **Logo SVG** — convert wordmark text to paths in `logo.svg` for print/Figma
6. **LP referenzen** — replace commented-out section with real screenshots
