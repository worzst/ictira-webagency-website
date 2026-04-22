# Handoff: ictira GmbH — Website (Direction B · Kinetic)

## Overview
A marketing website for **ictira GmbH**, a fixed-price web design agency based in Basel (Nordwestschweiz), targeting Swiss German SMEs. The site sells three fixed-price packages (CHF 790 / 1490 / 2990) and positions the agency as bold, direct, and honest — no hidden costs, no agency overhead.

Copy language: **German, Du-Form** (informal but professional).

## About the Design Files
`ictira-kinetic.html` is a **high-fidelity design reference** built in HTML/React. It shows the exact intended look, copy, interactions, and motion. The task for Claude Code is to **recreate this design** inside your real codebase using your chosen framework (Astro, Next.js, Nuxt, etc.) and its established patterns — do not ship the HTML prototype directly.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are all final. Recreate pixel-precisely. The only placeholder elements are:
- Portfolio thumbnail images (currently CSS gradient patterns — replace with real screenshots)
- Contact details (phone / address are dummy values)
- Company registration number (CHE-123.456.789 MWST)

---

## Pages / Sections
This is a **single-page site** with anchor navigation. All sections live on one page.

### 1. Nav (sticky)
- Fixed top, `z-index: 100`, height 68px, horizontal padding 32px
- On scroll > 20px: background becomes `#ECEAE4EE` with `backdrop-filter: blur(10px)` and bottom border `rgba(14,15,18,0.12)`
- **Logo**: 32×32 circle (accent `#3A2BFF`) with inner 16×16 circle (hot `#FF4D2E`), wordmark `ictira®` 800 weight 22px letterspacing -0.04em
- **Center nav pill**: `background: #0E0F12`, border-radius 999, links in off-white 13px 500 weight
- **CTA button**: `background: #3A2BFF`, white text, border-radius 999, green dot `#8DFE4C` + copy "3 Plätze frei · Q2/26"

### 2. Hero
- Top padding 96px, left/right 32px
- **Main card**: `background: #0E0F12`, `color: #F4F2EC`, border-radius 48, padding 72px 56px 64px, `overflow: hidden`
- **Animated orb**: 380×380 circle, radial gradient from `#3A2BFF` to `#0a0780`, positioned top-right, slowly oscillates with `Math.sin(t)` — use a CSS keyframe animation approximation
- **Secondary blob**: 110×110 circle `#FF4D2E`, moves vertically with slower sine
- **Headline**: `clamp(80px, 14vw, 210px)`, weight 900, letterspacing -0.06em, lineheight 0.87. Last word "fertig." is italic, gradient text `linear-gradient(100deg, #3A2BFF, #FF4D2E)` via `background-clip: text`
- **Body copy**: `clamp(17px,1.5vw,24px)`, weight 500, max-width 600px
- **CTA buttons**: pill shape, white bg/dark text + ghost outline
- **Marquee strip 1** (below card, rotated -2deg): background `#3A2BFF`, white, font `clamp(22px,2.5vw,36px)` 700; content "CHF 790 · Onepager ✦ CHF 1490 · Bis 5 Seiten ✦ CHF 2990 · Grössere Sites ✦ Fixpreis, garantiert ✦"
- **Marquee strip 2** (below strip 1, rotated +1.2deg): background `#0E0F12`, white, monospace 20px uppercase, city names moving in reverse direction

### 3. Services (`#leistungen`)
- Padding 96px 32px
- Heading: `clamp(56px,7vw,96px)` 700 "Full-Stack Webdesign."
- **6 cards in a 3-column grid**, gap 20px, border-radius 28, min-height 280px
- Card color scheme (in order): dark/light-text, accent/white, paper/dark (with border), hot/white, paper/dark (with border), dark/light-text
- Hover: `translateY(-4px)` transition 0.25s
- Each card shows: index `01 / 06` in mono top, service name 36px 700, description 15px 1.5 line-height

### 4. Pricing (`#preise`)
- Centered heading `clamp(64px,9vw,128px)` 800 "Drei Pakete. *Null Bullshit.*" (italic word in accent `#3A2BFF`)
- **3 cards in a 3-column grid**, gap 20px; middle card (Standard) is `scale(1.04)`, background `#0E0F12`, box-shadow `0 30px 80px rgba(58,43,255,0.2)`
- Popular badge: small pill rotated -3deg, background `#FF4D2E`, "Most Popular"
- Price display: "CHF" small + giant `96px` 800 weight number + ".–" small
- Checklist items: 18px circle checkmark (accent bg for popular, ink bg otherwise)
- CTA: full-width pill, accent bg for popular card, ink bg for others

### 5. Process (`#prozess`)
- **Full-width colored block**: background `#3A2BFF`, border-radius 48, padding 72px 56px, `overflow: hidden`
- Decorative circle top-right: 320×320, `#FF4D2E`
- Heading: `clamp(52px,7vw,100px)` 800, "wenigen Wochen." in italic `#FEF08A` (yellow)
- **5-column step grid**: horizontal connector line (2px, 30% opacity white), each step has 30×30 white circle with accent-colored step number, then title 26px 700, then description 14px

### 6. Portfolio (`#arbeiten`)
- Heading: `clamp(56px,7vw,96px)` 700 "Frisch gelauncht."
- **3-column grid**, gap 20px
- Each card: 280px tall thumbnail (CSS gradient placeholder, replace with real images), border-radius 20, name 22px 600, category 13px muted, year monospace
- Thumbnail hover: `scale(1.05)` transition 0.6s cubic-bezier(.2,.8,.2,1)

### 7. FAQ (`#faq`)
- Max-width 1040px centered
- Accordion items: padding 24px 28px, border-radius 24; closed = `#F4F2EC` background; open = `#0E0F12` background white text
- Toggle button: 36×36 circle, rotates 45deg when open (becomes ✕)
- Answer: max-height transition from 0 → 200px

### 8. Contact (`#kontakt`)
- **Dark card**: same dark card pattern as Hero, background `#0E0F12`, border-radius 48, padding 72px 56px
- Blue glow blob bottom-left: 380×380, `#3A2BFF`, 20% opacity, blur 50px
- Left: giant heading "Starten wir was *Cooles?*" (italic "Cooles?" in accent), contact details in monospace
- Right: form with pill inputs (1.5px border, semi-transparent white bg), radio pill options for package, textarea, submit button in accent color
- On success: show success state with green checkmark circle and thank-you message

### 9. Footer
- Two-row layout: top row = logo + nav links; bottom row = imprint text + utility links
- Border top, padding 48px 32px, font-size 12px monospace uppercase

---

## Interactions & Behavior

### Scroll animations
All major headings and cards use an `IntersectionObserver` to trigger a fade + translateY(40px → 0) reveal on scroll. Use `threshold: 0.12`. Delay variants: 0ms, 60ms, 80ms, 100ms, 200ms per stagger.

### Marquee
Two continuous horizontal marquees below the hero. Implement with CSS `@keyframes` or JS `requestAnimationFrame`. Speed: strip 1 ~0.8px/frame, strip 2 ~0.45px/frame reversed. Strips are slightly rotated (±2deg).

### Animated hero orbs
Gentle sine-wave position oscillation on two circles. Can be approximated with `@keyframes` using `transform: translate`. Period ~6s for orb 1, ~5s for blob 2.

### Nav
Sticky. Becomes translucent + blurred on scroll. No mobile hamburger in prototype — add one in production.

### FAQ accordion
Single open at a time. `max-height` transition for the answer panel.

### Contact form
Client-side only in prototype. In production: wire to a form backend (Netlify Forms, Formspree, or custom). Show success state on submit.

### Hover states
- Service cards: `translateY(-4px)` lift
- Portfolio thumbnails: `scale(1.05)` zoom
- Portfolio list items: color transition on name
- FAQ items: background color swap (transition 0.25s)

---

## Design Tokens

### Colors
```
--bg:        #ECEAE4   /* warm off-white canvas */
--paper:     #F4F2EC   /* slightly lighter card bg */
--ink:       #0E0F12   /* near-black text + card bg */
--mute:      #6A6D73   /* secondary text */
--line:      rgba(14,15,18,0.12)  /* dividers */
--accent:    #3A2BFF   /* electric indigo — CTAs, highlights */
--hot:       #FF4D2E   /* orange-red — decorative accents */
--success:   #8DFE4C   /* green dot, success state */
--yellow:    #FEF08A   /* process headline accent */
```

### Typography
```
Primary:  'Inter Tight' — weights 400 / 500 / 600 / 700 / 800 / 900
Mono:     'JetBrains Mono' — weights 400 / 500 / 600
Google Fonts import URL:
  https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,700;1,800&family=JetBrains+Mono:wght@400;500;600&display=swap
```

### Type scale (key sizes)
| Usage | Size | Weight | Tracking |
|---|---|---|---|
| Hero H1 | clamp(80px,14vw,210px) | 900 | -0.06em |
| Section H2 | clamp(56px,7vw,96px) | 700–800 | -0.05em |
| Pricing H2 | clamp(64px,9vw,128px) | 800 | -0.055em |
| Price number | 96px | 800 | -0.06em |
| Card title | 36px | 700 | -0.03em |
| Body | 18–24px | 400–500 | 0 |
| Small body | 14–15px | 400 | 0 |
| Mono label | 11–14px | 400–600 | 0.06–0.08em |

### Spacing
- Section padding: `96px 32px`
- Card padding: `32px 28px`
- Card border-radius: 28px (service), 32px (pricing), 48px (hero/process/contact), 24px (FAQ)
- Max content width: 1360px centered

### Shadows
- Popular pricing card: `0 30px 80px rgba(58,43,255,0.2)`
- Tweaks panel: `0 8px 40px rgba(0,0,0,0.14)`

---

## Assets
- **Fonts**: Inter Tight + JetBrains Mono via Google Fonts
- **Logo**: SVG not yet created — use the nested circles mark + wordmark from code as reference
- **Portfolio images**: 6 project screenshots needed (client: Metzgerei Brunner, Atelier Widmer, Praxis Dr. Meier, Flux Coffee Roasters, Alpin Consulting AG, Verein KunstRaum). Currently CSS gradients.
- **Icons**: none (pure CSS/text glyphs only)

---

## Recommended Stack for Production
Since ictira is a Swiss agency that recommends Astro, Webflow, and WordPress to clients, the real site should probably be built on:
- **Astro** (static, fast, easy to maintain) — recommended
- Or **Next.js** if dynamic features are needed later

For the contact form, use **Netlify Forms** or **Formspree** — no backend needed.

For hosting: **Netlify** or **Infomaniak** (Swiss hosting, CH-DSG compliant).

---

## Files in This Package
| File | Purpose |
|---|---|
| `ictira-kinetic.html` | High-fidelity design reference — all sections, full interactivity |
| `README.md` | This file |
