# Frontend Design — Green & Sustainability Theme

Apply production-ready UI updates to `apex-asset-website/` using the sustainability-focused design language defined below. This skill governs all visual decisions: colour, typography, spacing, component style, and motion.

---

## Design Philosophy

This is a **sustainable asset management** firm. Every visual choice must signal:

- Environmental stewardship and ESG commitment
- Trust, stability, and long-term thinking
- Clean, purposeful minimalism — no decorative excess
- Transparency and clarity (what you see is what you get)

Avoid: dark/heavy navy-corporate palettes, aggressive gold accents, cluttered layouts, or anything that reads as "old finance."

---

## Colour System

Update CSS custom properties in `apex-asset-website/styles.css` under `:root` to these values.

```css
/* Brand palette — sustainability */
--primary:       #1B4332;   /* deep forest green — authority, stability */
--primary-light: #2D6A4F;   /* mid canopy green — hover states, accents */
--primary-pale:  #D8F3DC;   /* soft sage wash — section backgrounds */
--accent:        #52B788;   /* fresh leaf green — CTAs, highlights */
--accent-warm:   #95D5B2;   /* light mint — secondary accents, tags */

/* Earth tones */
--earth-brown:   #6B4226;   /* rich soil — sparingly, for warmth */
--earth-sand:    #F4ECD8;   /* warm parchment — alt section backgrounds */
--earth-stone:   #8D9B88;   /* weathered stone — muted supporting text */

/* Neutrals */
--white:         #FAFAF8;   /* off-white — primary background */
--surface:       #F0F4F1;   /* light green-grey — card/panel backgrounds */
--border:        #C8DDD0;   /* subtle green-tinted border */
--text-primary:  #1A2E22;   /* near-black with green undertone */
--text-secondary:#4A6358;   /* muted green-grey body text */
--text-muted:    #8D9B88;   /* captions, labels */

/* Semantic */
--success:       #40916C;
--warning:       #D4A017;   /* amber — for contrast, alerts only */
--error:         #C0392B;

/* Legacy aliases — keep these so existing references don't break */
--navy:          var(--primary);
--gold:          var(--accent);
```

### Colour rules

- **Primary backgrounds**: `--white` or `--surface` — never pure `#fff` or `#000`
- **Section alternation**: alternate `--white` and `--primary-pale` (or `--earth-sand`) between sections
- **CTAs / buttons**: `--accent` background, `--white` text; hover → `--primary-light`
- **Headings**: `--primary` or `--text-primary`
- **Body text**: `--text-secondary`
- **Never** use `--earth-brown` or `--warning` as a primary colour — only for small accents or alerts

---

## Typography

```css
--serif:  'Playfair Display', Georgia, serif;   /* headings — gravitas */
--sans:   'DM Sans', system-ui, sans-serif;     /* body, UI — clean, modern */
--mono:   'JetBrains Mono', monospace;          /* data, stats */
```

Load from Google Fonts in `<head>` of `index.html` if not already present:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
```

### Type scale (use `clamp()` for fluid sizing)

| Token          | Value                          | Use |
|----------------|-------------------------------|-----|
| `--text-xs`    | `clamp(0.75rem, 1.5vw, 0.875rem)` | Labels, captions |
| `--text-sm`    | `clamp(0.875rem, 1.8vw, 1rem)`    | Secondary body |
| `--text-base`  | `clamp(1rem, 2vw, 1.125rem)`      | Primary body |
| `--text-lg`    | `clamp(1.125rem, 2.5vw, 1.375rem)` | Lead paragraphs |
| `--text-xl`    | `clamp(1.375rem, 3vw, 1.75rem)`   | Section sub-heads |
| `--text-2xl`   | `clamp(1.75rem, 4vw, 2.5rem)`     | Section headings |
| `--text-3xl`   | `clamp(2.25rem, 5vw, 3.5rem)`     | Hero headline |
| `--text-4xl`   | `clamp(2.75rem, 6vw, 4.5rem)`     | Stat counters |

---

## Spacing & Layout

```css
--space-1:  0.25rem;
--space-2:  0.5rem;
--space-3:  0.75rem;
--space-4:  1rem;
--space-6:  1.5rem;
--space-8:  2rem;
--space-12: 3rem;
--space-16: 4rem;
--space-24: 6rem;

--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  16px;
--radius-xl:  24px;
--radius-full: 9999px;

--container:  1200px;
--section-py: clamp(4rem, 8vw, 7rem);   /* vertical section padding */
```

---

## Shadows & Depth

Use low-saturation green-tinted shadows — avoid pure grey or black.

```css
--shadow-sm:  0 1px 3px rgba(27, 67, 50, 0.08);
--shadow-md:  0 4px 12px rgba(27, 67, 50, 0.12);
--shadow-lg:  0 8px 28px rgba(27, 67, 50, 0.16);
--shadow-card: 0 2px 8px rgba(27, 67, 50, 0.10);
```

---

## Component Patterns

### Buttons

```css
.btn-primary {
  background: var(--accent);
  color: var(--white);
  border: none;
  border-radius: var(--radius-full);
  padding: 0.75rem 2rem;
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: var(--radius-full);
  padding: 0.7rem 1.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-outline:hover {
  background: var(--primary);
  color: var(--white);
}
```

### Cards

```css
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}
```

### Section dividers

Use a subtle leaf/wave SVG or a simple `--border` 1px rule between sections. Never hard horizontal rules (`<hr>`) with the default browser style.

### ESG / stat badges

Pill-style tags for ESG ratings, SDG goals, and fund categories:

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--primary-pale);
  color: var(--primary);
  border-radius: var(--radius-full);
  padding: 0.25rem 0.75rem;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

---

## Sustainability Motifs

Use these visual cues consistently — do not combine them all at once; pick the appropriate one per context.

| Motif | Where to use |
|-------|-------------|
| Leaf / sprout icon | Hero section, CTA buttons, feature list bullets |
| Concentric circle / ripple | Background hero pattern (CSS radial-gradient, low opacity) |
| Organic curves (border-radius 30–50%) | Card shapes, blob section dividers |
| Line-art globe | ESG/impact section header illustration |
| Thin horizontal rule in `--accent` | Under `<h2>` headings (pseudo-element `::after`) |

**Hero background pattern (CSS only, no images needed):**

```css
.hero {
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, rgba(82, 183, 136, 0.12) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(45, 106, 79, 0.10) 0%, transparent 60%),
    var(--primary);
}
```

---

## Navbar

- Background: `var(--white)` with `backdrop-filter: blur(12px)` when `.scrolled`
- Border-bottom: `1px solid var(--border)` when `.scrolled`
- Logo mark: forest green `--primary`
- Nav links: `--text-primary`; hover → `--accent`; active → `--primary` with `::after` underline in `--accent`
- CTA button in nav: `btn-primary` style

---

## Hero Section

- Background: dark forest green (`--primary`) with the radial gradient pattern above
- Headline: `var(--serif)`, `var(--text-3xl)` or `--text-4xl`, `var(--white)`
- Sub-headline: `var(--sans)`, `var(--text-lg)`, `rgba(255,255,255,0.75)`
- Stat counters: `var(--mono)` or `var(--serif)`, `var(--accent-warm)` or `var(--white)`
- CTA: `btn-primary` on green background → use `--white` background button with `--primary` text for contrast

---

## Steps to apply this skill

When invoked, do the following in order:

1. **Read** `apex-asset-website/styles.css` and `apex-asset-website/index.html` to understand current state.
2. **Update `:root` tokens** in `styles.css` with the colour system above.
3. **Update Google Fonts `<link>`** in `index.html` to load DM Sans + Playfair Display.
4. **Audit each section** of `index.html` for class names that map to old colour references (e.g. hard-coded `#1a3c5e`, `#c9a84c`) and replace with custom property references.
5. **Apply component patterns** (buttons, cards, badges, hero background) to the relevant CSS rules.
6. **Check contrast** — all text on green backgrounds must meet WCAG AA (4.5:1 for body, 3:1 for large text). `--white` on `--primary` passes; `--text-secondary` on `--white` passes.
7. **Verify** the page renders correctly by noting any broken layout or colour mismatches to fix.

Report what changed, what colour tokens were updated, and any WCAG contrast flags.
