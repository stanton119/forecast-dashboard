# Quickstart: Auto-show Forecast on Page Load

This guide provides instructions to quickly set up and verify the "Auto-show Forecast on Page Load" feature.

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Git

## Setup

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd forecast-site
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The application should now be accessible at `http://localhost:4321` (or another port if 4321 is in use).

## Verification

### Manual Test

1.  Open your web browser and navigate to the application URL (e.g., `http://localhost:4321`).
2.  Observe the page. The weather forecast for the default location (e.g., London) should automatically appear without any user interaction within approximately 1 second.
3.  **Test with URL parameters:** Navigate to `http://localhost:4321?postcode=SW1A0AA` (replace with a valid postcode if needed). The forecast should update to the specified postcode.
4.  **Test error handling:** (Requires simulating an API error, e.g., by temporarily disabling network or modifying API calls to fail). Verify that a user-friendly error message ("Forecast data unavailable. Please try again later.") is displayed along with a "Retry" button.

### Automated End-to-End Test

The feature can be verified using the Playwright end-to-end tests.

1.  **Run Playwright tests:**
    ```bash
    npm run test:e2e
    # or yarn test:e2e
    ```
2.  Ensure that tests related to automatic forecast display and URL parameter handling pass.
    - Look for `test_auto_refresh.spec.js` and `test_default_view.spec.js` in the `tests/e2e/` directory.

## Configuration

- **Default Location**: The hardcoded default location (e.g., city/postcode) can be configured in `src/lib/config.js` (or similar configuration file).
- **API Endpoint**: The weather API endpoint is configured in `src/lib/bbc-client.js` (or similar service file).
