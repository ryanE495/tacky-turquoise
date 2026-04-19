# Tacky Turquoise — Astro site

Original homepage for a fictional turquoise/silver jewelry brand.

## Run

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # -> dist/
npm run preview
```

## Structure

```
src/
  pages/index.astro        ← homepage, composes sections
  layouts/Base.astro       ← <html><head> shell + global CSS import
  components/
    Marquee.astro
    Nav.astro
    Hero.astro
    Categories.astro
    Featured.astro
    Arrivals.astro
    ArtistSpotlight.astro
    Footer.astro
    Tweaks.astro           ← client-side palette/headline/image switcher
  styles/
    tokens.css             ← CSS custom properties (palette, type)
    global.css             ← base + section layout
    components.css         ← all component styles
  data/
    categories.ts
    products.ts
  lib/
    placeholder.ts         ← SVG data-URI generator (swap for real photos later)
public/
  (drop real product photos / hero imagery here)
```

## Swapping placeholders for real photos

Every image currently uses a data-URI SVG from `src/lib/placeholder.ts`. To use real photos:

1. Drop files in `public/images/`
2. Replace `placeholder(...)` calls in the components with `/images/your-file.jpg`
