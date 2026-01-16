# Tasks: Auto-show Forecast on Page Load

**Input**: Design documents from `/specs/004-auto-show-forecast/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project setup and dependencies.

- [x] T001 Verify project dependencies are installed and configured according to `package.json`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core infrastructure for location handling, API client, and error management, enabling any user story that requires forecast data.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

- [x] T002 Implement `getLocationFromUrlParams(url)` utility function in `src/lib/url.js` to parse postcode, lat/lon from URL parameters (FR-001, FR-004)
- [x] T003 Implement `getDefaultLocation()` utility function in `src/lib/location.js` (or similar) to provide a hardcoded default location (FR-001)
- [x] T004 Implement `determinePrioritizedLocation(urlParams, defaultLocation)` in `src/lib/location.js` (or similar) to merge and prioritize location sources (FR-004)
- [x] T005 Refactor `src/lib/bbc-client.js` to accept a `Location` object (or equivalent parameters) and handle API calls, including network and HTTP error handling (FR-003, Contracts/weather-api.md)
- [x] T006 Implement a generic error handling mechanism for API failures, returning a user-friendly message "Forecast data unavailable. Please try again later." (FR-003)
- [x] T007 Implement a "Retry" mechanism/component that can be triggered after an API failure (FR-003)

## Phase 3: User Story 1 - Automatic Forecast Display (Priority: P1) 🎯 MVP

**Goal**: Automatically display weather forecast data for the determined location immediately upon page load, ensuring a fast and smooth user experience.

**Independent Test**: Open the application in a web browser and verify that forecast data appears on the screen without clicking any buttons or submitting any forms. Also, verify no loading spinner or empty state is visible for more than 1 second.

### Implementation for User Story 1

- [x] T008 [US1] Modify `src/pages/index.astro` (or `src/components/ForecastPage.jsx`) to trigger forecast data fetch on page load using the location determination logic and API client (FR-001)
- [x] T009 [US1] Update `src/components/ForecastPage.jsx` to manage loading states, ensuring perceived instant load (<1 second) (FR-002, SC-002)
- [x] T010 [US1] Integrate the generic error message and "Retry" component into `src/components/ForecastPage.jsx` for API failures (FR-003)
- [x] T011 [US1] Ensure `src/components/ForecastChart.jsx` and `src/components/DataTable.jsx` correctly display the fetched `Forecast Data` (Data-model.md)
- [x] T012 [US1] Update `src/pages/index.astro` to pass determined location and fetched forecast data to `ForecastPage` component.

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Refine the user experience, ensure performance, and validate the feature.

- [x] T013 [P] Review `src/pages/index.astro` and `src/components/ForecastPage.jsx` for optimal performance to meet the <1 second perceived load time (SC-001, SC-002)
- [x] T014 [P] Update documentation (`README.md` or a new feature-specific doc) with details on default location configuration and URL parameter usage.
- [x] T015 Run automated end-to-end tests (`npm run test:e2e`) and verify all relevant tests pass (`tests/e2e/test_auto_refresh.spec.js`, `tests/e2e/test_default_view.spec.js`)
- [x] T016 Perform manual verification using `quickstart.md` to ensure all acceptance criteria are met.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) depends on Foundational (Phase 2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete (User Story 1 in this case)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T004, T005, T006, T007 in Phase 2 can have their initial implementations worked on in parallel, but will likely require sequential integration testing.
- T008, T009, T010, T011, T012 within User Story 1 are largely sequential for full integration.
- T013, T014 in Polish phase can be done in parallel.

---

## Parallel Example: User Story 1

```bash
# While T002, T003, T004 (location logic) are being refined,
# T005, T006, T007 (API client & error handling) can be independently developed.

# Example parallel tasks in polish:
Task: "Review src/pages/index.astro and src/components/ForecastPage.jsx for optimal performance to meet the <1 second perceived load time"
Task: "Update documentation (README.md or a new feature-specific doc) with details on default location configuration and URL parameter usage."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1
4.  **STOP and VALIDATE**: Test User Story 1 independently
5.  Deploy/demo if ready

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready
2.  Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3.  Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together
2.  Once Foundational is done, User Story 1 can be developed by a dedicated team member.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
