# Workflows

This document describes the key user and data workflows within the `forecast-site` application.

## 1. Initial Page Load & Forecast Display

This workflow describes the process from a user first visiting the site to seeing the initial forecast.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant ForecastPage
    participant bbc-client
    participant BBC_API

    User->>Browser: Navigates to website URL (with or without params)
    Browser->>ForecastPage: Mounts component
    ForecastPage->>ForecastPage: Reads params from URL (via useUrlParams hook)
    alt No postcode in URL
        ForecastPage->>ForecastPage: Uses default postcode
    end
    ForecastPage->>ForecastPage: Sets loading state to true
    ForecastPage->>bbc-client: getForecast(postcode)
    bbc-client->>BBC_API: GET /en/forecast/aggregated/{postcode}
    BBC_API-->>bbc-client: Forecast JSON
    bbc-client-->>ForecastPage: Parsed forecast data
    ForecastPage->>ForecastPage: Calculates indoor humidity for each data point
    ForecastPage->>ForecastPage: Sets loading state to false
    ForecastPage->>Browser: Renders chart and table with the final data
```

**Steps:**
1.  The user's browser requests the site's URL.
2.  The initial Astro page is loaded, which mounts the main React `ForecastPage` component.
3.  The `useUrlParams` hook within `ForecastPage` reads the `postcode` and `indoorTemp` from the URL query string. If they are not present, default values are used.
4.  A loading state is activated, and a request is sent to the BBC Weather API via the `bbc-client.js` module.
5.  Upon receiving a successful response, the data is parsed and validated.
6.  The `ForecastPage` component processes the raw data, calculating the `inside_relative_humidity_percent` for each time slot.
7.  The final processed data is saved to the component's state, the loading state is deactivated, and the new data is passed down to the `ForecastChart` and `DataTable` components to be rendered.

## 2. User Updates Forecast Parameters

There are two primary ways a user can update the forecast, each with a slightly different workflow.

### 2a. User Updates the Postcode

This workflow triggers a new API call to fetch data for the new location.

```mermaid
sequenceDiagram
    participant User
    participant ParameterForm
    participant ForecastPage
    participant Browser
    participant bbc-client

    User->>ParameterForm: Types a new postcode
    ParameterForm->>ForecastPage: Calls onPostcodeChange(newPostcode)
    ForecastPage->>ForecastPage: Debounces the input, then calls updateParams()
    ForecastPage->>Browser: URL query string is updated with the new postcode
    Browser->>ForecastPage: React re-renders as the useUrlParams hook provides a new `postcode` value
    ForecastPage->>ForecastPage: The `useEffect` hook listening for `postcode` changes is triggered
    Note right of ForecastPage: The data fetching process from the "Initial Page Load" workflow is repeated for the new location.
```

### 2b. User Updates the Indoor Temperature

This workflow does **not** require a new API call. The indoor humidity is simply recalculated using the existing forecast data.

```mermaid
sequenceDiagram
    participant User
    participant ParameterForm
    participant ForecastPage
    participant Browser

    User->>ParameterForm: Changes the indoor temperature input
    ParameterForm->>ForecastPage: Calls onIndoorTempChange(newTemp)
    ForecastPage->>ForecastPage: Immediately calls updateParams()
    ForecastPage->>Browser: URL query string is updated with the new temperature
    Browser->>ForecastPage: React re-renders as the useUrlParams hook provides a new `indoorTemp` value
    ForecastPage->>ForecastPage: The `useEffect` hook listening for `indoorTemp` changes is triggered
    ForecastPage->>ForecastPage: Recalculates `inside_relative_humidity_percent` for all existing data points
    ForecastPage->>Browser: Re-renders the chart and table with the newly calculated values
```
