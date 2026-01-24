# Components

This document provides an overview of the major React components used in the `forecast-site` application. All components are located in the `src/components/` directory.

## Component Overview

| Component           | Description                                                                                                      | Dependencies                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `ForecastPage.jsx`  | The main container component that orchestrates the entire application. It manages state, fetches data, and renders all other components. | `bbc-client.js`, `humidity.js`, React hooks |
| `ParameterForm.jsx` | A controlled form for users to input the UK postcode and indoor temperature.                                     | -                                          |
| `ForecastChart.jsx` | Displays the humidity forecast data in a line chart. Handles its own loading and error states based on props.    | `recharts`                                 |
| `DataTable.jsx`     | Renders the raw forecast data in a scrollable table. Handles its own loading and error states based on props.    | -                                          |
| `ShareButton.jsx`   | Allows users to copy the current URL (a permalink with forecast parameters) to their clipboard.                    | `navigator.clipboard` Web API              |
| `RetryButton.jsx`   | A simple button displayed on error to allow the user to trigger the data fetch again.                            | -                                          |
| `Attribution.jsx`   | Displays a link to the data source (BBC Weather).                                                                | -                                          |
| `ThemeToggle.jsx`   | A button to toggle the application's color scheme between light and dark mode.                                   | -                                          |

## Component Details

### `ForecastPage.jsx`

This is the central component of the application. It is responsible for:
- Managing the application's global state, including the postcode, indoor temperature, forecast data, loading status, and errors.
- Using the `useUrlParams` custom hook to synchronize state with URL query parameters.
- Fetching data from the BBC Weather API via `bbc-client.js`.
- Processing the raw forecast data and calculating the indoor relative humidity.
- Passing data and state down to child presentational components.

### `ParameterForm.jsx`

A simple form component that captures user input for the postcode and indoor temperature. It receives its state and `onChange` handlers as props from `ForecastPage`.

### `ForecastChart.jsx`

A presentational component that visualizes the forecast data.
- It receives the forecast data as a prop.
- It uses the `recharts` library to render a line chart comparing outdoor and indoor humidity over time.
- It formats the data to be suitable for the chart library.

### `DataTable.jsx`

A component that displays the detailed forecast data points in a structured HTML table.
- It receives the forecast data as a prop.
- The table is scrollable to accommodate a large number of data points.

### `ShareButton.jsx`

This component provides a "Share Permalink" button. When clicked, it uses the `navigator.clipboard` API to copy the current `window.location.href` to the user's clipboard. This allows for easy sharing of the exact forecast view.

### `RetryButton.jsx`

This button is shown when a data fetching error occurs. It receives an `onRetry` function as a prop from `ForecastPage` and calls it when clicked.

### `Attribution.jsx`

A static component that renders a "Data provided by BBC Weather" message with a link.

### `ThemeToggle.jsx`

This component allows the user to switch between a light and a dark theme. It manages its own state and applies a `dark` class to the `<html>` element to enable the dark mode styles defined in the global CSS.
