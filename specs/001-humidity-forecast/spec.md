# Feature Specification: Humidity Forecast (single-page)

**Feature Branch**: `001-humidity-forecast`
**Created**: 2026-01-10
**Status**: Draft
**Input**: User description: "Implement the feature specification based on the updated constitution. I want to build a static website that shows various forecasts over time. This will initially include a single page which shows a forecast of humidity over the next few days, and a conversion of that humidity to the expected indoor-relative-humidity for a given indoor temperature. Defaults: `indoor_temperature_c=20`, `postcode=SW7`."

## Clarifications

### Session 2026-01-10

- Forecast API availability: the chosen client-side runtime fetch strategy assumes the external forecast API supports CORS or a public JSON endpoint is available; if not, a small proxy or serverless function will be required.
  Integration notes from clarification: client-side runtime fetch selected — the page will fetch forecast data from an external forecast API at runtime in the browser for each view; defaults (SW7, 20°C) are applied client-side when parameters missing.

## Integration & External Dependencies

- **Forecast data provider (initial)**: BBC Weather public data via the aggregated forecast endpoint. The weather data MUST be fetched from:

  ```
  https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/{POST_CODE}
  ```

  where `{POST_CODE}` is replaced with the user's supplied postcode (URL-encoded as necessary).

- **Expected response shape (summary)**:

  - A time-ordered collection of forecast reports. Each report contains a local date, a timeslot, an outdoor humidity value (percent) and an outdoor temperature value (°C).

- **Operational constraints**:

  - The client should gracefully handle upstream rate limits and transient errors (retry with backoff and sensible local caching).
  - Validation and user-friendly error messages are required for invalid inputs and upstream failures.

- **Attribution**: The UI MUST display attribution to the data provider (e.g., "Data: BBC Weather") with a visible link and a data timestamp where practical.

## Data & Export Format (clarifications)

- **Parameter naming**: The canonical parameter names for the system are `postcode` (string) and `indoor_temperature_c` (number). All code, UI, query-strings and tests MUST use these exact identifiers.

- **Cache TTL**: Client-side caching TTL for forecast responses MUST be 10 minutes (600 seconds). Cache helpers will expose this TTL and tests will assert TTL behavior.

- **Timestamp construction**: Compose timestamps by combining `localDate` (YYYY-MM-DD) and `timeslot` (HH or HH:mm) as local time for the forecast location. Normalize timestamps to ISO 8601 with an explicit timezone when displaying or exporting (e.g., `2026-01-10T14:00:00+00:00`). The UI SHOULD indicate the timezone used.

- **CSV export schema**: CSV exports MUST include the following columns in order: `timestamp_iso` (ISO 8601 with timezone), `outside_humidity_percent` (integer or one decimal), `inside_relative_humidity_percent` (integer or one decimal), `outside_temp_c` (°C, one decimal). Numeric values SHOULD be rounded to one decimal place. Tests MUST validate CSV headers and value formatting.

- **Postcode validation**: Implement a conservative UK postcode validation strategy: prefer a simple, permissive regex for UI validation (e.g., allow alphanumeric plus optional space) and rely on API response for exact locality validation. On client-side validation failure, show an inline validation error and do not call the API. On API 404 for unknown postcode, surface a clear error and suggest trying a different postcode.

- **Test-First enforcement**: Per the Constitution, work MUST follow a test-first approach. Before implementing any non-trivial feature task, developers MUST add tests that demonstrate the expected behaviour and confirm they fail initially. CI MUST be configured to check that tests exist for new code and pass before merge (see `plan.md` and `tasks.md` updates).

## User Scenarios & Testing _(mandatory)_

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

## Design & Visual Style (new)

The product must use a clean, modern website template that prioritises clarity, readability and responsiveness. This is a design requirement (WHAT and WHY), not an implementation HOW.

- **Overall intent**: a minimal, contemporary aesthetic with generous whitespace, clear typographic hierarchy, and focused content that highlights the forecast chart and controls.
- **Responsiveness**: mobile-first responsive design; primary flows must work on narrow viewports without horizontal scrolling.
- **Color & contrast**: neutral, lightly saturated palette with strong contrast between text and background; colour usage for data-series must be distinguishable for colour-blind users.
- **Typography**: legible fonts, clear hierarchy (H1, H2, body, captions); comfortable line-length and spacing.
- **Components**: consistent header, footer, form controls, chart container, data table, export button, permalink controls, and attribution area. Controls should be touch-friendly on mobile.
- **Layout**: prominent chart area above the fold on desktop, with parameter controls and export/permalink controls nearby; data table accessible via a toggled panel or section.
- **Visual polish**: subtle elevation, smooth spacing, clear micro-interactions for hover/focus, and visible focus states for keyboard navigation.
- **Branding & theming**: template should be easily brandable (logo spot, primary accent colour) and support an optional light/dark theme.
- **Accessibility**: meet WCAG AA contrast for text, provide keyboard focus order, and ensure chart data is available via accessible table/ARIA where appropriate.

### Design Acceptance Scenarios

1. **Given** the site loads on a mobile device, **When** the page is viewed, **Then** the chart, controls, and attribution are usable without horizontal scrolling and controls are finger-sized.
2. **Given** a colour-blind user, **When** they view the chart, **Then** the two data series remain distinguishable (patterns, markers, or colour choices) and a legend is available.

## Requirements _(mandatory)_

## Requirements _(mandatory)_

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
- **FR-008 (Design Template)**: The UI MUST use a clean, modern website template as described in the "Design & Visual Style" section. The template requirement is technology-agnostic and testable via the Design Acceptance Scenarios.

### Key Entities

- **ForecastSeries**: A time-ordered series of humidity measurements (timestamp, outdoor_humidity_percent).
- **IndoorConversion**: Derived series computed from `ForecastSeries` given `indoor_temperature_c` producing `indoor_relative_humidity_percent` per timestamp.
- **UserParameters**: `postcode` (string), `indoor_temperature_c` (number)

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: The page loads and displays the forecast chart within 2 seconds on a typical broadband connection (p95).
- **SC-002**: Default forecast (SW7, 20°C) renders correctly with two series for the next 72 hours on first load in 95% of attempts.
- **SC-003**: Conversion accuracy: computed indoor-relative-humidity values match reference calculations within ±1 percentage point for typical temperatures (10–30°C).
- **SC-004**: Export integrity: CSV exports contain the same timestamps and values shown in the UI; 100% of sampled exports must match displayed values.

## Assumptions

- Template choices are design-time decisions; the spec avoids prescribing frameworks or libraries to keep the requirement implementation-agnostic.
- The design guideline expects the implementer to select an appropriate accessible template or adapt a lightweight UI kit without changing the functional behaviour described elsewhere in this spec.
