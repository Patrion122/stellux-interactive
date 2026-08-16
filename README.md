# Stellux Interactive — Portfolio Site

Studio site for [Stellux Interactive](https://stelluxinteractive.com).

Static HTML/CSS/JS, hosted on GitHub Pages with a custom domain.

## Preview locally

Open `index.html` in a browser, or run a simple server:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Refresh media

Screenshots, OG image, favicon, and compressed logos are generated from itch.io / Asset Store sources:

```powershell
python -m pip install Pillow
python tools/fetch-media.py
```

Output lands in `assets/media/`, plus `assets/og.png`, `favicon.ico`, and `apple-touch-icon.png`.

## Deploy

Push to `main`. GitHub Pages publishes from the repository root.

## Customize

- **Projects** — cards and gallery data in `index.html` and `js/main.js`
- **Colors & fonts** — CSS variables at the top of `css/style.css`
- **Contact email** — `mailto:` links in `index.html`
- **Screenshots** — remote URLs in `tools/fetch-media.py`; tool slides in `tools/screenshots/`

## Structure

```
index.html              Main page
404.html                Custom not-found page
css/style.css           Styles
js/main.js              Starfield, nav, lightbox
assets/media/           Optimized screenshots
tools/fetch-media.py    Media downloader
```
