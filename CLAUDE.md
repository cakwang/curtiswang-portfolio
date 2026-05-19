# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Curtis Wang's personal portfolio — a static HTML/CSS/vanilla JS site with no build step. Open any HTML file directly in a browser to preview. There is no `package.json`, no bundler, and no server required.

## Architecture

**Individual Page Navigation:** The site consists of individual HTML pages. The fixed 285px left sidebar (navbar) is duplicated across all top-level pages (`index.html`, `pages/about.html`, etc.). There is no top-level iframe shell; navigating between pages changes the browser URL.

**Ideas section:** `pages/ideas.html` renders a two-pane layout with a left list (Table of Contents) and a right-side viewer. The implementation of how ideas are loaded into the right pane is currently being refactored to remove iframes.

**Page types:**
- `index.html` — landing page with hero section
- `pages/*.html` — top-level content pages (about, ideas, project listing grids)
- `pages/ideas/*.html` — individual essay pages
- `pages/learning_design/*.html`, `pages/tools/*.html` — project detail pages

**Three CSS files:**
- `style.css` — master stylesheet covering navbar, layouts, and styles for every top-level page type; all in one file
- `pages/landing-style.css` — typewriter animation and hero-specific styles; used only by `landing.html`
- `pages/project-style.css` — project detail page layout; shared by all files in `learning_design/` and `tools/`

**JavaScript:** All JS is inline `<script>` in HTML files. No external JS files exist. `landing.html` has a typewriter loop cycling through 7 phrases. No libraries — everything is vanilla.

## Key Design Tokens (defined only in style.css prose, not as variables yet)

| Token | Value |
|---|---|
| Primary accent | `#3c00ff` |
| Text dark | `#333` |
| Text medium | `#666` |
| Text light | `#999` |
| Background | `#fcfcfc` |
| Border | `#e6e6e6` |
| Sidebar width | `285px` |
| Base font | Inter (Google Fonts, weights 300–800) |
| Responsive breakpoint | `768px` |

## Known Issues & Incomplete Content

- **Creative project links are broken** — `pages/creative.html` links to `../creative/web-uiux.html`, `../creative/illustration.html`, `../creative/photography.html`, none of which exist.
- **Most project detail pages are placeholder stubs** — `tools/yougather.html` and `tools/twelvelabs.html` are near-copies of `tools/myhelp-remix.html` with placeholder text.
- **`learning_design/` project pages** also contain bracket placeholders (`[number]`, `[percentage]`, `[organizations/departments]`).
- **`pages/ideas/2024-03-14_photoshop.html`** and **`pages/ideas/2024-02-12_tell.html`** are minimal stubs.

## Style Conventions

- Spacing: 40px padding is the base unit used throughout
- Hover transitions: `0.3s ease` on interactive elements
- Links use `#3c00ff` and `text-decoration: none`; underline appears on hover
- Heading hierarchy in navbar: `h2` for section labels, `h3` for nav items
- All images use `placeholder-16-9.jpg` until real assets are added

## Content & File Naming

- Ideas files follow `YYYY-MM-DD_slug.html` naming under `pages/ideas/`
- Image subfolders for an essay go at `pages/ideas/YYYY-MM-DD_slug/` (see `2024-02-19_2x2/` for example)
- Project detail pages live in `pages/learning_design/` or `pages/tools/` (note the underscore in `learning_design`)
