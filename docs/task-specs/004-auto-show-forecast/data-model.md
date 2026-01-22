# Data Model: Auto-show Forecast on Page Load

## Entities

### Forecast Data

Represents the weather forecast information for a specific location and time period.

**Attributes:**

- `temperature`: Numerical value, typically in Celsius or Fahrenheit.
- `humidity`: Percentage (0-100%).
- `windSpeed`: Numerical value, typically in mph or km/h.
- `precipitation`: Numerical value, e.g., in mm or inches.
- `timestamp`: Date and time for the forecast point.
- `condition`: String describing weather condition (e.g., "Sunny", "Partly Cloudy").
- `location`: Reference to a Location entity.

**Validation Rules (from FR-003):**

- Must handle invalid/incomplete data from external API gracefully, displaying a generic error message.

### Location

Represents a geographical point for which forecast data is requested.

**Attributes:**

- `postcode`: String, e.g., "SW1A 0AA" (optional, prioritized if available).
- `latitude`: Numerical value, decimal degrees.
- `longitude`: Numerical value, decimal degrees.
- `city`: String, e.g., "London" (used as default if postcode/lat/lon not available).

**Relationships:**

- `Forecast Data` has a one-to-one relationship with `Location`.

**Validation Rules (from FR-001, FR-004):**

- If valid location parameters are present in the URL, they must be used.
- Otherwise, a hardcoded, static default location must be used.
- URL parameters (e.g., postcode, city) are prioritized and merged with the hardcoded default.
