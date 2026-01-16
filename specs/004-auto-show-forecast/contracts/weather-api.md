# API Contract: Weather Forecast Service

This document outlines the expected interface for fetching weather forecast data. The primary consumer of this API is the front-end application to display automatic forecasts on page load.

## Endpoint

- **GET `/api/weather/forecast`**: Retrieves weather forecast data for a specified location.

## Request Parameters

The location can be specified via URL query parameters. Prioritization rules apply as per feature requirements (URL params > hardcoded default).

- `postcode`: (Optional) String. UK Postcode for location.
- `latitude`: (Optional) Number. Latitude coordinate.
- `longitude`: (Optional) Number. Longitude coordinate.
- `city`: (Optional) String. City name.

Example: `GET /api/weather/forecast?postcode=SW1A0AA` or `GET /api/weather/forecast?latitude=51.5&longitude=0.1`

## Response Body (Success - HTTP 200 OK)

A JSON object containing the forecast data. The structure should align with the `Forecast Data` entity.

```json
{
  "location": {
    "postcode": "SW1A0AA",
    "latitude": 51.5007,
    "longitude": -0.1246,
    "city": "London"
  },
  "forecast": [
    {
      "timestamp": "2026-01-15T12:00:00Z",
      "temperature": 10,
      "humidity": 85,
      "windSpeed": 15,
      "precipitation": 0.5,
      "condition": "Cloudy"
    },
    {
      "timestamp": "2026-01-15T15:00:00Z",
      "temperature": 12,
      "humidity": 80,
      "windSpeed": 10,
      "precipitation": 0.1,
      "condition": "Partly Sunny"
    }
  ]
}
```

## Error Response (HTTP 4xx/5xx)

In case of any error (network, HTTP errors, invalid response from upstream API), a generic error message is expected.

```json
{
  "error": "Forecast data unavailable. Please try again later."
}
```

## Security Considerations

- Ensure API key for upstream weather service is handled securely (server-side, not exposed in client).
- Input validation on all parameters to prevent injection attacks or invalid data processing.

## Rate Limiting

- The backend service calling the external weather API should implement caching and/or rate-limiting to avoid exceeding external API quotas.
