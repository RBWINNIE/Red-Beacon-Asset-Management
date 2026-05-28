# Red Beacon Asset Management

A static one-page marketing website for Red Beacon Asset Management — a trusted wealth management and investment advisory firm.

**Live site:** https://rbwinnie.github.io/Red-Beacon-Asset-Management/

![Site screenshot](apex-asset-website/screenshot.png)

## Project structure

```
apex-asset-website/
├── index.html      — all markup and section structure
├── styles.css      — all styling (CSS custom properties, responsive layout)
├── script.js       — all interactivity (navbar, carousel, counters, form)
└── screenshot.png  — homepage screenshot
```

No build step, no package manager, no framework.

## Sections

- **Hero** — full-screen headline with animated stat counters (4,200M+ AUM, 1,800+ clients, 22 years experience, 94% retention rate) and CTA buttons
- **Why Us** — four value-proposition cards (Personalised Strategy, Proven Track Record, Transparent Fees, Expert Advisors) with scroll-triggered fade-in
- **Testimonials** — auto-rotating carousel of three client quotes; supports touch swipe, keyboard arrows, and pause-on-hover
- **Contact** — enquiry form with client-side validation (name + email required) and FormSubmit.co AJAX integration; shows inline success/error banners

## Running locally

Open `apex-asset-website/index.html` directly in a browser, or serve with a static file server to avoid CORS issues with the contact form:

```bash
# Python
python -m http.server 8080 --directory apex-asset-website

# Node
npx http-server apex-asset-website -p 8080
```

Then visit `http://localhost:8080`.

## Deploying updates

The live site is served from the `gh-pages` branch via GitHub Pages. To push changes:

```bash
git checkout main
# edit files in apex-asset-website/
git add apex-asset-website/
git commit -m "your message"
git push origin main

# sync the live site
git subtree push --prefix apex-asset-website origin gh-pages
```

## Contact form setup (FormSubmit.co)

The form uses [FormSubmit.co](https://formsubmit.co) for serverless email delivery.

1. In `apex-asset-website/index.html`, find the `<form>` element with `id="enquiry-form"` and set its `action` attribute to `https://formsubmit.co/your-email@example.com`.
2. Submit the form once — FormSubmit sends a one-time activation email to that address.
3. Click the confirmation link. The endpoint is inactive until this step is completed.

The JavaScript in `script.js` rewrites the action URL at submit time to use the AJAX endpoint (`formsubmit.co/ajax/...`) so the page does not redirect on submission.
