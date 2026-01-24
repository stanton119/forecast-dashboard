# Dependencies

This document lists the key external dependencies of the `forecast-site` project and describes their roles.

## Main Dependencies

These packages are required for the application to run in production.

| Package           | Version | Description                                                               |
| ----------------- | ------- | ------------------------------------------------------------------------- |
| `@astrojs/react`  | ^4.4.2  | Astro integration that enables rendering of React components.             |
| `@playwright/test`| ^1.57.0 | Test runner for Playwright. (Note: Often a dev dependency).             |
| `react`           | ^19.2.3 | The core React library for building user interfaces.                      |
| `react-dom`       | ^19.2.3 | Serves as the entry point to the DOM and server renderers for React.      |
| `recharts`        | ^3.6.0  | A charting library used to build the `ForecastChart` component.           |
| `tailwindcss`     | ^4.1.18 | A utility-first CSS framework used for all styling.                       |
| `zod`             | ^4.3.5  | A TypeScript-first schema declaration and validation library, used to validate API responses in `bbc-client.js`. |

## Development Dependencies

These packages are only needed for local development, testing, and building the application.

| Package                   | Version  | Description                                                               |
| ------------------------- | -------- | ------------------------------------------------------------------------- |
| `astro`                   | ^5.16.9  | The core Astro web framework.                                             |
| `vitest`                  | ^0.34.0  | A fast unit testing framework used for running unit and component tests.  |
| `playwright`              | ^1.40.0  | A framework for end-to-end testing across different browsers.             |
| `eslint`                  | ^8.0.0   | A pluggable linter for identifying and reporting on patterns in JavaScript. |
| `prettier`                | ^2.0.0   | An opinionated code formatter to ensure consistent code style.            |
| `@testing-library/react`  | ^16.3.2  | Provides utilities for testing React components.                          |
| `jsdom`                   | ^27.4.0  | A pure-JavaScript implementation of many web standards, used by Vitest to simulate a DOM environment for tests. |
| (various `eslint-` plugins) | -      | Various plugins to extend ESLint's capabilities for Astro, React, JSX, etc. |
| (various `@typescript-` plugins) | - | Plugins for TypeScript support in the development environment.            |

*Versions are indicative and may change over time. Refer to `package.json` for the most up-to-date list.*
