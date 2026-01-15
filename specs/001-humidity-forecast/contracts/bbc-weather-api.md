# API Contract: BBC Weather

**Date**: 2026-01-12
**Spec**: [/Users/rich/Developer/Github/forecast-site/specs/001-humidity-forecast/spec.md]

This document describes the contract for the external BBC Weather API used by the humidity forecast feature.

## Endpoint

- **URL**: `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/{POST_CODE}`
- **Method**: `GET`
- **`{POST_CODE}`**: A URL-encoded UK postcode.

## Expected Response Shape (Summary)

The API is expected to return a JSON object containing a `forecasts` array. Each object in the array represents a forecast for a specific day and contains a `detailed` array of forecasts for different times of the day.

While the exact structure is complex, the key fields the application will extract from each timeslot forecast are:

- **`localDate`**: The date of the forecast (e.g., "2026-01-12").
- **`timeslot`**: The time of the forecast (e.g., "14:00").
- **`humidity`**: The outdoor humidity percentage (e.g., `80`).
- **`temperatureC`**: The outdoor temperature in Celsius (e.g., `10`).

### Example (Simplified)

```json
{
  "forecasts": [
    {
      "summary": {
        // ...
      },
      "detailed": {
        "reports": [
          {
            "localDate": "2026-01-12",
            "timeslot": "12:00",
            "humidity": 75,
            "temperatureC": 9
            // ... other fields
          },
          {
            "localDate": "2026-01-12",
            "timeslot": "15:00",
            "humidity": 78,
            "temperatureC": 8
            // ... other fields
          }
        ]
      }
    }
  ]
}
```

## Operational Constraints

- **CORS**: The API is assumed to support CORS for client-side `fetch` requests. If not, a proxy will be required.
- **Rate Limiting**: The client should be prepared for rate limiting and implement a retry-with-backoff strategy.
- **Error Handling**: The client must handle non-200 status codes, including 404 for invalid postcodes.
