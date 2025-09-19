
# Next.js Tailwind Portfolio

This repository is a personal portfolio template built with Next.js, TypeScript, and Tailwind CSS. It was originally authored by Creative Tim and adapted into this workspace.

## Features

- Next.js 13 app router structure
- TypeScript support
- Tailwind CSS for utility-first styling
- Prebuilt components for hero, projects, skills, resume, testimonials, and clients

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended) or yarn/pnpm

## Quick Start

1. Install dependencies

```powershell
npm install
```

2. Run development server

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

The following scripts are defined in `package.json` and are the main entry points for development and deployment:

- `npm run dev` — Start the Next.js development server.
- `npm run build` — Create an optimized production build.
- `npm run start` — Start the production server after building.
- `npm run lint` — Run Next.js/Eslint checks.
- `npm run predeploy` — Runs before `deploy` (currently runs the build).
- `npm run deploy` — Prepare `out/.nojekyll` and publish `out` directory via `gh-pages` (if configured).

Notes:
- The `deploy` script uses `gh-pages` and expects a static export in `out/`. If you want to export a static site, add/adjust `next.config.js` to enable `output: 'export'` or run `next export` as part of your deployment pipeline.

## Project Structure

Top-level important folders/files:

- `src/app/` — Next.js app directory containing pages and components used in routes.
- `src/components/` — Reusable UI components.
- `public/` — Static assets (images, logos, favicon).
- `utils/` — Small utility helpers.

Example notable files:

- `src/app/page.tsx` — Home page entry.
- `src/app/layout.tsx` — Root layout for the app.
- `src/components/navbar.tsx` — Navigation bar component.

## Tailwind & Styles

Tailwind is configured in `tailwind.config.ts` and PostCSS is configured in `postcss.config.js`. Global styles are in `src/app/globals.css`.

## Deployment

This project is configured for static export and can be deployed to GitHub Pages or other static hosting platforms.

### GitHub Pages Deployment

#### Option 1: Automatic Deployment (Recommended)
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The workflow in `.github/workflows/deploy.yml` will automatically deploy on every push to main/master

#### Option 2: Manual Deployment
```powershell
npm run build
npm run deploy
```

### Other Static Hosting Platforms
The project exports to the `out/` directory which can be deployed to:
- Netlify: Drag and drop the `out/` folder
- Vercel: Connect your GitHub repository
- AWS S3, CloudFront, or any static hosting service

### Server-rendered Deployment
If you prefer server-rendered deployment:
1. Remove `output: "export"` from `next.config.js`
2. Deploy to Vercel, Render, or other Node.js hosting platforms

## Contributing

If you want to adapt this template, please fork the repo and open a pull request. Keep commits small and focused.

## License & Credits

This project includes assets and design by Creative Tim. See the original template and licensing information at https://github.com/themewagon/Next.js-Tailwind-CSS-Portfolio-Template and Creative Tim's license URL in `package.json`.

