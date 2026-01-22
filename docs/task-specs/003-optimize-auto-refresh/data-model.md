# Data Model: Optimize Auto-Refresh API Calls

## Entities

### ForecastData

- **Purpose**: To store and represent weather forecast information, encompassing both data retrieved from external APIs (outdoor conditions) and values derived through client-side calculations (indoor conditions).
- **Attributes**:
  - `id`: `String` - A unique identifier for a specific forecast dataset (e.g., a hash based on input parameters).
  - `outdoorTemperature`: `Number` - The primary outdoor temperature value fetched from the weather API (e.g., in Celsius).
  - `indoorTemperature`: `Number` - The calculated indoor temperature, derived from `outdoorTemperature` and user-defined indoor `Parameters` (e.g., in Celsius).
  - `location`: `String` - The geographical location for which the forecast is made (e.g., postcode, city name).
  - `dateRange`: `Object` - Defines the period covered by the forecast.
    - `startDate`: `Date` - The beginning of the forecast period.
    - `endDate`: `Date` - The end of the forecast period.
  - `timestamp`: `Date` - The exact date and time when this `ForecastData` was last fetched or calculated.
  - `otherForecastAttributes`: `Object` - A collection of additional weather attributes (e.g., humidity, wind speed, precipitation chance) that are part of the overall forecast but are not directly modified by the current feature.
- **Relationships**:
  - Influenced by `Parameters`: The `ForecastData` is generated based on the current set of `Parameters`.
  - Displayed in UI: The `ForecastData` is rendered to the user interface.
- **Validation Rules**:
  - `outdoorTemperature`: Must be a valid number within a plausible range (e.g., -50 to +50 Celsius).
  - `indoorTemperature`: Must be a valid number within a plausible range.
  - `location`: Must be a non-empty string.
  - `dateRange`: `startDate` must be before or equal to `endDate`; both must be valid dates.

### Parameters

- **Purpose**: To capture and manage all user-configurable inputs that influence either the fetching of external weather data or the client-side calculation of indoor conditions.
- **Attributes**:
  - `postcode`: `String` - A geographical identifier used to fetch location-specific weather data.
  - `date`: `Date` - The specific date or start date for which the forecast is requested.
  - `indoorTemperatureOffset`: `Number` - A user-defined value that adjusts the indoor temperature calculation.
  - `insulationValue`: `Number` - A user-defined value representing the insulation quality, influencing indoor temperature calculation.
  - `autoRefreshInterval`: `Number` - The time interval (in seconds) between automatic forecast updates.
- **Categorization**:
  - **Outdoor Parameters**:
    - `postcode`
    - `date`
    - _Changes to these attributes require a new external API call to fetch updated `ForecastData`._
  - **Indoor Parameters**:
    - `indoorTemperatureOffset`
    - `insulationValue`
    - _Changes to these attributes trigger only a client-side recalculation of `indoorTemperature` within the existing `ForecastData`, without an external API call._
- **Validation Rules**:
  - `postcode`: Must match a defined format (e.g., UK postcode regex).
  - `date`: Must be a valid date, possibly within a future range.
  - `indoorTemperatureOffset`: Must be a number within a reasonable range (e.g., -10 to +10).
  - `insulationValue`: Must be a number within a reasonable range (e.g., 0 to 100).
  - `autoRefreshInterval`: Must be a positive integer (e.g., 30 to 300 seconds).
