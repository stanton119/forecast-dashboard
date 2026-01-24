# Data Models

This document outlines the primary data structures and models used throughout the `forecast-site` application.

## 1. Internal Forecast Data Model

This is the main data structure used by most components for rendering charts and tables. It is the result of fetching data from the external API and then processing it to include the calculated indoor humidity.

The model is an array of `ForecastPoint` objects.

### `ForecastPoint` Object

| Field                               | Type   | Description                                                                 | Example                             |
| ----------------------------------- | ------ | --------------------------------------------------------------------------- | ----------------------------------- |
| `timestamp_iso`                     | String | The ISO 8601 formatted timestamp for the data point.                        | `"2023-10-27T12:00:00.000Z"`        |
| `outside_humidity_percent`          | Number | The forecasted outdoor relative humidity as a percentage.                   | `85`                                |
| `outside_temp_c`                    | Number | The forecasted outdoor temperature in Celsius.                              | `14`                                |
| `inside_relative_humidity_percent`  | Number | The calculated indoor relative humidity based on the user's indoor temperature. | `65.3`                              |

## 2. URL State Model

The application state is persisted in the URL query string to allow for permalinks. The `useUrlParams` hook manages this state.

| Parameter      | Type   | Description                                    | Example URL                                  |
| -------------- | ------ | ---------------------------------------------- | -------------------------------------------- |
| `postcode`     | String | The UK postcode for the forecast.              | `/?postcode=SW7&indoorTemp=20`               |
| `indoorTemp`   | Number | The user-defined indoor temperature in Celsius. | `/?postcode=SW7&indoorTemp=20`               |

## 3. External API Data Model (BBC Weather)

This model represents the raw data structure returned by the BBC Weather API. The `bbc-client.js` module uses Zod to parse and validate this structure.

### Zod Schemas

The following Zod schemas are used for validation:

```javascript
// A single report for a specific timeslot
const ReportSchema = z.object({
  localDate: z.string(),
  timeslot: z.string(),
  humidity: z.number(),
  temperatureC: z.number(),
});

// A detailed forecast containing multiple reports
const DetailedSchema = z.object({
  reports: z.array(ReportSchema),
});

// A forecast object
const ForecastSchema = z.object({
  detailed: DetailedSchema,
});

// The top-level response from the BBC API
const BbcResponseSchema = z.object({
  forecasts: z.array(ForecastSchema),
});
```

### Example Raw API Response (Simplified)

```json
{
  "forecasts": [
    {
      "detailed": {
        "reports": [
          {
            "localDate": "2023-10-27",
            "timeslot": "12:00",
            "humidity": 85,
            "temperatureC": 14
          },
          {
            "localDate": "2023-10-27",
            "timeslot": "13:00",
            "humidity": 84,
            "temperatureC": 15
          }
        ]
      }
    }
  ]
}
```
