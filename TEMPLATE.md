# ictira Site Template — Reuse Guide

This repo is the canonical template for all ictira client websites. Every new client site is a fork of this codebase. This document explains what transfers as-is, what needs to be swapped, and the step-by-step setup checklist.

---

## What reuses without changes

| File | Notes |
|---|---|
| `functions/contact.ts` | Copy verbatim — all config is via env vars |
| `src/layouts/Layout.astro` | GTM snippet, Consent Mode v2, CookieBanner import — all env-driven |
| `src/layouts/LegalLayout.astro` | Generic structure, just update content pages |
| `src/components/CookieBanner.astro` | Only `ictira_consent` key needs renaming (see below) |
| `src/components/Nav.astro` | Structure + JS reusable; update logo, links, CTA copy. Nav link prefixing and logo scroll behaviour transfer automatically — see note below |
| `src/components/Process.astro` | Structure reusable; update step labels if needed |
| `src/components/Faq.astro` | Accordion logic reusable; swap Q&A content |
| `src/components/Footer.astro` | Structure reusable; update logo + links |
| `src/styles/global.css` | Design tokens; swap colors for client brand |
| `astro.config.mjs` | Update `site:` URL only |
| `.gitignore` | Copy as-is |
| `.node-version` | Copy as-is (pins Node 22 for Cloudflare Pages) |
| `public/robots.txt` | Update Sitemap URL to client domain |

---

## What must be replaced per client

### 1. Brand / design tokens (`src/styles/global.css`)
Swap `--accent`, `--hot`, `--success`, `--yellow` for client brand colors. Font families if different — update the Google Fonts link in `Layout.astro` too.

### 2. Logo assets (`public/`)
Replace `favicon.svg`, `favicon.ico`, `logo-mark.svg`, `logo.svg` with client logo.
Keep the same filenames or update all references in `Nav.astro`, `Footer.astro`, `Layout.astro`.

### Nav link behaviour (built-in, no changes needed)
`Nav.astro` automatically handles links correctly across all page types:
- **Logo** — always `href="/"`. On the homepage, a JS listener intercepts the click and smooth-scrolls to top instead of reloading. On subpages it navigates normally.
- **Section links + CTA** — prefix is computed from `Astro.url.pathname`: empty on `/` (smooth anchor scroll), `/` prefix on all subpages (navigates home then jumps to section).

This works for any new page added to the site without touching `Nav.astro`. Just make sure any new page is rendered via `LegalLayout.astro` (or another layout that uses `<Nav />`).

### 3. Copy + content
All German copy in components is ictira-specific. Every component's text content needs to be replaced. Key places:
- `Nav.astro` — nav link labels, CTA copy
- `Hero.astro` — headline, marquee content
- `Services.astro` — service card titles + descriptions
- `Pricing.astro` — package names, prices, feature lists
- `Process.astro` — step labels
- `Faq.astro` — questions + answers
- `Contact.astro` — left column details (email, phone, address), package radio options
- `Footer.astro` — copyright line, nav links

### 4. Legal pages (`src/pages/`)
- `impressum.astro` — client's legal name, address, UID, email, phone
- `datenschutz.astro` — update company name/address; all sections about services (Cloudflare, Resend, GTM, etc.) transfer as-is since the stack is the same

### 5. `astro.config.mjs`
```js
site: 'https://www.clientdomain.com',
```

### 6. `public/robots.txt`
```
Sitemap: https://www.clientdomain.com/sitemap-index.xml
```

### 7. CookieBanner localStorage key (`src/components/CookieBanner.astro`)
Change `ictira_consent` to `[clientslug]_consent` so consent stored on one site doesn't bleed to another if hosted on the same origin (unlikely but clean practice).

---

## Infrastructure setup checklist (per new site)

### Cloudflare Pages
- [ ] Create new Pages project, connect Git repo
- [ ] Set custom domain (`www.clientdomain.com`)
- [ ] Add Cloudflare Redirect Rule: apex → www (HTTP 301)
- [ ] Set build command: `npm run build`, output: `dist`
- [ ] Add `.node-version` file (`22`) to repo root
- [ ] Set all env vars (see table below)

### Resend
- [ ] Verify client sending domain (e.g. `clientdomain.com`) in Resend dashboard
- [ ] Decide sender address (e.g. `forms@clientdomain.com`)
- [ ] Create API key, copy to `RESEND_API_KEY`

### Cloudflare Turnstile
- [ ] Create new site in CF dashboard → Turnstile
- [ ] Copy Site Key → `PUBLIC_TURNSTILE_SITE_KEY` (build var)
- [ ] Copy Secret Key → `TURNSTILE_SECRET` (runtime var)

### Google Tag Manager
- [ ] Create new GTM container for client
- [ ] Add GA4 Configuration tag (trigger: Consent Initialization - All Pages)
- [ ] Add GA4 Event tag: `generate_lead` (trigger: Custom Event `form_submit_success`)
- [ ] If running Google Ads: add Ads Conversion tag (trigger: same `form_submit_success`)
- [ ] Publish container version
- [ ] Copy Container ID → `PUBLIC_GTM_ID` (build var)

### Environment variables summary
| Variable | Scope | Source |
|---|---|---|
| `PUBLIC_GTM_ID` | Build | GTM dashboard → container ID |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build | CF Turnstile → site key |
| `RESEND_API_KEY` | Runtime | resend.com → API keys |
| `CONTACT_TO` | Runtime | client's inbox |
| `CONTACT_FROM` | Runtime | verified Resend sender address |
| `TURNSTILE_SECRET` | Runtime | CF Turnstile → secret key |

---

## Consent Mode v2 notes
The region list in `Layout.astro` (EEA + UK + CH) defaults to denied. Non-EEA traffic defaults to granted. This is correct for most clients.

If client is EEA-only or wants global denial, adjust or remove the second `gtag('consent', 'default', ...)` call (the one without a `region` filter).

---

## Forking a new site

```bash
# Clone the template
git clone https://github.com/ictira/ictira-com-website.git clientname-website
cd clientname-website

# Remove origin, set new remote
git remote remove origin
git remote add origin https://github.com/ictira/clientname-website.git

# Install deps (unchanged)
npm install

# Start dev
npm run dev
```

Then work through the "What must be replaced" list above top-to-bottom before going live.
