
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

This project can be deployed as a server-rendered Next.js app (Vercel, Render, etc.) or exported as a static site.

Server-rendered deployment (recommended for Next.js features):

1. Build and start (example):

```powershell
npm run build; npm run start
```

2. Deploy to Vercel: run `vercel` from the project root (install Vercel CLI first) or connect the GitHub repo to Vercel.

Static export (if desired):

1. Enable static export via `next.config.js` or run `next export` after `next build`.
2. Ensure `out/` contains the static site and run `npm run deploy` to publish with `gh-pages`.

## Contributing

If you want to adapt this template, please fork the repo and open a pull request. Keep commits small and focused.


