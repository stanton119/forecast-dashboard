# Humidity forecast

Spec driven development

Specs:

1. Initial implementation
2. Auto reloading following parameter changes.
3. Auto refresh now optimizes API calls, avoiding re-fetching if only indoor temperature calculations change.
4. add zooming on the datetime axis
5. remove powered by gemini, attribution is only to bbc weather
6. data view to be a scrolling window
7. load forecast on page load
8. auto location getting, or remember last location they used

## Feature: Auto-show Forecast on Page Load

This feature automatically displays the weather forecast upon page load, prioritizing location information from URL parameters.

### Location Determination

The system determines the forecast location using the following priority:

1.  **URL Parameters**: If `postcode`, `latitude`, or `longitude` are provided in the URL query string (e.g., `?postcode=SW1A0AA`), these will be used.
2.  **Hardcoded Default**: If no location parameters are present in the URL, a hardcoded default location (currently London, SW1A0AA) is used.

### Usage with URL Parameters

You can specify a location directly in the URL:

*   **By Postcode**: `http://localhost:4321/?postcode=YO103DD`
*   **By Latitude and Longitude**: `http://localhost:4321/?latitude=51.5&longitude=0.1`

When a postcode is provided in the URL, it takes precedence. If only latitude and longitude are provided, the system will use them if the underlying API supports it; otherwise, it will fall back to the default or indicate an error if the API is postcode-specific. The current BBC client primarily uses postcode.

**Example**:
To view the forecast for York (postcode YO10 3DD), navigate to:
`http://localhost:4321/?postcode=YO103DD`