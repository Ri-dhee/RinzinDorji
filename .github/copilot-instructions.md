# Copilot Instructions for Rinzin Dorji Portfolio Website

## Project Overview
A high-performance, single-page portfolio website built with **vanilla JavaScript**, **Tailwind CSS**, and **custom animations**. Deployed on GitHub Pages. Key features: responsive design, PWA support, dark/light theme toggle, and performance optimization (85+ PageSpeed score).

## Architecture & Key Patterns

### Stack
- **HTML5** with semantic markup and comprehensive SEO/Open Graph meta tags
- **Tailwind CSS v3** (deferred loading) + 1069-line custom.css for animations and effects
- **Vanilla JavaScript** (620-line script.js) - no frameworks
- **Service Worker** (sw.js) for offline support and asset caching
- **GitHub Pages** deployment with relative paths for compatibility

### Critical Design Decisions
1. **Performance-First**: CSS/JS loaded with `media="print" onload="this.media='all'"` pattern for non-blocking load
2. **No Build Step**: Static files served as-is; Tailwind pre-compiled into index.html
3. **GPU Acceleration**: All animations use `transform`/`opacity`; custom scrollbar, ambient blobs, and canvas particles
4. **Relative Paths**: Service worker and assets use `./` paths for GitHub Pages compatibility
5. **Modular CSS**: custom.css organized by 15 sections with clear table of contents

## Essential Developer Workflows

### Theme Colors & Variables
Located in custom.css `:root`:
```css
--brand-primary: #22c55e (green)
--brand-secondary: #14b8a6 (teal)
--brand-accent: #06b6d4 (cyan)
--bg-dark: #0f172a
--bg-card: #1e293b
```
Update these for branding changes; all components reference via `var()`.

### Adding New Animations
1. Define keyframes in custom.css (section 4)
2. Use `--transition-smooth: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)` for consistency
3. Hook animations in script.js via `.classList.add()` on page load or scroll
4. Reference hero animations pattern: `TextScramble` class for text effects

### Responsive Strategy
Mobile-first with Tailwind breakpoints (md: 768px, lg: 1024px). Custom CSS includes media queries in section 15. Test at min-width viewport to ensure all breakpoints work.

### Service Worker Caching
**Cache Strategy**: Cache-first with network fallback for GET requests to same-origin
- Cache version: `rinzin-portfolio-v4` (increment on major changes)
- Cached assets listed in `ASSETS_TO_CACHE` array
- Offline fallback: serves 404.html for HTML page requests
- **Important**: Service worker only handles same-origin, GET requests; external APIs bypass cache

## Project-Specific Conventions

### File Organization
- `index.html` (861 lines): Single monolithic HTML with inlined critical CSS at top
- `css/custom.css` (1069 lines): Keyed by sections 1-15; animations before utilities
- `js/script.js` (620 lines): Organized by feature blocks with clear comment headers
- External: Font Awesome CDN, Google Fonts, Web3Forms API

### Naming Patterns
- CSS classes: kebab-case (`.hero-title`, `.glass-card`, `.nav-scrolled`)
- Data attributes: not used; rely on IDs and class selectors
- Animation classes: `.animate-in`, `.active` (added/removed dynamically)
- Hero elements: `.hero-title`, `.hero-stagger`, `.gradient-text`, `.reveal`

### JavaScript Patterns
1. **DOM Ready**: Uses `window.addEventListener('load')` for preloader removal
2. **Classes**: `TextScramble` for text animations; self-contained with methods
3. **Event Throttling**: Scroll events use `ticking` flag + `requestAnimationFrame()`
4. **No Global State**: Functions like `animateHeroText()`, `checkViewport()` are local
5. **PWA Registration**: `navigator.serviceWorker.register('sw.js')`

## Integration Points

### External Dependencies
- **Font Awesome 6.4.0** (CDN) - deferred load
- **Google Fonts** - Outfit + Playfair Display (deferred)
- **Web3Forms** - contact form backend (no auth needed)
- **GitHub Pages** - relative path deployment

### Critical Elements Requiring Updates
- `<title>`, meta descriptions, OG/Twitter cards in `<head>`
- `schema.org` JSON-LD structured data (Person, Organization)
- Footer year: auto-updated via `document.getElementById('year').textContent = new Date().getFullYear()`
- Service worker `CACHE_NAME` (increment version string when assets change)

## Common Tasks

| Task | Where | Notes |
|------|-------|-------|
| Change brand colors | `custom.css` `:root` | Updates all components via CSS variables |
| Add new section | `index.html` + `custom.css` | Add content + reveal animation class |
| Fix animation timing | `custom.css` section 4 | Keyframes; or `script.js` setTimeout delays |
| Update contact form | `index.html` form element | Uses Web3Forms; keep `action` URL |
| Modify service worker assets | `sw.js` `ASSETS_TO_CACHE` + version bump | Clear caches in browser DevTools after |
| Add scroll interaction | `script.js` scroll event section | Use `requestAnimationFrame()` pattern |

## Code Examples

### Adding a reveal animation on scroll
```javascript
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
            el.classList.add('active');
        }
    });
});
```
CSS already exists: `.reveal` → `.reveal.active` transition in custom.css.

### Updating theme colors
Edit `custom.css` `:root` block, then HTML classes auto-update:
```css
--brand-primary: #new-color; /* All brand-500 classes reference this */
```

## Avoid These Pitfalls
- ❌ Don't add build tools (Tailwind is pre-compiled)
- ❌ Don't use `window.` global functions (keep scope local)
- ❌ Don't forget service worker cache version bumps
- ❌ Don't break relative paths with absolute URLs (GitHub Pages compatibility)
- ❌ Don't add heavy external libraries (keep vanilla JS philosophy)

---
**Last Updated:** Dec 2025 | **Deployed:** GitHub Pages (ri-dhee.github.io/RinzinDorji)
