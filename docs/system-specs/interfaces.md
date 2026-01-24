# Interfaces

This document describes the key interfaces and APIs within the `forecast-site` application, including the external API client and internal library modules.

## 1. External API Interface

The application integrates with the BBC Weather API to fetch forecast data. This interaction is handled exclusively by the `bbc-client.js` module.

### `bbc-client.js`

This module abstracts the communication with the BBC Weather API.

- **`getForecast(location)`**: An asynchronous function that fetches weather data.
    - **`location` (Object)**: An object containing location information.
        - `postcode` (String): The UK postcode to fetch the forecast for. This is the primary method used.
        - `latitude` (Number): The latitude (currently not used by the client).
        - `longitude` (Number): The longitude (currently not used by the client).
    - **Returns**: A `Promise` that resolves to an array of forecast data points. Each point is an object with the following structure:
        ```javascript
        {
          timestamp_iso: "2023-10-27T12:00:00.000Z",
          outside_humidity_percent: 85,
          outside_temp_c: 14
        }
        ```
    - **Throws**: An `Error` if the API call fails or if a postcode is not provided.

- **API Endpoint**: `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/{postcode}`
- **Data Validation**: The raw API response is validated using Zod schemas defined within the module to ensure type safety and data integrity.

## 2. Internal Library Interfaces (`src/lib`)

The `src/lib` directory contains modules with pure functions and utilities that encapsulate the application's business logic.

### `humidity.js`

- **`getInsideRelativeHumidity(outsideTemp, outsideHumidity, insideTemp)`**: Calculates the indoor relative humidity based on outdoor temperature, outdoor humidity, and indoor temperature. This is a core piece of business logic.

### `postcode.js`

- **`isValidPostcode(postcode)`**: A utility function that validates a UK postcode against a regular expression. Returns `true` or `false`.

### `location.js`

- **`getDefaultLocation()`**: Returns a default location object (e.g., London).
- **`determinePrioritizedLocation(urlParams, defaultLocation)`**: A utility to decide which location to use based on URL parameters and the default.

### `exportCsv.js`

- **`downloadCsv(filename, data)`**: Takes an array of data, converts it to a CSV formatted string, and programmatically triggers a file download in the browser.

### `errors.js`

- **`getFriendlyErrorMessage(error)`**: Takes an error object and returns a user-friendly error message string to display in the UI.

## 3. React Hook Interface (`src/lib/hooks`)

Custom React hooks are used to encapsulate and reuse stateful logic.

### `useUrlParams.js`

- **`useUrlParams()`**: A custom hook that manages the application's state in the URL's query string.
    - **Returns**: An object containing:
        - `postcode` (String): The current postcode value from the URL.
        - `indoorTemp` (Number): The current indoor temperature value from the URL.
        - `updateParams(newPostcode, newIndoorTemp)` (Function): A function to update the URL query parameters, which in turn triggers a state update and re-render.
