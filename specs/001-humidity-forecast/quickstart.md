# Quickstart: Humidity Forecast

**Date**: 2026-01-12
**Spec**: [/Users/rich/Developer/Github/forecast-site/specs/001-humidity-forecast/spec.md]

This document provides instructions on how to set up and run the humidity forecast application locally.

## Prerequisites

- Node.js (version specified in project's `.nvmrc` or `package.json`, assumed to be >= 18)
- npm (or yarn/pnpm)

## Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd forecast-site
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up Tailwind CSS**:
    The project uses Tailwind CSS. It should be set up as part of the initial implementation. If not, run:
    ```bash
    npx astro add tailwind
    ```

## Running the Application

1.  **Start the development server**:

    ```bash
    npm run dev
    ```

    This will start the Astro development server, typically on `http://localhost:4321`.

2.  **Open in browser**:
    Open `http://localhost:4321` in your web browser to see the application.

## Running Tests

- **Unit Tests**:

  ```bash
  npm run test
  ```

- **End-to-End Tests**:
  ```bash
  npm run test:e2e
  ```

## Building for Production

To create a production build of the application (e.g., for deployment):

```bash
npm run build
```

The output will be in the `dist/` directory.
