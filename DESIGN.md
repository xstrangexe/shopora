---
name: SHOPORA
description: Black, cream and champagne-gold storefront for cash-on-delivery shopping in Algeria
colors:
  cream: "#f6eee6"
  cream-dim: "#efe4d8"
  paper: "#fffaf5"
  sand: "#ede2d5"
  sand-deep: "#e3d5c4"
  ink: "#111111"
  ink-muted: "#5e554b"
  hairline: "#e3d6c6"
  hairline-strong: "#c9b79f"
  champagne-gold: "#c9a96e"
  antique-gold: "#7a5c28"
  antique-gold-deep: "#634a1f"
  graphite: "#3d3d3d"
  positive: "#166534"
  error: "#dc2626"
typography:
  display:
    fontFamily: "Fraunces Variable, Cairo Variable, serif"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Outfit Variable, Cairo Variable, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  body-arabic:
    fontFamily: "Outfit Variable, Cairo Variable, sans-serif"
    fontSize: "17px"
    lineHeight: 1.75
  label:
    fontFamily: "Outfit Variable, Cairo Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1
  mono:
    fontFamily: "IBM Plex Mono, Cairo Variable, ui-monospace, monospace"
rounded:
  xs: "4px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "11px 22px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "11px 22px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  product-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
    height: "44px"
---

# Design System: SHOPORA

<!-- Source of truth: src/styles.css. If this file and styles.css disagree, styles.css wins.
     docs/DESIGN_SYSTEM.html still shows the upstream OpenStore orange palette and is stale. -->

## Overview

**Creative North Star: "The Gilded Counter"**

A quiet boutique counter: warm cream paper, black ink and a thin line of champagne gold. The
product photo is the loudest thing on the page. The interface is calm, legible and confident
so that a cautious first-time buyer trusts it enough to leave a phone number.

Arabic and RTL come first. Layout uses logical properties (`padding-inline`, `inset-inline`),
so one set of rules serves both directions, and prices and identifiers stay LTR inside RTL text.
Light is the canonical theme and it is enforced; dark mode exists but is never automatic.

**Key Characteristics:**

- Black-on-cream primary actions, with gold kept for accents and marks.
- Pill-shaped controls and softly rounded cards.
- Warm brown-tinted shadows, never neutral grey.
- Motion is short and springy (`--ease-back`) on cards and chips, and soft on everything else.

## Colors

Warm neutrals with one metallic accent.

### Primary

- **Ink Black** (`ink`): primary buttons, headings and body text. The brand's main voice.

### Secondary

- **Champagne Gold** (`champagne-gold`): accents, marks, focus glows and dark-theme primary. Never body text on cream (about 2:1).
- **Antique Gold** (`antique-gold`): gold-toned _text_, table headers and emphasis on cream (5.4:1, passes AA).

### Neutral

- **Cream** (`cream`): the page background.
- **Paper** (`paper`): cards, inputs and the mobile nav surface.
- **Sand / Sand Deep** (`sand`, `sand-deep`): raised and highest surfaces.
- **Ink Muted** (`ink-muted`): secondary text and unselected chips.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): borders and dividers.

### Named Rules

**The Gold Is Jewellery Rule.** Pure champagne gold decorates and never carries text on cream. When text must look gold, use Antique Gold.

**The One Black Button Rule.** One solid ink primary button per screen. Everything else is secondary, ghost or a chip.

## Typography

**Display Font:** Fraunces Variable (with Cairo Variable for Arabic)
**Body Font:** Outfit Variable (with Cairo Variable)
**Mono:** IBM Plex Mono for prices and identifiers

**Character:** A soft, high-contrast serif for headlines over a clean geometric sans. Cairo is in every stack so Arabic never falls back to the OS face.

### Hierarchy

- **Display** (600, h1 about 2.25rem, 1.15): product names and page titles.
- **Body** (400, 15px, 1.5 Latin; 17px, 1.75 Arabic): descriptions and form copy.
- **Label** (600, 14px, 1): buttons and controls.
- **Mono**: prices such as `7 500,00 DZD`, always LTR.

### Named Rules

**The Arabic Density Rule.** Arabic text gets 17px / 1.75. This is about legibility, so never remove it.

## Layout

The content column is 1100px max (`--content-max`), with spacing in steps of 4/8/16/24/40/64px. Breakpoints are 640px, 768px and 1024px. Below 1024px a fixed bottom nav appears (safe-area aware) and product pages use a sticky order bar. Nothing may overflow horizontally at 320px.

## Elevation & Depth

Mostly flat with tonal layering (cream → paper → sand). Shadows appear in response to state, such as hover lift on cards and buttons, and are tinted warm brown.

### Shadow Vocabulary

- **sm** (`0 1px 3px rgba(40, 28, 10, 0.08)`): resting chips and small controls.
- **md** (`0 6px 16px rgba(40, 28, 10, 0.1)`): hover on buttons and product cards.
- **lg** (`0 16px 40px rgba(40, 28, 10, 0.14)`): drawers, dialogs and overlays.

## Shapes

Every button and chip is a full pill (9999px). Cards are 24px, inputs 10px, and small badges 4px. Borders are 1px hairlines, or 1.5px on inputs.

## Components

### Buttons

- **Shape:** full pill.
- **Primary:** ink background, cream label, 11px 22px padding. On hover it lifts 2px with shadow md and 0.92 opacity.
- **Primary inside the black order card:** the same pill inverted, a cream background with an ink label and no glow, so it reads as the same action as the sticky bar.
- **Secondary:** transparent with a 2px ink border. On hover it gets a faint gold glow and lifts 2px. Product-card "order now" buttons use it, so the product page keeps one solid primary.
- **Ghost / Danger:** lower emphasis. Danger is never the default focus.

### Chips

- **Style:** pill with a hairline border, muted text and 8px 16px padding. A `.filled` state is used for selected variants (size, colour, phone model).

### Cards / Containers

- **Product card:** paper background, hairline border, 24px radius, full-bleed media and a small text block. On hover it lifts 4px with shadow md using the springy ease.

### Inputs / Fields

- **Style:** 44px tall, 10px radius, 1.5px hairline border, paper background.
- **Focus:** ink border plus a 4px faint-gold ring.
- **Error:** red border via `aria-invalid`, with a Darija message underneath.

### Navigation

- **Bottom nav (mobile, under 1024px):** fixed and paper-coloured, with a hairline top border and safe-area padding.

### Express Order Form (signature)

The product page's checkout: name, phone, wilaya, commune, home or office, optional address and quantity. One black submit button that is disabled while saving.

## Do's and Don'ts

### Do:

- **Do** use the CSS custom properties from `src/styles.css` (`var(--primary)`, `var(--r-lg)`), never hard-coded hex.
- **Do** use logical properties so RTL and LTR both work.
- **Do** keep tap targets at least 32px, and 44px for primary controls.
- **Do** collapse every animation under `prefers-reduced-motion`.

### Don't:

- **Don't** set body text in pure champagne gold on cream.
- **Don't** reintroduce the upstream burnt-orange palette (#c2410c), which is gone.
- **Don't** let the shop open in dark mode automatically.
- **Don't** add a second solid primary button to a screen.
