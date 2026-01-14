# Quickstart: Auto Reloading Forecast on Parameter Change

This document provides a quick overview of how to integrate and test the auto-reloading forecast feature.

## Core Logic

The core logic for this feature will reside within the existing `ForecastPage.jsx` and potentially `ParameterForm.jsx` components.

1.  **Parameter Change Detection**:
    -   Changes in the `postcode` and `indoorTemperature` input fields will be detected. This will likely involve using React's state management (`useState`) and effect hooks (`useEffect`) to monitor changes to these parameters.

2.  **Forecast Data Fetching**:
    -   The existing `getForecast` function from `src/lib/bbc-client.js` will be re-used to fetch outdoor weather data based on the `postcode`.
    -   The `indoorTemperature` parameter will be used client-side, likely with the `calculateIndoorHumidity` function from `src/lib/humidity.js`, to derive the indoor relative humidity.

3.  **Loading Indicator**:
    -   A loading state will be managed (e.g., using `useState`) to display a visual indicator (as per FR-004) while forecast data is being fetched and processed.

4.  **UI Update**:
    -   Once new forecast data is available, the `ForecastChart.jsx` and `DataTable.jsx` components will be updated to display the refreshed information.

## API Contracts

This feature primarily re-uses existing API contracts.

### BBC Weather API (via `bbc-client.js`)

-   **Endpoint**: `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/{postcode}`
-   **Method**: `GET`
-   **Client Function**: `getForecast(postcode)` from `src/lib/bbc-client.js`
-   **Purpose**: Fetches aggregated weather forecast data (including outdoor temperature and humidity) for a specified UK postcode.

No new external API contracts are introduced by this feature.

## Client-Side Logic

### Humidity Calculation (via `humidity.js`)

-   **Client Function**: `calculateIndoorHumidity(outdoorTemperature, outdoorHumidity, indoorTemperature)` from `src/lib/humidity.js`
-   **Purpose**: Calculates the indoor relative humidity based on outdoor conditions and user-specified indoor temperature.

## Testing

-   **Unit Tests**: Existing unit tests for `bbc-client.js` and `humidity.js` should ensure the correctness of data fetching and calculations. New unit tests will cover the new logic for parameter change detection, state management, and error handling in the `ForecastPage.jsx` or relevant component.
-   **E2E Tests**: New Playwright E2E tests will be added (e.g., in `tests/e2e/test_auto_refresh.spec.js`) to verify the user scenarios outlined in the feature specification, including:
    -   Changing postcode automatically updates forecast.
    -   Changing indoor temperature automatically updates forecast.
    -   Loading indicator display during updates.
    -   Error message display for invalid postcodes.
