# Task: Auto-Show Forecast on Load

## Description
Modify the application to automatically display the weather forecast for a default postcode when the page initially loads without any postcode or location parameters in the URL. If URL parameters are present, the application should continue to prioritize those as it currently does. This change aims to improve the user experience by presenting immediate content rather than a blank state on first visit.

## Background
Currently, when a user navigates to the forecast site without any URL parameters (e.g., `https://forecast.site/`), the page loads without displaying any forecast data until the user manually enters a postcode. This task addresses this by automatically fetching and displaying data for a predefined default location, ensuring that new visitors or those without specific parameters immediately see relevant content.

## Reference Documentation
**Required:**
- Design: GEMINI.md (for overall project architecture and components)

**Additional References (if relevant to this task):**
- src/lib/location.js (for default location definition)
- src/components/ForecastPage.jsx (the main orchestrator component)
- src/lib/hooks/useUrlParams.js (for managing URL parameters)

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1.  On initial page load, check if URL parameters for location (postcode, latitude, or longitude) are absent.
2.  If absent, automatically set the application's postcode state to the default postcode defined in `src/lib/location.js` (currently 'SW1A0AA').
3.  Ensure that setting this default postcode triggers the existing forecast fetching and display mechanisms.
4.  Update the browser's URL to reflect the default postcode, creating a shareable link for the default view.
5.  Maintain the existing functionality where any location parameters present in the URL take precedence over the default.

## Dependencies
- `src/components/ForecastPage.jsx`: The primary component where the logic for handling initial state and fetching data resides.
- `src/lib/hooks/useUrlParams.js`: Used to read and write URL parameters.
- `src/lib/location.js`: Provides the `getDefaultLocation` function.

## Implementation Approach
1.  In `src/components/ForecastPage.jsx`, within a `useEffect` hook that runs only once on component mount, check if the `postcode` or other location-related states (derived from `useUrlParams`) are empty or `null`.
2.  If they are, call `getDefaultLocation()` from `src/lib/location.js` to get the default postcode.
3.  Use the `setPostcode` function (or equivalent state setter from `useUrlParams`) to update the application's postcode state with this default. This should automatically trigger data fetching due to existing dependencies.
4.  Ensure that `useUrlParams` updates the URL when the default postcode is set, making the URL shareable.

## Acceptance Criteria

1.  **Page Loads with URL Parameters:**
    -   Given the application is loaded with a specific postcode in the URL (e.g., `/?postcode=SW1A0AA`)
    -   When the page finishes loading
    -   Then the forecast for the specified postcode is displayed, and the URL remains unchanged.

2.  **Page Loads without URL Parameters (Default Behaviour):**
    -   Given the application is loaded without any postcode or location parameters in the URL (e.g., `https://forecast.site/`)
    -   When the page finishes loading
    -   Then the forecast for the default postcode ('SW1A0AA') is displayed.

3.  **URL Updated on Default Load:**
    -   Given the application is loaded without any postcode or location parameters in the URL
    -   When the forecast for the default postcode is displayed
    -   Then the browser's URL is updated to include the default postcode parameter (e.g., `https://forecast.site/?postcode=SW1A0AA`).

4.  **No Interference with User Input:**
    -   Given the page has loaded with a default forecast
    -   When the user enters a new postcode in the input field
    -   Then the forecast updates to the newly entered postcode, and the URL reflects this change.

## Metadata
- **Complexity**: Medium
- **Labels**: feature, UX, forecast, initial-load, default-state
- **Required Skills**: React, React Hooks, JavaScript, URLSearchParams
