# Tasks: Humidity Forecast

**Input**: Design documents from `/specs/001-humidity-forecast/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are included as requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---
## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install and configure Tailwind CSS in `astro.config.mjs` and `tailwind.config.mjs`
- [x] T002 [P] Configure linting and formatting with `.eslintrc.cjs` and `.prettierrc`
- [x] T003 [P] Create a `ThemeToggle.jsx` component in `src/components/ThemeToggle.jsx` for light/dark theme support.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create a test file for the BBC client in `tests/unit/test_bbc_client.test.js`
- [x] T005 Implement the BBC Weather API client in `src/lib/bbc-client.js`
- [x] T006 [P] Create a test file for humidity conversion logic in `tests/unit/test_humidity.test.js`
- [x] T007 Implement the humidity conversion logic in `src/lib/humidity.js`
- [x] T008 [P] Create a test file for postcode validation in `tests/unit/test_postcode.test.js`
- [x] T009 Implement postcode validation logic in `src/lib/postcode.js`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View humidity forecast (Priority: P1) 🎯 MVP

**Goal**: As a casual user, I want to view a single-page forecast that shows outdoor humidity over the next few days and the corresponding indoor-relative-humidity for a specified indoor temperature and UK postcode, so I can understand expected humidity conditions indoors and outdoors.

**Independent Test**: Load the page with default parameters and verify two time-series lines render (outdoor humidity and converted indoor humidity), and that numerical tooltips show expected values.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [US1] Create an E2E test to load the page with default parameters and verify the chart in `e2e/test_default_view.spec.js`

### Implementation for User Story 1

- [x] T011 [US1] Create the main page structure in `src/pages/index.astro`
- [x] T012 [P] [US1] Create the `ForecastChart.jsx` component in `src/components/ForecastChart.jsx`
- [x] T013 [P] [US1] Create the `ParameterForm.jsx` component in `src/components/ParameterForm.jsx`
- [x] T014 [P] [US1] Create the `Attribution.jsx` component in `src/components/Attribution.jsx`
- [x] T015 [US1] Implement the client-side logic in `src/pages/index.astro` to fetch data and pass it to the React components.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Adjust parameters and share (Priority: P2)

**Goal**: As a user, I want to change the indoor temperature and postcode parameters and share a permalink so others see the same forecast view.

**Independent Test**: Update parameters via the UI or query string and verify the URL reflects choices; loading that URL reproduces the same chart.

### Tests for User Story 2 ⚠️

- [x] T016 [US2] Review and adapt the existing E2E test for permalinks in `e2e/test_permalink.spec.js`

### Implementation for User Story 2

- [x] T017 [US2] Implement state management for parameters in `src/components/ParameterForm.jsx`
- [x] T018 [P] [US2] Implement URL generation logic in `src/lib/url.js`
- [x] T019 [P] [US2] Create the `ShareButton.jsx` component in `src/components/ShareButton.jsx`
- [x] T020 [US2] Integrate the parameter form, share button, and URL logic in `src/pages/index.astro`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Accessibility & export (Priority: P3)

**Goal**: As a user who needs accessible output, I want the chart to include textual summaries and the ability to export the numeric forecast so I can consume it in other tools.

**Independent Test**: Verify the page includes an accessible data table and that CSV export produces a file with timestamps and both humidity series.

### Tests for User Story 3 ⚠️

- [x] T021 [US3] Create an E2E test to verify the data table and CSV export in `e2e/test_export.spec.js`
- [ ] T022 [P] [US3] Create a unit test for CSV formatting in `tests/unit/test_export_format.test.js`

### Implementation for User Story 3

- [x] T023 [P] [US3] Create the `DataTable.jsx` component in `src/components/DataTable.jsx`
- [x] T024 [P] [US3] Implement CSV export logic in `src/lib/exportCsv.js`
- [x] T025 [US3] Add the data table and an export button to `src/pages/index.astro`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T026 [P] Review and enhance the responsive design across all components.
- [x] T027 [P] Add ARIA attributes and ensure accessibility best practices are met.
- [x] T028 Run all tests (`npm run test` and `npm run test:e2e`) to ensure no regressions.
- [x] T029 Validate the deployment process by building the site and serving it locally.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- All tasks marked [P] can be worked on in parallel within their respective phases.
- Once the Foundational phase is complete, work on all User Stories can begin in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 → Test independently.
3. Add User Story 2 → Test independently.
4. Add User Story 3 → Test independently.

---