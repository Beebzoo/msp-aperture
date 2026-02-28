# msp-aperture

Website for Studievereniging Aperture — the study association of Maastricht Science Programme.

## How it works

Static site (HTML/CSS/JS) designed for **GitHub Pages** (free hosting). All content lives in a single file:

**`data/content.json`** — Edit this file to update board members, events, committees, merch, etc. No coding required.

## Pages

- **Home** — Hero, slideshow, board members, quick links
- **About** — What is Aperture, history, past boards, how to get involved
- **Committees & Clubs** — All committees and clubs with descriptions
- **Events** — Upcoming events and annual traditions
- **Merch** — Hoodies, t-shirts, order info
- **Contact** — Contact form, address, socials

## Adding images

Drop images into the appropriate subfolder:

- `images/slides/` — Homepage slideshow backgrounds
- `images/board/` — Board photos
- `images/committees/` — Committee/club president photos
- `images/chronicle/` — Chronicle issue covers
- `images/merch/` — Merch product photos
- `files/chronicle/` — Chronicle PDF downloads

Then update the paths in `data/content.json`.

## Hosting

This site is designed for GitHub Pages. Enable it in repo Settings > Pages > Source: main branch, root folder. The `.nojekyll` file tells GitHub to serve files directly.

Current domain: msp-aperture.com (can be configured as custom domain in GitHub Pages settings).
