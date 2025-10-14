# Roll Foundation — Static Site (No Node Required)

This is a clean HTML/CSS/JS scaffold. No npm, no bundlers.

## Structure
- `index.html` — home
- `ambassadors.html` — grid of ambassadors
- `events.html` — upcoming events
- `donate.html` — donation options
- `styles.css` — mobile-first styling
- `script.js` — tiny JS for nav + nice-to-haves
- `assets/placeholder-1x1.png` — temp image

## Local Preview
Just double-click `index.html` to open in your browser, or run a tiny server:
- macOS: `python3 -m http.server 5500` then open http://localhost:5500/

## Deploy to GitHub Pages
1. Create a new repo (e.g., `roll-foundation`).
2. Copy all these files to the repo root and commit.
3. In GitHub → Settings → Pages:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root** (or **/docs** if you put files in a `docs/` folder)
4. Your site will be live at `https://<username>.github.io/roll-foundation/`.

## PayPal / QBO
- Replace the `href="#"` on the Donate button with your PayPal donation link.
- Add a QuickBooks Online payment URL below it if desired.
