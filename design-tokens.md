# Communify Design Token System
## AI-Powered Developer Community Platform

---

## 1. COLOR SYSTEM

### 1.1 Core Palette (OLED Dark)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#000000` | Main background (OLED true black) |
| `--color-bg-secondary` | `#0a0a0a` | Card backgrounds, elevated surfaces |
| `--color-bg-tertiary` | `#111111` | Hover states, nested elements |
| `--color-bg-quaternary` | `#161616` | Active states, pressed buttons |
| `--color-bg-overlay` | `rgba(0, 0, 0, 0.8)` | Modals, overlays, backdrops |

### 1.2 Border & Hairlines

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-primary` | `#1f1f1f` | Default 1px hairline borders |
| `--color-border-secondary` | `#2e2e2e` | Emphasized borders, dividers |
| `--color-border-tertiary` | `#3a3a3a` | Hover states on interactive borders |
| `--color-border-focus` | `#ffffff` | Focus rings (subtle glow) |

### 1.3 Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#ffffff` | Primary text, headings |
| `--color-text-secondary` | `#a1a1a1` | Body text, descriptions |
| `--color-text-tertiary` | `#6b6b6b` | Metadata, timestamps, captions |
| `--color-text-quaternary` | `#4a4a4a` | Placeholder text, disabled |
| `--color-text-inverse` | `#000000` | Text on white backgrounds |

### 1.4 Accent Colors (Radiant Violet)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-primary` | `#8b5cf6` | Primary CTAs, AI indicators |
| `--color-accent-secondary` | `#a78bfa` | Hover states, secondary accents |
| `--color-accent-tertiary` | `#c4b5fd` | Subtle highlights, badges |
| `--color-accent-muted` | `rgba(139, 92, 246, 0.15)` | Accent backgrounds, glows |
| `--color-accent-glow` | `rgba(139, 92, 246, 0.4)` | Shadows, focus rings |

### 1.5 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#10b981` | Success states, confirmations |
| `--color-warning` | `#f59e0b` | Warnings, pending states |
| `--color-error` | `#ef4444` | Errors, destructive actions |
| `--color-info` | `#3b82f6` | Informational, links |

### 1.6 Status Colors (Monochromatic Variants)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-status-online` | `#10b981` | Online presence |
| `--color-status-away` | `#f59e0b` | Away status |
| `--color-status-busy` | `#ef4444` | Do not disturb |
| `--color-status-offline` | `#6b6b6b` | Offline |

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Primary UI text |
| `--font-mono` | `'Geist Mono', 'SF Mono', 'Fira Code', monospace` | Code, metadata, tags |
| `--font-display` | `'Geist Sans', sans-serif` | Headings (weight variation) |

### 2.2 Font Sizes (Fluid Scale)

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` (12px) | Captions, timestamps, micro labels |
| `--text-sm` | `0.875rem` (14px) | Secondary text, metadata |
| `--text-base` | `1rem` (16px) | Body text, default |
| `--text-lg` | `1.125rem` (18px) | Emphasized body, card titles |
| `--text-xl` | `1.25rem` (20px) | Section headings |
| `--text-2xl` | `1.5rem` (24px) | Page titles |
| `--text-3xl` | `1.875rem` (30px) | Hero headings |
| `--text-4xl` | `2.25rem` (36px) | Display text |
| `--text-5xl` | `3rem` (48px) | Marketing headlines |

### 2.3 Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-light` | `300` | Large display text, elegant headings |
| `--font-regular` | `400` | Body text, default |
| `--font-medium` | `500` | Emphasized text, buttons |
| `--font-semibold` | `600` | Headings, strong emphasis |
| `--font-bold` | `700` | Hero text, critical emphasis |
| `--font-black` | `900` | Display headlines (rare) |

### 2.4 Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-none` | `1` | Headings, tight text |
| `--leading-tight` | `1.25` | Card titles, compact |
| `--leading-snug` | `1.375` | Subheadings |
| `--leading-normal` | `1.5` | Body text (default) |
| `--leading-relaxed` | `1.625` | Long-form content |
| `--leading-loose` | `2` | Spacious reading |

### 2.5 Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tighter` | `-0.04em` | Large display text |
| `--tracking-tight` | `-0.02em` | Headings |
| `--tracking-normal` | `0` | Body text |
| `--tracking-wide` | `0.025em` | Small caps, labels |
| `--tracking-wider` | `0.05em` | Metadata, mono text |
| `--tracking-widest` | `0.1em` | Badges, tags |

---

## 3. SPACING SYSTEM (4px Base)

### 3.1 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | `0` | No spacing |
| `--space-px` | `1px` | Hairline adjustments |
| `--space-0.5` | `0.125rem` (2px) | Micro adjustments |
| `--space-1` | `0.25rem` (4px) | Tightest spacing |
| `--space-2` | `0.5rem` (8px) | Icon gaps, tight padding |
| `--space-3` | `0.75rem` (12px) | Small padding, gaps |
| `--space-4` | `1rem` (16px) | Default padding |
| `--space-5` | `1.25rem` (20px) | Card padding |
| `--space-6` | `1.5rem` (24px) | Section gaps |
| `--space-8` | `2rem` (32px) | Large sections |
| `--space-10` | `2.5rem` (40px) | Major divisions |
| `--space-12` | `3rem` (48px) | Page sections |
| `--space-16` | `4rem` (64px) | Hero spacing |
| `--space-20` | `5rem` (80px) | Page-level spacing |
| `--space-24` | `6rem` (96px) | Major layout gaps |

### 3.2 Layout-Specific Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--layout-padding-x` | `1.5rem` (24px) | Page horizontal padding |
| `--layout-padding-y` | `2rem` (32px) | Page vertical padding |
| `--sidebar-width` | `275px` | Left navigation width |
| `--rightbar-width` | `350px` | Right sidebar width |
| `--feed-max-width` | `600px` | Center feed column |
| `--header-height` | `64px` | Sticky header height |

---

## 4. BORDER RADIUS

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | `0` | Sharp corners (default aesthetic) |
| `--radius-sm` | `0.125rem` (2px) | Subtle rounding |
| `--radius-base` | `0.25rem` (4px) | Small elements, tags |
| `--radius-md` | `0.375rem` (6px) | Buttons, inputs |
| `--radius-lg` | `0.5rem` (8px) | Cards, modals |
| `--radius-xl` | `0.75rem` (12px) | Large cards, containers |
| `--radius-2xl` | `1rem` (16px) | Hero sections |
| `--radius-full` | `9999px` | Pills, avatars, circular |

**Note:** Communify uses minimal rounding (`--radius-sm` to `--radius-md`) for razor-sharp aesthetic.

---

## 5. SHADOWS & GLOWS

### 5.1 Box Shadows (Subtle Depth)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.5)` | Subtle lift |
| `--shadow-sm` | `0 2px 4px 0 rgba(0, 0, 0, 0.5)` | Cards, buttons |
| `--shadow-base` | `0 4px 8px 0 rgba(0, 0, 0, 0.5)` | Elevated cards |
| `--shadow-md` | `0 6px 12px 0 rgba(0, 0, 0, 0.5)` | Modals, dropdowns |
| `--shadow-lg` | `0 12px 24px 0 rgba(0, 0, 0, 0.6)` | Major overlays |
| `--shadow-xl` | `0 24px 48px 0 rgba(0, 0, 0, 0.7)` | Command palette |
| `--shadow-2xl` | `0 32px 64px 0 rgba(0, 0, 0, 0.8)` | Maximum elevation |

### 5.2 Glow Effects (Violet Accents)

| Token | Value | Usage |
|-------|-------|-------|
| `--glow-accent-sm` | `0 0 8px rgba(139, 92, 246, 0.3)` | Subtle accent glow |
| `--glow-accent-md` | `0 0 16px rgba(139, 92, 246, 0.4)` | Focus states, AI indicators |
| `--glow-accent-lg` | `0 0 24px rgba(139, 92, 246, 0.5)` | Active AI features |
| `--glow-accent-xl` | `0 0 32px rgba(139, 92, 246, 0.6)` | Hero AI elements |
| `--glow-white-sm` | `0 0 8px rgba(255, 255, 255, 0.1)` | Subtle highlights |
| `--glow-white-md` | `0 0 16px rgba(255, 255, 255, 0.15)` | Radiant edges |

---

## 6. ANIMATION & TRANSITIONS

### 6.1 Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `0ms` | No animation |
| `--duration-fast` | `100ms` | Micro-interactions |
| `--duration-base` | `200ms` | Standard transitions |
| `--duration-slow` | `300ms` | Complex animations |
| `--duration-slower` | `500ms` | Page transitions |
| `--duration-slowest` | `1000ms` | Loading, ambient |

### 6.2 Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-linear` | `linear` | Loading spinners |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering elements |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exiting elements |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default (smooth) |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Bouncy, playful |
| `--ease-snappy` | `cubic-bezier(0.86, 0, 0.07, 1)` | Quick, decisive |

### 6.3 Transition Presets

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-colors` | `color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out` | Color changes |
| `--transition-transform` | `transform 200ms ease-in-out` | Position/scale |
| `--transition-opacity` | `opacity 200ms ease-in-out` | Fade effects |
| `--transition-all` | `all 200ms ease-in-out` | General purpose |
| `--transition-shadow` | `box-shadow 200ms ease-in-out` | Glow effects |

---

## 7. Z-INDEX LAYERS

| Token | Value | Usage |
|-------|-------|-------|
| `--z-below` | `-1` | Background elements |
| `--z-base` | `0` | Default layer |
| `--z-raised` | `10` | Cards, buttons |
| `--z-dropdown` | `100` | Dropdown menus |
| `--z-sticky` | `200` | Sticky headers |
| `--z-overlay` | `300` | Overlays, scrims |
| `--z-modal` | `400` | Modals, dialogs |
| `--z-popover` | `500` | Popovers, tooltips |
| `--z-toast` | `600` | Toast notifications |
| `--z-tooltip` | `700` | Tooltips |
| `--z-command` | `800` | Command palette |
| `--z-max` | `999` | Maximum priority |

---

## 8. COMPONENT TOKENS

### 8.1 Buttons

#### Primary Button
```css
--btn-primary-bg: var(--color-accent-primary);
--btn-primary-bg-hover: var(--color-accent-secondary);
--btn-primary-bg-active: var(--color-accent-primary);
--btn-primary-text: #ffffff;
--btn-primary-shadow: var(--glow-accent-sm);
--btn-primary-shadow-hover: var(--glow-accent-md);
```

#### Secondary Button
```css
--btn-secondary-bg: var(--color-bg-secondary);
--btn-secondary-bg-hover: var(--color-bg-tertiary);
--btn-secondary-border: var(--color-border-primary);
--btn-secondary-border-hover: var(--color-border-secondary);
--btn-secondary-text: var(--color-text-primary);
```

#### Ghost Button
```css
--btn-ghost-bg: transparent;
--btn-ghost-bg-hover: var(--color-bg-tertiary);
--btn-ghost-text: var(--color-text-secondary);
--btn-ghost-text-hover: var(--color-text-primary);
```

#### Destructive Button
```css
--btn-destructive-bg: var(--color-error);
--btn-destructive-bg-hover: #dc2626;
--btn-destructive-text: #ffffff;
```

### 8.2 Cards

```css
--card-bg: var(--color-bg-secondary);
--card-bg-hover: var(--color-bg-tertiary);
--card-border: var(--color-border-primary);
--card-border-hover: var(--color-border-secondary);
--card-radius: var(--radius-lg);
--card-padding: var(--space-5);
--card-shadow: var(--shadow-sm);
--card-shadow-hover: var(--shadow-base);
--card-transition: var(--transition-all);
```

### 8.3 Inputs

```css
--input-bg: var(--color-bg-secondary);
--input-bg-focus: var(--color-bg-tertiary);
--input-border: var(--color-border-primary);
--input-border-focus: var(--color-accent-primary);
--input-border-error: var(--color-error);
--input-text: var(--color-text-primary);
--input-placeholder: var(--color-text-quaternary);
--input-radius: var(--radius-md);
--input-padding-x: var(--space-4);
--input-padding-y: var(--space-3);
--input-shadow-focus: var(--glow-accent-sm);
```

### 8.4 Badges & Tags

```css
--badge-bg: var(--color-bg-tertiary);
--badge-bg-accent: var(--color-accent-muted);
--badge-border: var(--color-border-primary);
--badge-text: var(--color-text-secondary);
--badge-text-accent: var(--color-accent-tertiary);
--badge-radius: var(--radius-full);
--badge-padding-x: var(--space-2);
--badge-padding-y: var(--space-1);
--badge-font: var(--font-mono);
--badge-font-size: var(--text-xs);
```

### 8.5 AI Summary Pill

```css
--ai-pill-bg: var(--color-accent-muted);
--ai-pill-border: rgba(139, 92, 246, 0.3);
--ai-pill-text: var(--color-accent-tertiary);
--ai-pill-glow: var(--glow-accent-sm);
--ai-pill-radius: var(--radius-full);
--ai-pill-padding-x: var(--space-3);
--ai-pill-padding-y: var(--space-1);
--ai-pill-font: var(--font-mono);
--ai-pill-font-size: var(--text-xs);
```

---

## 9. LAYOUT TOKENS

### 9.1 Grid System

```css
--grid-columns: 12;
--grid-gutter: var(--space-6);
--grid-margin: var(--space-4);
--grid-max-width: 1400px;
```

### 9.2 3-Column Layout

```css
--layout-sidebar-left: 275px;
--layout-feed-center: 1fr; /* Flexible */
--layout-sidebar-right: 350px;
--layout-gap: var(--space-6);
--layout-breakpoint: 1280px; /* Collapse right sidebar */
--layout-breakpoint-mobile: 768px; /* Collapse left sidebar */
```

### 9.3 Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;
--container-full: 100%;
```

---

## 10. ICONOGRAPHY

### 10.1 Icon Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-xs` | `12px` | Micro icons, inline |
| `--icon-sm` | `16px` | Default icon size |
| `--icon-md` | `20px` | Button icons |
| `--icon-lg` | `24px` | Navigation icons |
| `--icon-xl` | `32px` | Feature icons |
| `--icon-2xl` | `48px` | Hero icons |

### 10.2 Icon Stroke Width

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-stroke-thin` | `1px` | Minimal, hairline |
| `--icon-stroke-base` | `1.5px` | Default |
| `--icon-stroke-thick` | `2px` | Emphasized |

---

## 11. OPACITY SCALE

| Token | Value | Usage |
|-------|-------|-------|
| `--opacity-0` | `0` | Hidden |
| `--opacity-5` | `0.05` | Subtle backgrounds |
| `--opacity-10` | `0.1` | Disabled states |
| `--opacity-20` | `0.2` | Placeholders |
| `--opacity-40` | `0.4` | Secondary elements |
| `--opacity-60` | `0.6` | Tertiary elements |
| `--opacity-80` | `0.8` | Slightly muted |
| `--opacity-100` | `1` | Full opacity |

---

## 12. GRADIENTS

### 12.1 Accent Gradients

```css
--gradient-accent: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
--gradient-accent-radial: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
--gradient-glow: radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
```

### 12.2 Surface Gradients

```css
--gradient-surface: linear-gradient(180deg, #0a0a0a 0%, #000000 100%);
--gradient-card: linear-gradient(180deg, #111111 0%, #0a0a0a 100%);
--gradient-fade-bottom: linear-gradient(180deg, transparent 0%, #000000 100%);
```

---

## 13. MEDIA QUERIES

```css
--breakpoint-xs: 480px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1400px;
```

---

## 14. COMPONENT-SPECIFIC TOKENS

### 14.1 Navigation (Left Sidebar)

```css
--nav-item-padding-x: var(--space-4);
--nav-item-padding-y: var(--space-3);
--nav-item-radius: var(--radius-full);
--nav-item-bg-hover: var(--color-bg-tertiary);
--nav-item-text: var(--color-text-secondary);
--nav-item-text-hover: var(--color-text-primary);
--nav-item-text-active: var(--color-text-primary);
--nav-icon-size: var(--icon-lg);
--nav-icon-gap: var(--space-4);
--nav-font-size: var(--text-lg);
--nav-font-weight: var(--font-medium);
```

### 14.2 Feed Cards (Center Column)

```css
--feed-card-bg: var(--color-bg-secondary);
--feed-card-border: var(--color-border-primary);
--feed-card-padding: var(--space-5);
--feed-card-gap: var(--space-4);
--feed-card-radius: var(--radius-lg);
--feed-card-avatar-size: 48px;
--feed-card-tag-gap: var(--space-2);
--feed-card-action-gap: var(--space-6);
--feed-card-action-size: var(--icon-md);
```

### 14.3 Right Sidebar

```css
--rightbar-section-gap: var(--space-6);
--rightbar-card-bg: var(--color-bg-secondary);
--rightbar-card-border: var(--color-border-primary);
--rightbar-card-radius: var(--radius-lg);
--rightbar-card-padding: var(--space-5);
--trending-item-gap: var(--space-3);
--trending-rank-size: var(--text-sm);
--trending-rank-color: var(--color-text-quaternary);
```

### 14.4 Command-K Search

```css
--command-bg: var(--color-bg-secondary);
--command-border: var(--color-border-secondary);
--command-radius: var(--radius-xl);
--command-shadow: var(--shadow-xl);
--command-padding: var(--space-4);
--command-input-height: 56px;
--command-item-height: 48px;
--command-item-bg-hover: var(--color-bg-tertiary);
--command-item-radius: var(--radius-md);
--command-kbd-bg: var(--color-bg-tertiary);
--command-kbd-border: var(--color-border-secondary);
--command-kbd-radius: var(--radius-sm);
```

### 14.5 AI Assistant Card

```css
--ai-card-bg: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
--ai-card-border: rgba(139, 92, 246, 0.3);
--ai-card-radius: var(--radius-xl);
--ai-card-glow: var(--glow-accent-md);
--ai-card-padding: var(--space-6);
--ai-avatar-size: 40px;
--ai-avatar-bg: var(--gradient-accent);
```

---

## 15. TAILWIND CONFIG EXTENSION

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#111111',
          quaternary: '#161616',
        },
        border: {
          primary: '#1f1f1f',
          secondary: '#2e2e2e',
          tertiary: '#3a3a3a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1a1',
          tertiary: '#6b6b6b',
          quaternary: '#4a4a4a',
        },
        accent: {
          primary: '#8b5cf6',
          secondary: '#a78bfa',
          tertiary: '#c4b5fd',
          muted: 'rgba(139, 92, 246, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        'sm': '0.125rem',
        'base': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 16px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 24px rgba(139, 92, 246, 0.5)',
        'card': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'elevated': '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## 16. CSS VARIABLES (Complete Reference)

```css
:root {
  /* Colors - Background */
  --color-bg-primary: #000000;
  --color-bg-secondary: #0a0a0a;
  --color-bg-tertiary: #111111;
  --color-bg-quaternary: #161616;
  --color-bg-overlay: rgba(0, 0, 0, 0.8);

  /* Colors - Border */
  --color-border-primary: #1f1f1f;
  --color-border-secondary: #2e2e2e;
  --color-border-tertiary: #3a3a3a;
  --color-border-focus: #ffffff;

  /* Colors - Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1a1;
  --color-text-tertiary: #6b6b6b;
  --color-text-quaternary: #4a4a4a;
  --color-text-inverse: #000000;

  /* Colors - Accent */
  --color-accent-primary: #8b5cf6;
  --color-accent-secondary: #a78bfa;
  --color-accent-tertiary: #c4b5fd;
  --color-accent-muted: rgba(139, 92, 246, 0.15);
  --color-accent-glow: rgba(139, 92, 246, 0.4);

  /* Colors - Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Typography */
  --font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Layout */
  --sidebar-width: 275px;
  --rightbar-width: 350px;
  --header-height: 64px;

  /* Borders */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  --shadow-base: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 6px 12px 0 rgba(0, 0, 0, 0.5);

  /* Glows */
  --glow-accent-sm: 0 0 8px rgba(139, 92, 246, 0.3);
  --glow-accent-md: 0 0 16px rgba(139, 92, 246, 0.4);

  /* Transitions */
  --transition-all: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-colors: color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out;
}
```

---

## 17. USAGE EXAMPLES

### Button Component
```tsx
<button className="
  bg-accent-primary 
  text-white 
  font-medium 
  px-4 py-2 
  rounded-md 
  shadow-glow-sm
  hover:bg-accent-secondary
  hover:shadow-glow-md
  transition-all
  duration-200
">
  Register for Hackathon
</button>
```

### Card Component
```tsx
<div className="
  bg-background-secondary 
  border border-border-primary 
  rounded-lg 
  p-5 
  shadow-card
  hover:bg-background-tertiary
  hover:border-border-secondary
  transition-all
">
  {/* Card content */}
</div>
```

### AI Pill Badge
```tsx
<span className="
  inline-flex items-center
  bg-accent-muted
  border border-accent-primary/30
  text-accent-tertiary
  font-mono text-xs
  px-3 py-1
  rounded-full
  shadow-glow-sm
">
  ✨ AI Summary
</span>
```

---

**This design token system is ready for implementation in your IDE.**
