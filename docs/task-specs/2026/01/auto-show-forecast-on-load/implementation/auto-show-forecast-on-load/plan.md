# Implementation Plan: Auto-Show Forecast on Load

This document outlines the test strategy and implementation steps for automatically showing a default forecast on page load.

## 1. Test Strategy (TDD)

An end-to-end (E2E) test will be implemented first to validate the complete user-facing behavior. This test will initially fail and will be used to drive the development.

**Test File:** `tests/e2e/test_auto_show_forecast.spec.js`

### Test Scenarios

#### Scenario 1: Initial load without URL parameters

-   **Given:** A user navigates to the root URL (`/`).
-   **When:** The page finishes loading.
-   **Then:** The forecast data for the default postcode ('SW1A0AA') should be visible in the data table.
-   **And:** The page URL should be updated to contain `/?postcode=SW1A0AA`.

#### Scenario 2: Initial load with a specific postcode in the URL

-   **Given:** A user navigates to a URL with a postcode parameter (e.g., `/?postcode=YO103DD`).
-   **When:** The page finishes loading.
-   **Then:** The forecast data for the specified postcode ('YO103DD') should be visible in the data table.
-   **And:** The input field for the postcode should contain 'YO103DD'.

## 2. Implementation Steps

The implementation will follow the Test-Driven Development cycle.

1.  **Create Failing Test:** Implement the E2E test scenarios described above in `tests/e2e/test_auto_show_forecast.spec.js`. Run the test and verify that it fails for the expected reasons (i.e., the default forecast does not load).

2.  **Implement Feature Logic:**
    -   Modify `src/components/ForecastPage.jsx`.
    -   Add a `useEffect` hook that runs once on initial component mount.
    -   Inside the hook, check if the `postcode` state from `useUrlParams` is empty.
    -   If it is empty, get the default postcode from `getDefaultLocation()` and update the state using the setter from `useUrlParams`.

3.  **Verify Pass:** Run the E2E test again and verify that all scenarios now pass.

4.  **Refactor:** Review the changes for clarity, correctness, and adherence to project conventions. Ensure no unnecessary code was added.
