# forecast-site Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-12

## Active Technologies
- JavaScript (ES2022), TypeScript (via Astro) + Astro, React, Tailwind CSS (006-scrolling-data-view)
- N/A (Feature is for presentation of already-loaded data) (006-scrolling-data-view)
- JavaScript/TypeScript (Astro, React, Node.js environment for CI/CD) + Astro, Node.js (for CI environment), npm/yarn (for package management), `actions/checkout`, `actions/setup-node`, `peaceiris/actions-gh-pages` (or similar GitHub Action for deployment) (007-release-github-pages)
- N/A (static assets served by GitHub Pages) (007-release-github-pages)
- JavaScript/TypeScript (Astro v5.16.9, React v19.2.3) + Astro, React, TailwindCSS, `bbc-client.js` (for external API interaction) (008-fix-performance-loop)
- Client-side only (browser memory for current view, no explicit persistence for this fix) (008-fix-performance-loop)

- JavaScript/TypeScript (Astro v5.16.9, React v19.2.3) + Astro, React, TailwindCSS, Vitest, Playwright, Zod (004-auto-show-forecast)
- N/A (client-side only; potential local/session storage for ephemeral caching) (004-auto-show-forecast)

- Node.js (as per project environment), Astro (^5.16.8), React (18.2.0) + Astro.js, React, Tailwind CSS, Vitest (for unit tests), Playwright (for E2E tests). No new primary dependencies for this feature. (001-auto-refresh-forecast)
- N/A (Client-side, data fetched from API) (001-auto-refresh-forecast)
- JavaScript (modern, using ES modules, JSX syntax) + Astro, React (for components), custom `bbc-client.js` for external API interaction. (002-auto-refresh-forecast)
- N/A (client-side data handling for current view) (002-auto-refresh-forecast)
- JavaScript/TypeScrip + Astro, React, Tailwind CSS. `bbc-client.js` for external API interaction. (003-optimize-auto-refresh)
- Client-side state management using `useState` within React components. Persistence of forecast parameters is currently handled via URL parameters or component props. No explicit client-side persistence (e.g., localStorage) is used for forecast parameters. (003-optimize-auto-refresh)

- Node.js (as per project environment), Astro (^5.16.8), React (18.2.0) (001-humidity-forecast)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for Node.js (as per project environment), Astro (^5.16.8), React (18.2.0)

## Code Style

Node.js (as per project environment), Astro (^5.16.8), React (18.2.0): Follow standard conventions

## Recent Changes
- 008-fix-performance-loop: Added JavaScript/TypeScript (Astro v5.16.9, React v19.2.3) + Astro, React, TailwindCSS, `bbc-client.js` (for external API interaction)
- 007-release-github-pages: Added JavaScript/TypeScript (Astro, React, Node.js environment for CI/CD) + Astro, Node.js (for CI environment), npm/yarn (for package management), `actions/checkout`, `actions/setup-node`, `peaceiris/actions-gh-pages` (or similar GitHub Action for deployment)
- 006-scrolling-data-view: Added JavaScript (ES2022), TypeScript (via Astro) + Astro, React, Tailwind CSS



<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
