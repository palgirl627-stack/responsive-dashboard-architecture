# Responsive Dashboard Architecture

Northstar Operations is a portfolio-ready dashboard demonstrating a reusable CSS design token system, responsive dashboard architecture, and accessible light/dark themes.

## Features

- CSS custom properties for brand, semantic, surface, type, spacing, radius, shadow, transition, and breakpoint tokens
- Responsive sidebar and mobile navigation
- Dashboard grid that adapts across 320px, 768px, 1024px, and 1440px layouts
- Revenue range selector with 7-day, 30-day, and 90-day chart states
- Light/dark theme toggle with localStorage persistence
- Semantic landmarks, visible focus states, touch-friendly controls, and status feedback
- No horizontal overflow at the tested viewport sizes

## Run locally

```bash
npm install
npm run dev
```

The app uses Vite and defaults to port 5173.

## Responsive proof

Verified screenshots are saved in `screenshots/`:

- `320-light.jpg` — mobile
- `768-light.jpg` — tablet
- `1024-light.jpg` — laptop
- `1440-light.jpg` — desktop
- `1024-dark.jpg` — dark theme

## Testing checklist

- [x] CSS token system defined in `src/index.css` and used throughout the dashboard
- [x] Responsive layouts captured at 320px, 768px, 1024px, and 1440px
- [x] Light and dark themes captured; the toggle persists through localStorage
- [x] TypeScript typecheck passes
- [x] Production Vite build passes
- [x] No horizontal overflow is visible in the required viewport captures
- [x] Sidebar, mobile navigation, range selector, notification feedback, action feedback, and theme controls are wired
- [x] No browser errors were reported during screenshot capture

## Source map

- `src/App.tsx` — dashboard structure and interactive state
- `src/index.css` — design tokens, themes, component styles, and responsive breakpoints
- `screenshots/` — verified responsive proof captures
