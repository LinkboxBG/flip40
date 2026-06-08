# Flip4o — Design System v1.0

> Вдъхновен от дизайна на [magic-receipt.ai](https://magic-receipt.ai) — dark maximalist, neon-acid, high-contrast UI с distressed typography и glowing effects.

---

## 1. Brand DNA

**Усещане:** Енергично, дръзко, tech-forward. Като arcade машина, която е влязла в корпоративен офис и е взела командването.

**Тон:** Директен, с характер — не корпоративен. Говори като хора, изглежда като бъдеще.

**Ключови думи:** Electric · Raw · Bold · Neon · Focused

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Употреба |
|-------|-----|----------|
| `--color-bg-base` | `#080808` | Основен фон на приложението |
| `--color-bg-surface` | `#111111` | Карти, панели, модали |
| `--color-bg-elevated` | `#1a1a1a` | Hover states, dropdown backgrounds |
| `--color-bg-overlay` | `#0d0d0d` | Fullscreen overlays |

### Accent Colors

| Token | Hex | Употреба |
|-------|-----|----------|
| `--color-accent-lime` | `#b8ff00` | Primary CTA, highlights, активни елементи |
| `--color-accent-lime-glow` | `#c8ff2080` | Glow effect за lime (50% opacity) |
| `--color-accent-lime-dim` | `#7aaa0033` | Subtle background tint |
| `--color-accent-violet` | `#9b5cf6` | Secondary accent, badges, tags |
| `--color-accent-violet-glow` | `#9b5cf640` | Glow effect за violet |
| `--color-accent-violet-dim` | `#6d28d920` | Subtle violet tint |

### Text Colors

| Token | Hex | Употреба |
|-------|-----|----------|
| `--color-text-primary` | `#f5f5f5` | Основен текст |
| `--color-text-secondary` | `#888888` | Помощен текст, labels |
| `--color-text-muted` | `#444444` | Disabled, placeholders |
| `--color-text-accent` | `#b8ff00` | Highlighted/interactive text |
| `--color-text-inverse` | `#080808` | Текст върху lime бутони |

### Border & Divider

| Token | Hex | Употреба |
|-------|-----|----------|
| `--color-border-subtle` | `#1f1f1f` | Разделители, карт бордъри |
| `--color-border-strong` | `#333333` | Focus rings, активни бордъри |
| `--color-border-accent` | `#b8ff0050` | Accent borde с glow |

### Semantic Colors

| Token | Hex | Употреба |
|-------|-----|----------|
| `--color-success` | `#22c55e` | Успешни операции |
| `--color-error` | `#ef4444` | Грешки |
| `--color-warning` | `#f59e0b` | Предупреждения |
| `--color-info` | `#3b82f6` | Информационни съобщения |

---

## 3. Typography

### Font Stack

```css
/* Display / Headlines — distressed, bold, high-impact */
--font-display: 'Black Han Sans', 'Impact', sans-serif;

/* Body — clean, readable, slightly technical */
--font-body: 'DM Mono', 'Courier New', monospace;

/* UI — labels, buttons, captions */
--font-ui: 'Space Grotesk', 'Helvetica Neue', sans-serif;
```

> **Google Fonts import:**
> ```
> Black Han Sans (400)
> DM Mono (400, 500)
> Space Grotesk (400, 500, 600, 700)
> ```

### Type Scale

| Token | Size | Line Height | Weight | Употреба |
|-------|------|-------------|--------|----------|
| `--text-display-2xl` | `96px` | `0.9` | `900` | Hero headlines (distressed/uppercase) |
| `--text-display-xl` | `64px` | `0.95` | `900` | Section titles |
| `--text-display-lg` | `48px` | `1.0` | `800` | Feature headings |
| `--text-display-md` | `36px` | `1.1` | `700` | Card titles |
| `--text-display-sm` | `24px` | `1.2` | `700` | Subheadings |
| `--text-body-lg` | `18px` | `1.6` | `400` | Lead text, descriptions |
| `--text-body-md` | `16px` | `1.6` | `400` | Body copy |
| `--text-body-sm` | `14px` | `1.5` | `400` | Secondary text |
| `--text-ui-md` | `14px` | `1.4` | `600` | Buttons, labels |
| `--text-ui-sm` | `12px` | `1.3` | `500` | Captions, badges |
| `--text-mono-md` | `14px` | `1.5` | `400` | Code, data, prices |

### Typography Rules

- **Headlines:** UPPERCASE, letter-spacing: -0.02em до -0.04em, font: `var(--font-display)`
- **Accent думи в headline:** Обвивай в `<span class="text-accent">` с lime цвят и лек text-shadow glow
- **Body text:** font: `var(--font-body)`, relaxed line-height, не uppercase
- **Prices/Numbers:** font: `var(--font-body)` monospace, lime цвят, large size

---

## 4. Spacing & Layout

### Spacing Scale (базирана на 4px grid)

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

### Container

```css
--container-max:    1280px
--container-wide:   1440px
--container-narrow: 768px
--container-px:     clamp(16px, 4vw, 64px)  /* responsive padding */
```

### Grid

- **Desktop:** 12-колонна grid, gap: `var(--space-6)`
- **Tablet:** 8 колони
- **Mobile:** 4 колони

---

## 5. Effects & Visual Language

### Glow Effects

```css
/* Lime glow — за primary елементи */
--glow-lime-sm: 0 0 8px #b8ff0060, 0 0 20px #b8ff0030;
--glow-lime-md: 0 0 15px #b8ff0080, 0 0 40px #b8ff0040, 0 0 80px #b8ff0015;
--glow-lime-lg: 0 0 20px #b8ff00aa, 0 0 60px #b8ff0060, 0 0 120px #b8ff0025;

/* Violet glow — за secondary елементи */
--glow-violet-sm: 0 0 8px #9b5cf660, 0 0 20px #9b5cf630;
--glow-violet-md: 0 0 15px #9b5cf680, 0 0 40px #9b5cf640;

/* Text glow */
--glow-text-lime: 0 0 10px #b8ff00, 0 0 30px #b8ff0080;
--glow-text-violet: 0 0 10px #9b5cf6, 0 0 30px #9b5cf680;
```

### Noise / Grain Texture

```css
/* Добавя се като псевдоелемент върху секции */
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

### Border Styles

```css
/* Стандартен border */
--border-default: 1px solid var(--color-border-subtle);

/* Accent border с glow */
--border-accent: 1px solid var(--color-border-accent);
/* Съпроводен от: box-shadow: var(--glow-lime-sm); */

/* Thick accent line (decorative) */
--border-thick: 3px solid var(--color-accent-lime);
```

### Scanline Effect (декоративен)

```css
/* За hero секции и fullscreen backgrounds */
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.08) 2px,
    rgba(0,0,0,0.08) 4px
  );
  pointer-events: none;
  z-index: 2;
}
```

---

## 6. Components

### 6.1 Buttons

```css
/* PRIMARY BUTTON */
.btn-primary {
  background: var(--color-accent-lime);
  color: var(--color-text-inverse);
  font-family: var(--font-ui);
  font-size: var(--text-ui-md);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--space-3) var(--space-8);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.btn-primary:hover {
  box-shadow: var(--glow-lime-md);
  transform: translateY(-1px);
}

/* GHOST BUTTON */
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-strong);
  font-family: var(--font-ui);
  font-size: var(--text-ui-md);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--space-3) var(--space-8);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  border-color: var(--color-accent-lime);
  color: var(--color-accent-lime);
  box-shadow: var(--glow-lime-sm);
}

/* SIZES */
.btn-sm { padding: var(--space-2) var(--space-5); font-size: 12px; }
.btn-md { padding: var(--space-3) var(--space-8); font-size: 14px; }
.btn-lg { padding: var(--space-4) var(--space-10); font-size: 16px; }
```

**Форма на бутоните:** Клип-пат с "отрязан ъгъл" (chamfered corner) — характерен за gaming/tech UI.

### 6.2 Cards

```css
.card {
  background: var(--color-bg-surface);
  border: var(--border-default);
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

/* Accent corner — декоративна лайма линия горе вляво */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 40px; height: 2px;
  background: var(--color-accent-lime);
}

.card:hover {
  border-color: var(--color-border-accent);
  box-shadow: var(--glow-lime-sm);
}

/* Variant: highlighted */
.card--highlight {
  background: var(--color-accent-lime-dim);
  border-color: var(--color-border-accent);
}
```

### 6.3 Badges / Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px var(--space-3);
  border-radius: 2px;
}

.badge--lime {
  background: var(--color-accent-lime-dim);
  color: var(--color-accent-lime);
  border: 1px solid var(--color-accent-lime);
}

.badge--violet {
  background: var(--color-accent-violet-dim);
  color: var(--color-accent-violet);
  border: 1px solid var(--color-accent-violet);
}

.badge--neutral {
  background: var(--color-bg-elevated);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-subtle);
}
```

### 6.4 Input Fields

```css
.input {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  padding: var(--space-3) var(--space-4);
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

.input:focus {
  border-color: var(--color-accent-lime);
  box-shadow: var(--glow-lime-sm);
}

.input:hover:not(:focus) {
  border-color: var(--color-border-strong);
}

/* Label */
.input-label {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
```

### 6.5 Marquee / Ticker

```css
/* Хоризонтален безкраен ticker — характерен елемент */
.marquee-track {
  display: flex;
  overflow: hidden;
  background: var(--color-accent-lime);
  padding: var(--space-3) 0;
}

.marquee-content {
  display: flex;
  gap: var(--space-8);
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}

.marquee-item {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-inverse);
}

/* Separator между items */
.marquee-item::after {
  content: ' ✦ ';
  margin: 0 var(--space-4);
  opacity: 0.5;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### 6.6 Navigation

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--container-px);
  background: rgba(8, 8, 8, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-subtle);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--color-accent-lime);
  text-shadow: var(--glow-text-lime);
}

.nav-link {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-text-primary);
}
```

### 6.7 Section Dividers

```css
/* Лайм хоризонтална линия с gradient fade */
.divider-accent {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-accent-lime) 30%,
    var(--color-accent-lime) 70%,
    transparent 100%
  );
  opacity: 0.4;
  margin: var(--space-16) 0;
}

/* Номер на секция (декоративен) */
.section-number {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}
```

---

## 7. Motion & Animation

### Принципи

1. **Purposeful** — анимациите носят информация, не са декор
2. **Snappy** — fast in, slightly slower out (ease-out preferred)
3. **Glitch/Flicker** — позволен за headlines и loading states
4. **No bounce** — избягвай bouncy easing (твърде playful за този тон)

### Timing Tokens

```css
--duration-instant:  80ms
--duration-fast:     150ms
--duration-normal:   250ms
--duration-slow:     400ms
--duration-slower:   600ms

--ease-out:  cubic-bezier(0.16, 1, 0.3, 1)
--ease-in:   cubic-bezier(0.7, 0, 0.84, 0)
--ease-both: cubic-bezier(0.45, 0, 0.55, 1)
```

### Ключови Анимации

```css
/* Glitch effect — за headlines при hover или load */
@keyframes glitch {
  0%, 100% { transform: translate(0); clip-path: none; }
  20% { transform: translate(-2px, 1px); clip-path: inset(10% 0 80% 0); }
  40% { transform: translate(2px, -1px); clip-path: inset(60% 0 20% 0); color: var(--color-accent-violet); }
  60% { transform: translate(-1px, 2px); clip-path: inset(40% 0 50% 0); }
  80% { transform: translate(1px, -2px); clip-path: none; }
}

/* Fade up — за card/content reveal при scroll */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse glow — за активни/loading елементи */
@keyframes pulseGlow {
  0%, 100% { box-shadow: var(--glow-lime-sm); }
  50%       { box-shadow: var(--glow-lime-lg); }
}

/* Flicker — за neon-light ефект */
@keyframes flicker {
  0%, 95%, 100% { opacity: 1; }
  96% { opacity: 0.6; }
  97% { opacity: 1; }
  98% { opacity: 0.4; }
  99% { opacity: 1; }
}
```

---

## 8. Iconography

- **Стил:** Line icons, 1.5px stroke, 24×24px base size
- **Библиотека:** [Lucide](https://lucide.dev) или [Phosphor Icons](https://phosphoricons.com) (outline variant)
- **Цвят:** По подразбиране `var(--color-text-secondary)`, активно `var(--color-accent-lime)`
- **Размери:** 16px (compact), 20px (default), 24px (prominent), 32px (feature)

---

## 9. Shadows & Depth

```css
/* Elevation system — тъмни сенки (не светли) */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.4);
--shadow-md: 0 4px 20px rgba(0,0,0,0.5);
--shadow-lg: 0 8px 40px rgba(0,0,0,0.6);
--shadow-xl: 0 16px 80px rgba(0,0,0,0.7);

/* Inset shadow за sunken елементи */
--shadow-inset: inset 0 2px 8px rgba(0,0,0,0.5);
```

---

## 10. Responsive Breakpoints

```css
--bp-sm:  480px   /* Large phones */
--bp-md:  768px   /* Tablets */
--bp-lg:  1024px  /* Small desktops */
--bp-xl:  1280px  /* Desktops */
--bp-2xl: 1440px  /* Large screens */
```

**Mobile-first подход:** Пиши базовите стилове за mobile, после добавяй `@media (min-width: var(--bp-md))`.

---

## 11. Специфични UI Patterns за Flip4o

### Price Display

```css
/* Цените са ключови — трябва да "удрят" визуално */
.price {
  font-family: var(--font-body);
  font-size: var(--text-display-lg);
  font-weight: 700;
  color: var(--color-accent-lime);
  text-shadow: var(--glow-text-lime);
  letter-spacing: -0.03em;
}

.price-currency {
  font-size: 0.5em;
  vertical-align: super;
  opacity: 0.7;
}

.price-period {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-ui);
}
```

### Stat / Metric Display

```css
.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-display-xl);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-family: var(--font-ui);
  font-size: var(--text-ui-sm);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}
```

### Testimonial / Quote Card

```css
.testimonial {
  background: var(--color-bg-surface);
  border-left: 3px solid var(--color-accent-violet);
  padding: var(--space-6);
  position: relative;
}

.testimonial::before {
  content: '"';
  font-family: var(--font-display);
  font-size: 80px;
  color: var(--color-accent-violet);
  opacity: 0.3;
  position: absolute;
  top: -10px; left: var(--space-4);
  line-height: 1;
}
```

---

## 12. CSS Variables — Пълен Reference

```css
:root {
  /* Colors — Background */
  --color-bg-base:     #080808;
  --color-bg-surface:  #111111;
  --color-bg-elevated: #1a1a1a;
  --color-bg-overlay:  #0d0d0d;

  /* Colors — Accent */
  --color-accent-lime:        #b8ff00;
  --color-accent-lime-glow:   #c8ff2080;
  --color-accent-lime-dim:    #7aaa0015;
  --color-accent-violet:      #9b5cf6;
  --color-accent-violet-glow: #9b5cf640;
  --color-accent-violet-dim:  #6d28d915;

  /* Colors — Text */
  --color-text-primary:   #f5f5f5;
  --color-text-secondary: #888888;
  --color-text-muted:     #444444;
  --color-text-accent:    #b8ff00;
  --color-text-inverse:   #080808;

  /* Colors — Border */
  --color-border-subtle: #1f1f1f;
  --color-border-strong: #333333;
  --color-border-accent: #b8ff0050;

  /* Colors — Semantic */
  --color-success: #22c55e;
  --color-error:   #ef4444;
  --color-warning: #f59e0b;
  --color-info:    #3b82f6;

  /* Typography */
  --font-display: 'Black Han Sans', 'Impact', sans-serif;
  --font-body:    'DM Mono', 'Courier New', monospace;
  --font-ui:      'Space Grotesk', 'Helvetica Neue', sans-serif;

  /* Glow Effects */
  --glow-lime-sm:    0 0 8px #b8ff0060, 0 0 20px #b8ff0030;
  --glow-lime-md:    0 0 15px #b8ff0080, 0 0 40px #b8ff0040, 0 0 80px #b8ff0015;
  --glow-lime-lg:    0 0 20px #b8ff00aa, 0 0 60px #b8ff0060, 0 0 120px #b8ff0025;
  --glow-violet-sm:  0 0 8px #9b5cf660, 0 0 20px #9b5cf630;
  --glow-violet-md:  0 0 15px #9b5cf680, 0 0 40px #9b5cf640;
  --glow-text-lime:  0 0 10px #b8ff00, 0 0 30px #b8ff0080;
  --glow-text-violet:0 0 10px #9b5cf6, 0 0 30px #9b5cf680;

  /* Shadows */
  --shadow-sm:    0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:    0 4px 20px rgba(0,0,0,0.5);
  --shadow-lg:    0 8px 40px rgba(0,0,0,0.6);
  --shadow-xl:    0 16px 80px rgba(0,0,0,0.7);
  --shadow-inset: inset 0 2px 8px rgba(0,0,0,0.5);

  /* Spacing */
  --space-1:  4px;  --space-2:  8px;  --space-3:  12px;
  --space-4:  16px; --space-5:  20px; --space-6:  24px;
  --space-8:  32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* Layout */
  --container-max:    1280px;
  --container-wide:   1440px;
  --container-narrow: 768px;
  --container-px:     clamp(16px, 4vw, 64px);

  /* Animation */
  --duration-instant: 80ms;
  --duration-fast:    150ms;
  --duration-normal:  250ms;
  --duration-slow:    400ms;
  --duration-slower:  600ms;
  --ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:   cubic-bezier(0.7, 0, 0.84, 0);
  --ease-both: cubic-bezier(0.45, 0, 0.55, 1);

  /* Borders */
  --border-default: 1px solid var(--color-border-subtle);
  --border-accent:  1px solid var(--color-border-accent);
  --border-thick:   3px solid var(--color-accent-lime);

  /* Breakpoints (за reference — използвай в @media) */
  --bp-sm:  480px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
  --bp-2xl: 1440px;
}
```

---

## 13. Naming Conventions (за Cursor/Tailwind)

Ако използваш **Tailwind CSS**, добави в `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-base':        '#080808',
        'bg-surface':     '#111111',
        'bg-elevated':    '#1a1a1a',
        'accent-lime':    '#b8ff00',
        'accent-violet':  '#9b5cf6',
        'text-primary':   '#f5f5f5',
        'text-secondary': '#888888',
        'text-muted':     '#444444',
      },
      fontFamily: {
        display: ['"Black Han Sans"', 'Impact', 'sans-serif'],
        body:    ['"DM Mono"', '"Courier New"', 'monospace'],
        ui:      ['"Space Grotesk"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime-sm': '0 0 8px #b8ff0060, 0 0 20px #b8ff0030',
        'glow-lime-md': '0 0 15px #b8ff0080, 0 0 40px #b8ff0040',
        'glow-lime-lg': '0 0 20px #b8ff00aa, 0 0 60px #b8ff0060',
        'glow-violet':  '0 0 15px #9b5cf680, 0 0 40px #9b5cf640',
      },
    },
  },
}
```

---

## 14. Do's & Don'ts

### ✅ DO
- Използвай `#b8ff00` пестеливо — само за най-важните елементи
- Добавяй glow само към interactive/active states, не към всичко
- Комбинирай lime + violet в контрастни секции
- Използвай uppercase за headlines и button labels
- Добавяй chamfered corners (clip-path) към бутоните за tech усещане
- Дръж backgrounds тъмни — контрастът е силата

### ❌ DON'T
- Не слагай glow на всеки елемент едновременно
- Не използвай светли фонове (white/light gray)
- Не mix-вай повече от 2 accent цвята в един layout
- Не ползвай rounded corners > 4px (нарушава dark-tech естетиката)
- Не използвай centered alignment за body text в секции
- Не добавяй прекалено много blur/glassmorphism (изглежда cheap)

---

*Flip4o Design System v1.0 — Генериран за Cursor имплементация*
