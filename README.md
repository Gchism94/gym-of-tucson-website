# The Gym of Tucson — Website

Marketing site for [The Gym of Tucson](https://www.gymoftucson.com), a boutique strength-training facility in Tucson, AZ. Voted Arizona Daily Star Reader's Best Gym.

## Tech stack

- **Eleventy 2.x** — static site generator
- **Nunjucks** — templating
- **Tailwind CSS v3** — utilities + custom CSS layer (`src/assets/css/styles.css`)
- **PostCSS + Autoprefixer** — vendor prefixing
- **Vanilla JS + GSAP 3** — interactions and scroll animations (loaded via CDN)
- **WellnessLiving** — booking widget embed
- **Netlify** — hosting + redirects

No build-time JS bundling. No framework runtime. The site ships as static HTML, one minified CSS file, and one vanilla JS file.

## Running locally

```bash
npm install
npm start          # Eleventy --serve + Tailwind --watch, concurrently
```

Visit <http://localhost:8080>. Both Eleventy and Tailwind rebuild on file change.

## Production build

```bash
npm run build      # tailwindcss --minify → eleventy → _site/
```

Output goes to `_site/`. Netlify runs this on every push to `main`.

## Folder structure

```
.
├── src/
│   ├── _data/              # site config, trainers, testimonials (JS data files)
│   ├── _includes/          # nav, footer, head, popup partials
│   ├── _layouts/           # base.njk wraps every page
│   ├── assets/
│   │   ├── css/styles.css  # Tailwind input + custom CSS (single source)
│   │   └── js/app.js       # Vanilla JS + GSAP triggers
│   ├── index.njk           # homepage
│   ├── about.njk
│   ├── trainers.njk
│   ├── services-plans.njk
│   ├── personal-training.njk
│   ├── group-classes.njk
│   ├── nutrition-consult.njk
│   ├── power-lifting.njk
│   ├── open-gym.njk
│   ├── plans.njk
│   ├── privacy-policy.njk
│   ├── terms-and-conditions.njk
│   └── sitemap.njk         # generates /sitemap.xml
├── images/                 # photography, logos, video
├── favicon/
├── robots.txt
├── netlify.toml            # build + redirects
├── .eleventy.js            # passthrough copy + dir config
├── tailwind.config.js      # design tokens (colors, fonts, breakpoints)
├── postcss.config.js       # tailwindcss + autoprefixer
└── _site/                  # build output (gitignored)
```

### Page templates

Each `.njk` page in `src/` declares its layout, permalink, and SEO metadata in frontmatter, then renders content. Shared structure (nav, footer, head) comes from `src/_includes/`. Data referenced by `{{ trainers }}`, `{{ testimonials }}`, `{{ site }}` lives in `src/_data/*.js`.

### Styles

Authored CSS lives in `src/assets/css/styles.css`. Tailwind processes it into `src/assets/css/output.css` (gitignored). `.eleventy.js` passthrough-copies the built file to `_site/assets/css/output.css`. The custom CSS layer carries the bulk of the design — Tailwind utilities are used sparingly.

### JavaScript

A single `src/assets/js/app.js` handles: navbar scroll state, mobile hamburger, hero video swap, GSAP scroll-triggered animations, mobile floating CTA, popup. GSAP + ScrollTrigger load from CDN in `base.njk`.

## Deploy

Push to `main`. Netlify auto-builds via `npm run build` and publishes `_site/`. The legacy `/services.html` URL redirects to `/services-plans.html` (configured in `netlify.toml`).

## License

Proprietary — The Gym of Tucson. Not for redistribution.
