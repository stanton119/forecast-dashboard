# Feature Specification: Humidity Forecast (single-page)

**Feature Branch**: `001-humidity-forecast`  
**Created**: 2026-01-10  
**Status**: Draft  
**Input**: User description: "Implement the feature specification based on the updated constitution. I want to build a static website that show various forecasts over time. This will initially only include a single page which shows a forecast of humidity over the next few days. It will also have a conversion of that humidity to what the relative humidity will be at a given indoor temperature. So we will have two lines - outdoor and indoor humidity over time. I want the indoor temperature (default of 20C) and UK location postcode (default of SW7) as parameters a user can pass in."

## Clarifications

### Session 2026-01-10


- Forecast API availability: the chosen client-side runtime fetch strategy assumes the external forecast API supports CORS or a public JSON endpoint is available; if not, a small proxy or serverless function will be required.
Integration notes from clarification: client-side runtime fetch selected — the page will fetch forecast data from an external forecast API at runtime in the browser for each view; defaults (SW7, 20°C) are applied client-side when parameters missing.

## Integration & External Dependencies

- **Forecast API (initial)**: `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/{POST_CODE}` — use this endpoint as the primary data source for outdoor humidity and temperature.

- **Expected response shape (observed from examples)**:
  - Top-level object with `forecasts` key.
  - Each forecast contains `detailed.reports[]` where each report includes:
    - `localDate` (ISO date string),
    - `timeslot` (HH:mm or HH format),
    - `humidity` (percent),
    - `temperatureC` (°C).

- **Client-side requirements & constraints**:
  - The client-side fetch approach REQUIRES the API to support CORS for browser requests. If CORS is not available, a small proxy or serverless function will be required to relay requests.
  - Unknown rate limits: implement conservative retry/backoff, local in-browser caching (sessionStorage) for short TTL (e.g., 5–15 minutes), and exponential backoff on 5xx responses.
  - Handle 4xx/5xx responses with user-friendly messages and graceful fallback to cached data when available.

- **Failure modes & diagnostics**:
  - 404/400: invalid postcode — surface clear validation error and suggest corrections.
  - 429/5xx: rate limiting or upstream outage — show retry option and fall back to last-known data if present.
  - Malformed payload: log and surface an error with a suggestion to retry.

- **Security & privacy**:
  - No sensitive keys are required for client-side use of this public endpoint; avoid embedding any secret API keys in client code.

- **Recommendation**: Start with direct client-side fetch for MVP using this BBC endpoint; add a small serverless proxy (or CORS proxy) if the API blocks browser requests or if rate-limiting becomes an issue.

- **Attribution**: The UI MUST display attribution to the data provider (e.g., "Data: BBC Weather") with a link to the provider's site. Attribution SHOULD be visible near the chart or in the page footer and include the data timestamp where practical.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View humidity forecast (Priority: P1)

As a casual user, I want to view a single-page forecast that shows outdoor humidity over the next few days and the corresponding indoor-relative-humidity for a specified indoor temperature and UK postcode, so I can understand expected humidity conditions indoors and outdoors.

**Why this priority**: This delivers the core value (forecast visibility + indoor conversion) and is the MVP.

**Independent Test**: Load the page with default parameters and verify two time-series lines render (outdoor humidity and converted indoor humidity), and that numerical tooltips show expected values.

**Acceptance Scenarios**:

1. **Given** the page is opened with no query parameters, **When** the page loads, **Then** the forecast for postcode `SW7` and indoor temperature `20°C` is displayed with two lines (outdoor, indoor) covering the next 72 hours.
2. **Given** a user supplies a postcode and an indoor temperature, **When** they reload or navigate to the page URL with those parameters, **Then** the chart updates to show forecast and converted indoor humidity for the supplied parameters.

---

### User Story 2 - Adjust parameters and share (Priority: P2)

As a user, I want to change the indoor temperature and postcode parameters and share a permalink so others see the same forecast view.

**Why this priority**: Parameterization and shareability improve usability and repeatability but are not required for the MVP display.

**Independent Test**: Update parameters via the UI or query string and verify the URL reflects choices; loading that URL reproduces the same chart.

**Acceptance Scenarios**:

1. **Given** the user changes indoor temperature to 22°C and postcode to `SW1A`, **When** they copy the URL and open it in a new browser tab, **Then** the new tab shows the same chart for `SW1A` at 22°C.

---

### User Story 3 - Accessibility & export (Priority: P3)

As a user who needs accessible output, I want the chart to include textual summaries and the ability to export the numeric forecast so I can consume it in other tools.

**Why this priority**: Accessibility and export improve usefulness for broader audiences but can follow the MVP.

**Independent Test**: Verify the page includes an accessible data table and that CSV export produces a file with timestamps and both humidity series.

**Acceptance Scenarios**:

1. **Given** a loaded forecast, **When** the user opens the "data" panel, **Then** they see a readable table listing timestamps, outdoor humidity, and indoor-relative-humidity; the CSV export downloads matching data.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Invalid or unparseable postcode: show a clear error and fall back to the default postcode while logging the incident.
- Forecast data unavailable for the requested postcode/time range: surface a user-friendly message and allow retrying.
- Extreme indoor temperature inputs (e.g., <0°C or >50°C): clamp to reasonable bounds and warn the user.
- Time zone differences: timestamps MUST be shown with locale-aware labels and a clear timezone hint.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST render a single public web page that displays a humidity forecast time-series for a given UK postcode.
- **FR-002**: The system MUST accept `postcode` and `indoor_temperature_c` as input parameters (via query string or form) and use them to compute and display both outdoor humidity and converted indoor-relative-humidity series.
- **FR-003**: The system MUST use sensible defaults when parameters are omitted: `postcode=SW7`, `indoor_temperature_c=20`.
- **FR-004**: The system MUST present an accessible tabular view of the forecast data and provide a CSV export of timestamps with both humidity values.
- **FR-005**: The system MUST validate postcode input and surface user-friendly errors if validation fails.
- **FR-006**: The system MUST handle missing forecast data gracefully (retry, informative error, and fallback UI) and record the event for diagnostics.
- **FR-007**: The UI MUST display attribution to the forecast data provider (e.g., "Data: BBC Weather") with a link; attribution should be visible near the chart or in the page footer.

### Key Entities

- **ForecastSeries**: A time-ordered series of humidity measurements (timestamp, outdoor_humidity_percent).
- **IndoorConversion**: Derived series computed from `ForecastSeries` given `indoor_temperature_c` producing `indoor_relative_humidity_percent` per timestamp.
- **UserParameters**: `postcode` (string), `indoor_temperature_c` (number)

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: The page loads and displays the forecast chart within 2 seconds on a typical broadband connection (p95).
- **SC-002**: Default forecast (SW7, 20°C) renders correctly with two series for the next 72 hours on first load in 95% of attempts.
- **SC-003**: Conversion accuracy: computed indoor-relative-humidity values match reference calculations within ±1 percentage point for typical temperatures (10–30°C).
- **SC-004**: Export integrity: CSV exports contain the same timestamps and values shown in the UI; 100% of sampled exports must match displayed values.
