# ictira GmbH — Website

## Project overview
Marketing site for **ictira GmbH**, a fixed-price web design agency based in Nordwestschweiz (Zunzgen BL), targeting Swiss German SMEs. Positioning: bold, direct, honest — no hidden costs, no agency overhead. Copy is German, Du-Form.

**Stack:** Astro 6 (static, no SSR), TypeScript, scoped CSS per component. No frameworks/libraries beyond Astro.

**Commands:**
```
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
```

---

## File structure
```
src/
  layouts/
    Layout.astro        # base HTML shell (fonts, meta, IntersectionObserver)
    LegalLayout.astro   # legal pages: nav + back link + footer, noindex
  pages/
    index.astro         # single-page site, all sections
    impressum.astro
    datenschutz.astro
  components/
    Nav.astro           # sticky nav, scrolled state, mobile hamburger
    Hero.astro          # dark card, animated orbs, two marquee strips
    Services.astro      # 6-card 3-col grid
    Pricing.astro       # 3 packages, middle card popular/scaled
    Process.astro       # blue card, 5-step horizontal grid
    Portfolio.astro     # HIDDEN — 3-col project grid, waiting for real screenshots
    Faq.astro           # accordion, single-open
    Contact.astro       # dark card, left details + right form
    Footer.astro        # logo + nav + legal utils
  styles/
    global.css          # reset, design tokens, .section-inner, .reveal, .grid-3
public/
  favicon.svg           # logomark (blue outer circle + red inner circle)
  logo-mark.svg         # same mark, standalone asset
  logo.svg              # mark + wordmark as SVG text (for external use)
```

---

## Design tokens
```css
--bg:      #ECEAE4   /* warm off-white canvas */
--paper:   #F4F2EC   /* slightly lighter, card backgrounds */
--ink:     #0E0F12   /* near-black, text + dark cards */
--mute:    #6A6D73   /* secondary text */
--line:    rgba(14,15,18,0.12)
--accent:  #3A2BFF   /* electric indigo — CTAs, highlights */
--hot:     #FF4D2E   /* orange-red — decorative */
--success: #8DFE4C   /* green, success state */
--yellow:  #FEF08A   /* process section heading accent */
--font:    'Inter Tight'
--mono:    'JetBrains Mono'
```

**Max content width:** 1360px via `.section-inner`
**Section padding:** `96px 32px` (→ `16px` horizontal on mobile ≤480px)
**Card border-radius:** 28px (services), 32px (pricing), 48px (hero/process/contact), 24px (FAQ)

---

## Scroll reveal
`.reveal` elements fade in + slide up 40px via IntersectionObserver (threshold 0.12), wired in `Layout.astro`. Stagger via `data-delay="60|80|100|120|160|180|200|240|300"` (ms).

---

## Components

### Nav
- Fixed top, z-index 100, height 68px
- Adds `.scrolled` class (translucent bg + blur) at scroll > 20px
- Logo: `<img src="/logo-mark.svg">` + wordmark span
- Center pill: dark bg, nav links in off-white
- CTA: accent blue, green dot `#8DFE4C`, copy "3 Plätze frei · Q2/26"
- Mobile: hamburger shows/hides `.mobile-menu`

### Hero
- Dark card (ink bg), animated blue orb + red blob (CSS keyframes)
- Headline: clamp(80px,14vw,210px), weight 900, letter-spacing -0.06em; "fertig." = italic gradient text (accent→hot)
- Marquee 1 (−2deg, blue): prices — CHF 990 · 1490 · 2990
- Marquee 2 (+1.2deg, dark): city names reversed direction
- JS: `requestAnimationFrame` loop, 0.8px/frame and 0.45px/frame

### Services (`#leistungen`)
- 6 cards, 3-col grid: Strategie, Design, Entwicklung, Content, SEO, Betrieb
- Colors per card: ink/paper, accent/white, paper/ink(border), hot/white, paper/ink(border), ink/paper

### Pricing (`#preise`)
- **CHF 990** Onepager (7 Tage), **CHF 1490** Standard (14 Tage), **CHF 2990** Grösser (3–4 Wochen)
- Middle card (Standard) is popular: dark bg, scale(1.04), accent CTA, blue glow shadow
- Footnote: Domain CHF 19.90/yr, Hosting CHF 9.90/mo, 50/50 payment split

### Process (`#prozess`)
- Accent blue card, red decorative circle top-right
- 5 steps: Gespräch → Angebot → Design → Build → Launch
- Horizontal connector line between step circles

### Portfolio (`#arbeiten`) — **HIDDEN**
- Commented out in `index.astro`, "Arbeiten" removed from nav links
- Waiting for real project screenshots
- 6 planned projects: Metzgerei Brunner, Atelier Widmer, Praxis Dr. Meier, Flux Coffee Roasters, Alpin Consulting AG, Verein KunstRaum

### FAQ (`#faq`)
- 6 items, first open by default, single-open accordion
- Click anywhere on item row to toggle

### Contact (`#kontakt`)
- Left: email (hallo@ictira.com), address (Aufgendsweg 3, 4455 Zunzgen) — **phone hidden**, waiting for number
- Right: form with name/email/firm/package-radios/message
- Form is client-side only — **not yet wired to backend**
- Success state on submit (currently just hides form, shows ✓ message)

### Footer
- Logo mark img + "ictira" wordmark
- Nav links + Impressum / Datenschutz utils
- Copyright: "© ictira GmbH · 2026 · Nordwestschweiz"

### Legal pages
Use `LegalLayout.astro` (noindex). Both pages have real company data filled in.
- `/impressum` — address, CHE-476.809.964, haftungsausschluss, urheberrecht
- `/datenschutz` — DSG/DSGVO, no tracking cookies, contact rights

---

## Business details
- **Legal name:** ictira GmbH
- **Address:** Aufgendsweg 3, 4455 Zunzgen, Schweiz
- **UID/MWST:** CHE-476.809.964
- **Email:** hallo@ictira.com
- **Phone:** TBD (waiting for number — hidden in contact section)

---

## Logo assets
- `public/favicon.svg` + `public/logo-mark.svg` — identical: 100×100 viewBox, outer circle #3A2BFF, inner circle r=25 (25% of 50) #FF4D2E
- `public/logo.svg` — mark + "ictira" wordmark as SVG text; renders correctly in browser (Inter Tight loaded), falls back to system-ui elsewhere; needs text-to-paths for print/Figma use

---

## TODO
1. **Contact form backend** — wire to Netlify Forms or Formspree; no backend needed
2. **Portfolio section** — unhide when real project screenshots are available (6 projects listed above)
3. **Phone number** — unhide Telefon block in `Contact.astro` once number is active
4. **Deploy** — Netlify or Infomaniak (CH-DSG compliant); configure domain
5. **Logo SVG paths** — convert wordmark text to paths in `logo.svg` for print/external use
