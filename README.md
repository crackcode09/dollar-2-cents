# Dollar 2 Cents

> A visual coin change calculator — beautifully animated, zero dependencies.

[![Live Site](https://img.shields.io/badge/live-dollartocents.netlify.app-EA580C?style=flat-square&logo=netlify&logoColor=white)](https://dollartocents.netlify.app)
[![Vanilla JS](https://img.shields.io/badge/vanilla-JS%20%2F%20CSS%20%2F%20HTML-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://dollartocents.netlify.app)

---

## Screenshots

### $ → Coins mode
![Dollar to Coins](https://image.thum.io/get/width/1280/crop/800/https://dollartocents.netlify.app)

### Coins → $ mode
> Enter how many of each coin you have on hand — get the total dollar value instantly.

---

## Features

| Feature | Details |
|---------|---------|
| **$ → Coins** | Enter any dollar amount, get the minimum coin breakdown |
| **Coins → $** | Count coins on hand, see total dollar value |
| **Animated counters** | Smooth cubic ease-out count-up on every result |
| **Coin flip** | 3D `rotateY` flip animation on each coin |
| **Pip visualizer** | CSS circle pips drop in per coin (capped at 20 + overflow label) |
| **Coin rain** | Particle burst on every conversion |
| **Responsive** | Mobile (375px) · Tablet · Desktop (1200px+) two-column layout |
| **Accessible** | `aria-live` results, visible focus states, `prefers-reduced-motion` |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Structure | Vanilla HTML5 |
| Styling | Vanilla CSS — no frameworks |
| Logic | Vanilla JavaScript ES6+ |
| Fonts | Fredoka + Nunito (Google Fonts CDN) |
| Hosting | Netlify |

**No build step. No npm. No bundler.** Open `index.html` and it works.

---

## Project Structure

```
dollar-2-cents/
├── index.html              # Markup only
├── css/
│   └── style.css           # All styles and animations
├── js/
│   └── app.js              # All logic
├── netlify.toml            # Netlify publish config
├── CLAUDE.md               # Project rules and design system
└── Dollars-To-Cents-App.md # Original spec
```

---

## Run Locally

No install needed — just open the file:

```bash
git clone https://github.com/crackcode09/dollar-2-cents.git
cd dollar-2-cents
open index.html   # or double-click it
```

Or use any static file server:

```bash
npx serve .
```

---

## Algorithm

Greedy change (largest coin first): **Quarter → Dime → Nickel → Penny**

```js
// Float-point fix: Math.round prevents 2.30 * 100 = 229.999...
function toCents(n) { return Math.round(n * 100); }
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#1C1917` |
| Primary (orange) | `#EA580C` |
| Accent (blue) | `#2563EB` |
| Heading font | Fredoka |
| Body font | Nunito |

Style: **Exaggerated Minimalism** — dark, oversized type, metallic coin palette.

---

## License

MIT — personal project by [Nidhin Dileepkumar](https://github.com/crackcode09)
