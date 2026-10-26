# Movie Night

Movie finder for M2 · Async Odyssey.

## Current stage

Vite project with a basic search form and separate JavaScript modules.
Submitting a title displays a setup message. Movie requests are not connected yet.

## Requirements

- Node.js compatible with Vite (the project was set up with Node 24.15.0).
- npm.
- TMDB API access for the next stage.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Unlike M1, do not open index.html by double-clicking.

## Production build

```sh
npm run build
npm run preview
```

## Planned stages

1. Vite setup, basic form, and module imports.
2. TMDB requests, loading, error handling, and empty results.
3. Data normalization, filters, and rating statistics.
4. localStorage cache and robustness checks.
5. Final styling, documentation, and rubric review.

## Credentials

The .env.example file contains only an empty placeholder. Real credentials belong
in an ignored .env.local file. The API stage will add a server-side bridge;
the browser must not receive the TMDB token through a VITE_ variable.

## Uso de IA

To be completed before submission with actual assistance, prompts, and verification.

## Autopsia

To be completed before submission with two decisions and alternatives considered.
