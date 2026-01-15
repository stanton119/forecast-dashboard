# Data Model: Humidity Forecast

**Date**: 2026-01-12
**Spec**: [/Users/rich/Developer/Github/forecast-site/specs/001-humidity-forecast/spec.md]

This document outlines the key data entities for the humidity forecast feature, as extracted from the feature specification.

## Core Entities

### 1. UserParameters

Represents the input parameters provided by the user.

- **`postcode`**:

  - **Type**: `string`
  - **Description**: A UK postcode. Used to fetch the forecast data.
  - **Validation**: Permissive regex on the client-side. The definitive validation is the API call.
  - **Default**: `"SW7"`

- **`indoor_temperature_c`**:
  - **Type**: `number`
  - **Description**: The indoor temperature in degrees Celsius, used for the indoor relative humidity conversion.
  - **Validation**: Should be within a reasonable range (e.g., 0-50°C).
  - **Default**: `20`

### 2. ForecastSeries

A time-ordered series of weather forecast data points fetched from the external API.

- **`timestamp_iso`**:
  - **Type**: `string` (ISO 8601)
  - **Description**: The specific date and time for the forecast point.
- **`outside_humidity_percent`**:
  - **Type**: `number`
  - **Description**: The forecasted outdoor humidity as a percentage.
- **`outside_temp_c`**:
  - **Type**: `number`
  - **Description**: The forecasted outdoor temperature in degrees Celsius.

### 3. IndoorConversion

A derived series that represents the calculated indoor relative humidity.

- **`timestamp_iso`**:
  - **Type**: `string` (ISO 8601)
  - **Description**: The specific date and time for the forecast point, aligned with `ForecastSeries`.
- **`inside_relative_humidity_percent`**:
  - **Type**: `number`
  - **Description**: The calculated indoor relative humidity based on the outdoor conditions and the user-provided indoor temperature.

## Relationships

- A `ForecastSeries` is fetched based on the `postcode` from `UserParameters`.
- An `IndoorConversion` series is derived from a `ForecastSeries` and the `indoor_temperature_c` from `UserParameters`. Each data point in the `IndoorConversion` series corresponds to a data point in the `ForecastSeries`.
