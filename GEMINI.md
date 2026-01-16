# forecast-site Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-12

## Active Technologies

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

- 004-auto-show-forecast: Added JavaScript/TypeScript (Astro v5.16.9, React v19.2.3) + Astro, React, TailwindCSS, Vitest, Playwright, Zod

- 003-optimize-auto-refresh: Added JavaScript/TypeScrip + Astro, React, Tailwind CSS. `bbc-client.js` for external API interaction.
- 002-auto-refresh-forecast: Added JavaScript (modern, using ES modules, JSX syntax) + Astro, React (for components), custom `bbc-client.js` for external API interaction.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
