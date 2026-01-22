# Quickstart Guide: 008-fix-performance-loop

## Overview

This guide provides instructions on how to set up the development environment, reproduce the performance bug, and verify the fix for the `008-fix-performance-loop` feature.

## Prerequisites

-   Node.js (LTS version)
-   npm or yarn (preferably npm, as indicated by `package-lock.json`)
-   Git

## Setup Development Environment

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/forecast-site.git
    cd forecast-site
    ```
2.  **Checkout the feature branch**:
    ```bash
    git checkout 008-fix-performance-loop
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:4321/` (or similar).

## Reproducing the Performance Bug (Pre-fix)

Before applying any fixes, follow these steps to observe the performance issue:

1.  Open the application in your browser (e.g., `http://localhost:4321/`).
2.  Open your browser's developer tools (usually F12 or Ctrl+Shift+I).
3.  Navigate to the "Network" tab to monitor network requests.
4.  Navigate to a forecast page (e.g., by entering a postcode and submitting).
5.  **Observe**:
    *   Multiple, redundant API calls for the same forecast data.
    *   Rapid changes in URL parameters (e.g., by quickly typing a postcode). Observe if this triggers excessive API calls or an infinite loop.
    *   UI responsiveness issues or freezing during data fetches.

## Verifying the Fix (Post-fix)

After implementing the fix, follow these steps to verify its effectiveness:

1.  Ensure the development server is running (`npm run dev`).
2.  Repeat steps 1-4 from "Reproducing the Performance Bug".
3.  **Observe**:
    *   Only a single API call for forecast data per unique forecast view.
    *   Smooth UI responsiveness even with rapid URL parameter changes.
    *   No infinite loops of network requests.
    *   Reduced CPU usage as indicated by browser developer tools.

## Running Tests

### Unit Tests

Unit tests for specific utility functions (e.g., debouncing, request cancellation logic) can be run using Vitest:

```bash
npm run test:unit
```

### End-to-End (E2E) Tests

E2E tests covering the user scenarios for stable forecast display and efficient resource usage can be run using Playwright:

```bash
npm run test:e2e
```
(Note: You may need to run `npx playwright install` first if you haven't already.)

## Further Exploration

-   Inspect `src/lib/bbc-client.js` for changes related to API call management.
-   Review React components in `src/components/` (e.g., `ForecastPage.jsx`) for state management and effect hook optimizations.