# Stellux Interactive — Portfolio Site

Modern single-page portfolio for [Stellux Interactive](https://sites.google.com/view/stelluxinteractive).

## Preview locally

Open `index.html` in a browser, or run a simple server:

```powershell
# Python
python -m http.server 8080

# Node (if npx is available)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy

This is a static site — no build step required. Deploy to any of:

- **GitHub Pages** — push to a repo and enable Pages from the root
- **Netlify** — drag-and-drop the folder or connect the repo
- **Cloudflare Pages** — same as Netlify

Point your custom domain at the host when ready.

## Customize

- **Projects** — edit cards in `index.html`
- **Colors & fonts** — CSS variables at the top of `css/style.css`
- **Contact email** — update the `mailto:` links in `index.html`

## Structure

```
index.html      Main page
css/style.css   Styles
js/main.js      Starfield, nav, scroll animations
```
