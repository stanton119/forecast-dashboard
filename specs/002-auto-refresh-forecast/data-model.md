# Data Model: Auto Reloading Forecast on Parameter Change

This document outlines the key data entities and their structures relevant to the "Auto Reloading Forecast on Parameter Change" feature.

## 1. UserParameters

Represents the input parameters provided by the user via the UI form. These parameters drive the forecast calculations and API requests.

**Fields**:

- `postcode`:
  - **Type**: String
  - **Description**: The geographical postcode entered by the user. Used for fetching location-specific weather data.
  - **Validation**: Must be a valid UK postcode format (e.g., "SW1A 0AA", "M1 1AE").
- `indoorTemperature`:
  - **Type**: Number (Float or Integer)
  - **Description**: The indoor temperature entered by the user, used in the calculation of indoor relative humidity.
  - **Validation**: Typically a reasonable range for indoor temperatures (e.g., 0-40 Celsius or 32-104 Fahrenheit). Units (C/F) should be consistent or explicitly handled.

## 2. ForecastData

Represents the fetched and processed weather and humidity forecast information. This data is displayed in the forecast chart and data table.

**Fields**:

- `timestamp`:
  - **Type**: Date/Time String (ISO 8601 or similar)
  - **Description**: The specific point in time for which the forecast is valid.
- `outdoorHumidity`:
  - **Type**: Number (Float)
  - **Description**: The predicted outdoor relative humidity percentage at the given timestamp.
  - **Unit**: %RH
- `outdoorTemperature`:
  - **Type**: Number (Float)
  - **Description**: The predicted outdoor temperature at the given timestamp.
  - **Unit**: Celsius (or Fahrenheit, consistent with API)
- `indoorRelativeHumidity`:
  - **Type**: Number (Float)
  - **Description**: The calculated indoor relative humidity percentage, derived from `outdoorTemperature`, `outdoorHumidity`, and `UserParameters.indoorTemperature`.
  - **Unit**: %RH
