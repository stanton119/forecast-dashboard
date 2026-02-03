# Code Implementation Context: Auto-Show Forecast on Load

## Task Summary

Modify the application to automatically display the weather forecast for a default postcode when the page initially loads without any postcode or location parameters in the URL. If URL parameters are present, the application should prioritize them.

## Existing Documentation

The following documentation files were discovered and reviewed:

- `README.md`: Confirms the desired feature behavior, provides examples, and includes deployment instructions.
- `GEMINI.md`: Provides a high-level overview of the project architecture, technology stack, and key components. It was referenced in the task description.

## Key Files from Task Description & Research

- **Task Logic:** `src/components/ForecastPage.jsx` - The main React component that orchestrates the page. This is the likely location for the primary change.
- **URL State Management:** `src/lib/hooks/useUrlParams.js` - The custom hook that synchronizes component state with URL query parameters.
- **Default Location:** `src/lib/location.js` - Contains the `getDefaultLocation` function which provides the default postcode ('SW1A0AA').
- **API Client:** `src/lib/bbc-client.js` - Handles fetching the forecast data.

## Initial Analysis

The core of the task is to modify `ForecastPage.jsx`. On the initial render, it needs to check if a location is present in the URL (via `useUrlParams`). If not, it should use `getDefaultLocation` to get the default postcode and then update the state (and the URL) using the functions provided by `useUrlParams`. This state update should naturally trigger the existing `useEffect` hook that fetches the forecast data from the BBC client.

## Implementation Path

- **Testing:** An end-to-end test will be created to validate the feature.
    -   **File:** `tests/e2e/test_auto_show_forecast.spec.js`
    -   **Approach:** This test will cover two main scenarios:
        1.  Loading the root page (`/`) and asserting that the forecast for the default postcode ('SW1A0AA') is displayed and that the URL is updated to `/?postcode=SW1A0AA`.
        2.  Loading a page with a specific postcode (e.g., `/?postcode=YO103DD`) and asserting that the correct forecast is shown.
    -   **Reference:** `tests/e2e/test_permalink.spec.js` will be used as a model for this test.

- **Implementation:** The core logic will be added to `ForecastPage.jsx`.
    -   **File:** `src/components/ForecastPage.jsx`
    -   **Approach:** A `useEffect` hook with an empty dependency array (`[]`) will be added to run only on the initial component mount. Inside this hook, it will check if the `postcode` value from the `useUrlParams` hook is falsy. If it is, it will call `getDefaultLocation()` and then use the `setPostcode` function from the hook to set the default postcode.
