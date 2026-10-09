---
name: Obsidian Slate
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3132'
  primary-container: '#e2e2e3'
  on-primary-container: '#636466'
  inverse-primary: '#5d5e60'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#352f2d'
  tertiary-container: '#ebe0dc'
  on-tertiary-container: '#6a6360'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e3'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1d'
  on-primary-fixed-variant: '#454748'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#ebe0dc'
  tertiary-fixed-dim: '#cec4c1'
  on-tertiary-fixed: '#1f1b18'
  on-tertiary-fixed-variant: '#4c4543'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  mono-metric:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an ultra-refined, high-precision dark aesthetic tailored for professional finance, private wealth management, and modern fintech platforms. The brand voice is understated, authoritative, and surgically precise. It strips away ornamental distractions, chromatic noise, and synthetic glows to champion raw clarity, data integrity, and high-velocity focus.

The visual style is rooted in a disciplined fusion of **Minimalism** and **Tonal Layering**. Matte charcoal surfaces establish structural hierarchy through luminance rather than chromatic shift. The emotional impact is focused, premium, and calm—evoking the tactile weight of bead-blasted titanium and micro-etched slate. Contrast is deployed purposefully: crisp, optical-white glyphs deliver uncompromised legibility against deep, non-reflective dark foundations.

## Colors

The color palette is rigorously monochromatic, engineered to optimize legibility and reduce visual fatigue across dense data sets.

### Surface Tiers

- **Canvas / Base Canvas:** `#121214` — Deep matte background, grounded and non-reflective.
- **Surface Level 1 (Default Card / Row):** `#1a1a1e` — Primary container surface.
- **Surface Level 2 (Elevated / Active Container):** `#24252a` — Hover states, modal dialogs, and floating utility bars.

### Content & Typography

- **Primary Text:** `#ffffff` — Headers, critical metrics, active balances.
- **Secondary Text:** `#f4f4f5` — High-contrast body, primary navigation items.
- **Muted Subtitles / Metadata:** `#a1a1aa` — Timestamps, descriptions, supporting labels.
- **Tertiary / Disabled / Placeholders:** `#71717a` — Inactive controls, table headers, column labels.

### Structural Contours & Borders

- **Subtle Hairline:** `#27272a` — Structural card dividers, data grid rows, static frame outlines.
- **Interactive Hairline:** `#3f3f46` — Focus states, input active strokes, hover outlines.

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for prominent numeric values, account summaries, and display titles with **Inter** for dense transactional tables, body copy, and UI metadata.

Numeric metrics, currency indicators, and percentage changes should always activate tabular lining figures (`font-variant-numeric: tabular-nums;`) within **Inter** to ensure micro-aligned data columns across financial ledgers and ticker lists. Restraint is central: avoid extreme weights; use medium (`500`) and semi-bold (`600`) weights to convey visual priority without crowding interfaces.

## Layout & Spacing

Layouts follow a structured fluid grid system calibrated for high information density:

- **Mobile (<768px):** 4-column layout with a fixed `1rem` outer canvas margin and `1rem` column gutters. Components stack into single-column modules.
- **Tablet (768px - 1023px):** 8-column layout with `1.5rem` outer margins and `1rem` column gutters. Secondary sidebars collapse into overlay rails or bottom sheets.
- **Desktop (>=1024px):** 12-column fluid grid capped at a maximum container width of `1440px`. Outermost margins expand to `2.5rem` with `1.5rem` column gutters.

The spacing rhythm adheres to an explicit 4px/8px incremental cadence. Vertical rhythm in data-dense sections (e.g., account transaction histories, order books) relies on tight `space-xs` and `space-sm` metrics, while major layout divisions maintain breathing room using `space-lg` and `space-xl`.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Low-contrast outlines**, eschewing heavy drop shadows and colorful glow effects in favor of flat architectural discipline.

1. **Base Ground (Level 0):** Pure `#121214`.
2. **Container Panels (Level 1):** `#1a1a1e` framed with a subtle 1px border (`#27272a`).
3. **Interactive & Hover Layers (Level 2):** `#24252a` bounded by an elevated outline (`#3f3f46`).
4. **Modals, Drawers & Popovers (Level 3):** Grounded on `#24252a` with an ambient dark falloff: `0 16px 32px -8px rgba(0, 0, 0, 0.75)`, paired with an enclosing `1px solid #3f3f46` hairline rim.

Layer shifts rely on instant or short 150ms ease-out transitions between surface hexes, creating an impression of tactile precision akin to an instrument panel.

## Shapes

The shape system employs an intentionally compact, geometric radius scale (`Soft / 1`).

- Default elements (buttons, inputs, select fields, pill tags): `0.25rem` (4px).
- Intermediate cards, modular containers, chart viewports: `0.5rem` (8px).
- Large dialogs, slide-overs, and primary modal wrappers: `0.75rem` (12px).

Rounded corners should never drift into pill or playful silhouettes. The architecture demands clean, precise edges that convey stability and structure.

## Components

### Buttons

- **Primary:** Background `#f4f4f5`, text `#121214`, font-weight 500, height 36px (desktop) or 40px (touch), border-radius `0.25rem`. Hover shifts to `#ffffff`.
- **Secondary / Outline:** Background transparent, text `#f4f4f5`, border `1px solid #27272a`. Hover state transitions background to `#1a1a1e` with border `#3f3f46`.
- **Ghost / Tertiary:** Background transparent, text `#a1a1aa`. Hover shifts text to `#ffffff` and background to `#1a1a1e`.

### Input Fields

- Container height 36px, background `#121214`, border `1px solid #27272a`, text `#ffffff`, placeholder `#71717a`.
- Focus state activates an outline of `1px solid #3f3f46` with zero outer glow.
- Inline unit badges (e.g., "USD", "EUR") sit right-aligned in `#71717a` using `body-sm`.

### Cards & Modular Containers

- Background `#1a1a1e`, border `1px solid #27272a`, border-radius `0.5rem`, padding `1.25rem`.
- Section headers within cards utilize `title` styling with an optional bottom hairline divider in `#27272a`.

### Financial Data Tables & Lists

- Table header row uses `#121214` with `#71717a` text in `label-sm` uppercase.
- Transaction rows sit on transparent backgrounds with a `1px solid #27272a` bottom border.
- Hover states transition row backgrounds smoothly to `#1a1a1e`.
- Numerical entries render via `mono-metric` with tabular numbers enabled.

### Chips & Filter Tags

- Background `#1a1a1e`, border `1px solid #27272a`, radius `0.25rem`, padding `0.25rem 0.5rem`, typography `label-sm`.
- Active state transitions background to `#24252a`, border to `#3f3f46`, and text to `#ffffff`.

### Checkboxes & Radios

- Size 16px by 16px, background `#121214`, border `1px solid #3f3f46`, radius `2px` (checkbox) or circular (radio).
- Selected state fills with `#f4f4f5` and renders a crisp `#121214` indicator.
