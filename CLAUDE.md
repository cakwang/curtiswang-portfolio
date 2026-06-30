# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Curtis Wang's personal portfolio — a static HTML/CSS/vanilla JS site with no build step. Open any HTML file directly in a browser to preview. There is no `package.json`, no bundler, and no server required.

## Local Development

To preview the site during development:
1. Open any `.html` file directly in a browser (e.g., `index.html`, `pages/about.html`)
2. Navigate between pages using the sidebar links — they will change the browser URL without requiring a server
3. Reload the browser after editing HTML or CSS to see changes

All dependencies are loaded from CDN (GSAP, Font Awesome), so there is nothing to install or build. For the **Ideas iframe**, opening individual essay pages (`pages/ideas/*.html`) directly in the browser will work, but to test the full two-pane layout and tag filtering, open `pages/ideas.html` and use the TOC on the left.

## Architecture

**Individual Page Navigation:** The site consists of individual HTML pages. The fixed 285px left sidebar (navbar) is duplicated across all top-level pages. There is no iframe shell; navigating between pages changes the browser URL.

**Ideas section:** `pages/ideas.html` renders a two-pane layout — a left TOC with filterable tag pills and a right `<iframe name="ideas-frame">` that loads individual essay pages. Tag filtering hides/shows `<li>` elements and their parent `<ul>` wrappers via a `.hidden` CSS class; year headings always remain visible regardless of filter state. A `sessionStorage` handshake lets `index.html` pre-load a specific essay: the recent-entry card click sets `sessionStorage.setItem('ideas-load', path)` and `ideas.html` reads and clears it on load. The placeholder page (`pages/ideas/placeholder.html`) has a randomizer button that navigates the iframe itself via `window.location.href` (not `window.parent`) to avoid cross-origin restrictions with `file://` protocol.

**Page types:**
- `index.html` — landing page with signature draw → iris-open → typewriter animation
- `pages/about.html` — bio, skills, resume download; contains a tl;dr component
- `pages/ideas.html` — ideas two-pane viewer
- `pages/projects.html` — project listing grid
- `pages/software.html`, `pages/creative.html` — additional section pages
- `pages/ideas/*.html` — individual essay pages (loaded inside the ideas iframe)
- `pages/projects/*.html` — project detail pages; each contains a tl;dr component

**CSS files:**
- `style.css` — master stylesheet for all pages; defines `:root` CSS custom properties (see design tokens below)
- `pages/landing-style.css` — typewriter animation and hero styles; used only by `index.html`
- `pages/project-style.css` — orphaned; not linked in any HTML file (safe to reference as a design reference but not active)

**JavaScript:**
- Most JS is inline `<script>` in each HTML file
- `scripts/project-animations.js` — external file; loaded by `pages/projects.html` via GSAP for hover lift/border-pop animations on project cards
- `scripts/mobile-menu.js` — external file; loaded by all top-level pages and all five project detail pages. Wires the hamburger button to slide the `.navbar` in/out as an off-canvas drawer on mobile. Ideas essay pages (inside the iframe) do **not** load it.
- `index.html` animation sequence: GSAP timeline drives signature stroke-dashoffset drawing → iris SVG mask expansion → navbar slide-in → typewriter start

**Mobile navigation boilerplate:** Every page that loads `mobile-menu.js` must also include this HTML at the top of `<body>`:
```html
<div class="mobile-header" id="mobile-header">
    <a href="index.html" class="mobile-logo-link">
        <img src="assets/logo.png" alt="Curtis Wang" class="mobile-logo-img">
    </a>
    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open navigation">
        <span></span><span></span><span></span>
    </button>
</div>
<div class="mobile-overlay" id="mobile-overlay"></div>
```
Adjust the `href` and `src` paths for pages in subdirectories (e.g. `../index.html`, `../assets/logo.png`).

**External libraries (CDN):**
- GSAP 3.12.5 (`cdnjs`) — used in `index.html`, `pages/about.html`, `pages/projects.html`, and all five `pages/projects/*.html` detail pages
- Font Awesome 6.4.0 (`cdnjs`) — icons; loaded on every page

## tl;dr Component

There are two distinct implementations of the tl;dr component in the site:

### Animated Expand/Collapse (pages/about.html only)

On `pages/about.html`, the tl;dr is an **animated, interactive component** that expands on click. It is self-contained: inline `<style>` in `<head>`, HTML in the page body, and an inline `<script>` that uses GSAP for animation. The component sits above the long bio paragraphs.

**HTML structure:**
```html
<div class="tldr-wrapper" id="tldr-wrapper">
    <div class="tldr-header">
        <span>tl;dr</span>
        <i class="fas fa-chevron-down" id="tldr-caret"></i>
    </div>
    <div class="tldr-body" id="tldr-body">
        <p>...</p>
    </div>
</div>
```

**Critical implementation details:**
- `.tldr-body` uses `display: none` (not `height: 0; overflow: hidden`) — this is essential. If the body is `height: 0` but in normal flow, its paragraph content still contributes to the wrapper's intrinsic width, causing the collapsed pill to be full-width.
- `.tldr-wrapper` needs `align-self: flex-start` to prevent flex parent stretching. Without it, flex stretching overrides `inline-block` sizing.
- The collapsed width is pinned via `gsap.set(tldrWrapper, { width: collapsedWidth })` at load — without this, GSAP has no inline width to tween from on first click, causing a cut instead of an animation.
- Expand sequence (0.6s total): width → height → opacity fade-in, each 0.2s, chained via `onComplete`.
- Collapse sequence (0.4s total): opacity fade-out (0.1s) → height (0.15s) → width (0.15s), chained via `onComplete`.
- After height expands, `clearProps: 'height,overflow'` resets the wrapper to reflow naturally; after collapse, `clearProps: 'height,overflow,opacity'` cleans up before `display: none` is set.

### Static tl;dr Box (all five project detail pages)

All project detail pages use a **static, non-interactive tl;dr box** positioned above the "Problem & Learner Context" h2. It is self-contained: inline `<style>` in `<head>` and HTML in the page body. No GSAP or JavaScript is required.

**HTML structure:**
```html
<div class="tldr-box">
    <span class="tldr-label">tl;dr</span>
    <p>...</p>
</div>
```

**Styling notes:**
- `.tldr-box` uses `background-color: #f2f2f2` and `border-radius: 12px` with a subtle border.
- `.tldr-label` is a small caps label block styled with `font-weight: 600` and `letter-spacing: 0.08em`.
- The selector `.project-sections-col .tldr-box + h2 { margin-top: 0; }` preserves flush alignment since adding the tl;dr box before the first `<h2>` would otherwise cause h2 to pick up `margin-top: 40px`.

## Key Design Tokens (defined as CSS custom properties in `style.css` `:root`)

| Token | Value |
|---|---|
| `--color-accent` | `#3c00ff` |
| `--color-text` | `#333` |
| `--color-text-muted` | `#666` |
| `--color-bg` | `#fcfcfc` |
| `--color-border` | `#e6e6e6` |
| `--transition` | `0.3s ease` |
| Sidebar width | `285px` |
| Base fonts | Inter (weights 100–900) + Instrument Serif (Google Fonts) |
| Responsive breakpoint | `768px` |

## Deployment

The site is served via GitHub Pages. A `.nojekyll` file is present at the root to suppress Jekyll processing. No build step — push to the repo and it deploys.

## Known Issues & Incomplete Content

- **Creative project links are broken** — `pages/creative.html` links to pages that don't exist.
- **`pages/about.html` profile blurb** contains unscrubbed draft text — fragments from other people's bios are mixed into the paragraphs below the tagline and tl;dr.
- **`pages/ideas/2024-03-14_photoshop.html`** and **`pages/ideas/2024-02-12_tell.html`** are minimal stubs.
- **`pages/project-style.css`** exists but is not linked anywhere — it is orphaned.

## Style Conventions

- Spacing: 40px padding is the base unit used throughout
- Hover transitions: `0.3s ease` (via `--transition`) on all interactive elements
- Links use `var(--color-accent)` and `text-decoration: none`; underline appears on hover
- Heading hierarchy in navbar: `h2` for nav links
- Placeholder images use `assets/placeholder-16-9.jpg`
- Tags/pills (project tags, skill tags, filter tags, tl;dr button) use `background-color: var(--color-border)` with `border-radius: 20px`

## Ideas Essay Structure

Individual essay files are bare HTML — no navbar, no mobile-header, no GSAP. Just:

```html
<body>
    <div class="ideas-entry">
        <h1>Title</h1>
        <h2>Month DD, YYYY</h2>  <!-- style.css uses h2:after to render a decorative rule -->
        <p class="ideas-post-tag">Tag Name</p>
        <p>Body. Use <span class="highlight">...</span> for callout text.</p>
        <!-- Optional: .image-container for lightbox images -->
        <div class="ideas-footer">
            <p><sup>1</sup>Footnote text.</p>
        </div>
    </div>
</body>
```

All styles are in `style.css` under `.ideas-entry`. The `h2` renders as a date line (not a subheading); `p.ideas-post-tag` renders as a pill tag.

## Content & File Naming

- Ideas files follow `YYYY-MM-DD_slug.html` naming under `pages/ideas/`
- Image subfolders for an essay go at `pages/ideas/YYYY-MM-DD_slug/` (see `2024-02-19_2x2/` for example)
- Project detail pages live in `pages/projects/`
- When adding a new ideas post, also add it to: the TOC in `pages/ideas.html` (with correct `data-tag`) and the `posts` array in `pages/ideas/placeholder.html` (filename only, no path prefix)
