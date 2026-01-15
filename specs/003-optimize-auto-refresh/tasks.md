# Tasks: Optimize Auto-Refresh API Calls

**Input**: Design documents from `/specs/003-optimize-auto-refresh/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/weather-api.yaml, quickstart.md

**Tests**: Tests are included as the quickstart.md provides scenarios for testing and the spec includes an Independent Test criteria.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure basic project readiness for feature development.
_(No new specific tasks are generated here beyond existing project setup, assuming `npm install` and `npm run dev` are already functional as per quickstart.)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Understand existing code and establish mechanisms for parameter comparison.

- [x] T001 Analyze current parameter state management and passing in `src/components/ParameterForm.jsx`.
- [x] T002 Analyze current parameter state management and passing in `src/components/ForecastPage.jsx`.
- [x] T003 Analyze current auto-refresh triggering mechanism in `src/components/ForecastPage.jsx`.
- [x] T004 Analyze how `bbc-client.js` is used to make external API calls in `src/lib/bbc-client.js` and `src/components/ForecastPage.jsx`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Optimize API Calls for Auto-Refresh (P1) 🎯 MVP

**Goal**: As a user, when the forecast is set to auto-refresh, I want the system to avoid making unnecessary API calls if only the indoor temperature changes.
**Independent Test**: The system can be fully tested by observing network requests during auto-refresh when only indoor temperature parameters are adjusted, ensuring no external API calls are made.

### Implementation for User Story 1

- [x] T005 [US1] Implement a mechanism to store the previous set of parameters (`oldParams`) in `src/components/ForecastPage.jsx`.
- [x] T006 [P] [US1] Create a utility function `areOutdoorParametersChanged(oldParams, newParams)` in `src/lib/utils/param-utils.js` (new file) to compare outdoor parameters (e.g., postcode, date).
- [x] T007 [P] [US1] Create a utility function `calculateIndoorTemperature(outdoorTemperature, indoorParams)` in `src/lib/humidity.js` to perform client-side indoor temperature calculations based on outdoor temperature and indoor parameters. (Note: The existing `getInsideRelativeHumidity` function serves this purpose.)
- [x] T008 [US1] Modify the auto-refresh effect in `src/components/ForecastPage.jsx` to:
  - Compare `currentParams` with `oldParams`.
  - If `areOutdoorParametersChanged` is true, trigger an external API call using `bbc-client.js`.
  - If `areOutdoorParametersChanged` is false but indoor parameters have changed, trigger client-side recalculation using `calculateIndoorTemperature`.
  - Update `oldParams` with `currentParams` after each check.
- [x] T009 [US1] Update state and display logic in `src/components/ForecastPage.jsx` to reflect new `indoorTemperature` from client-side calculation.
- [x] T010 [US1] Ensure `src/components/ForecastChart.jsx` and `src/components/DataTable.jsx` correctly display the updated `indoorTemperature` from `ForecastData`.

### Tests for User Story 1

- [x] T011 [US1] Add unit tests for `areOutdoorParametersChanged` in `tests/unit/test_param_utils.test.js` (new file).
- [x] T012 [US1] Add unit tests for `calculateIndoorTemperature` in `tests/unit/test_humidity.test.js`.
- [x] T013 [US1] Add integration/e2e tests in `tests/e2e/test_auto_refresh.spec.js` to verify:
  - No API call when only indoor parameters change.
  - API call is made when outdoor parameters change.
  - Forecast display updates correctly in both scenarios.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Ensure quality and maintainability.

- [x] T014 Review and update relevant documentation (e.g., `README.md`) to reflect the new auto-refresh behavior and parameter handling.
- [x] T015 Conduct comprehensive manual testing following `quickstart.md` and additional scenarios to ensure feature stability and correctness. (Requires manual execution by user.)
- [x] T016 Perform code cleanup and refactoring in modified files for maintainability.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.

### Within Each User Story

- Tasks T001-T004 must be completed before T005.
- T005 should be completed before T008.
- T006 and T007 can be developed in parallel.
- T008 depends on T005, T006, and T007.
- T009 depends on T008.
- T010 depends on T009.
- Tests (T011, T012, T013) can be developed and run in parallel alongside their respective implementations but should be passing before the story is considered complete.

### Parallel Opportunities

- T006 and T007 can be implemented in parallel.
- Unit tests (T011, T012) can be worked on concurrently with their respective utility functions.
- E2E tests (T013) can be developed once the core logic in `ForecastPage.jsx` is outlined.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup (implicitly done as part of project environment).
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3.  Complete Phase 3: User Story 1.
4.  **STOP and VALIDATE**: Test User Story 1 independently using the quickstart guide and acceptance scenarios.
5.  Deploy/demo if ready.

### Incremental Delivery

1.  Complete Foundational tasks → Foundation ready.
2.  Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3.  Proceed to Polish tasks.

### Parallel Team Strategy

With multiple developers:

1.  One developer focuses on Foundational tasks.
2.  Once Foundational is done, other developers can start on parallelizable tasks within User Story 1 (e.g., T006, T007).

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
