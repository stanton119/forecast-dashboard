# Tasks: Auto Reloading Forecast on Parameter Change

**Input**: Design documents from `/specs/002-auto-refresh-forecast/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This plan includes test tasks to ensure comprehensive coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

No new explicit setup tasks are required, as the project structure is already established and foundational utilities will be created in the next phase.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core utilities and initial state management setup that will be used across the feature.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T001 [P] Create a utility directory `src/lib/utils/` if it doesn't exist.
- [X] T002 [P] Create a utility function for debouncing in `src/lib/utils/debounce.js`.

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Auto-Refresh Forecast on Parameter Change (Priority: P1) 🎯 MVP

**Goal**: When the user adjusts the postcode or indoor temperature in the input form, the forecast automatically updates without needing to manually click a "submit" or "refresh" button, so that they can quickly see the impact of their changes on the forecast.

**Independent Test**:
This can be fully tested by changing a parameter (postcode or indoor temperature) in the input form (`src/components/ParameterForm.jsx`) and verifying that the forecast chart (`src/components/ForecastChart.jsx`) and data table (`src/components/DataTable.jsx`) automatically reflect the new parameters within a short timeframe. Verification should also include the appearance and disappearance of the loading indicator, and the correct display of error messages for invalid input or failed API responses.

### Implementation for User Story 1

- [X] T003 [US1] Modify `src/components/ParameterForm.jsx` to internally manage `postcode` and `indoorTemperature` state.
- [X] T004 [US1] Implement debounced change handling for `postcode` input in `src/components/ParameterForm.jsx` using `src/lib/utils/debounce.js`.
- [X] T005 [US1] Implement debounced change handling for `indoorTemperature` input in `src/components/ParameterForm.jsx` using `src/lib/utils/debounce.js`.
- [X] T006 [US1] Expose a callback from `src/components/ParameterForm.jsx` to `src/components/ForecastPage.jsx` for debounced parameter changes.
- [X] T007 [US1] In `src/components/ForecastPage.jsx`, implement state to hold `UserParameters` (postcode, indoor temperature), `ForecastData`, `loading` status, and `error` messages.
- [X] T008 [US1] In `src/components/ForecastPage.jsx`, use React's `useEffect` to trigger `getForecast` from `src/lib/bbc-client.js` whenever `UserParameters.postcode` changes (debounced).
- [X] T009 [US1] In `src/components/ForecastPage.jsx`, manage the `loading` state (set `true` before, `false` after) around `getForecast` calls and indoor humidity calculations.
- [X] T010 [US1] In `src/components/ForecastPage.jsx`, implement error handling for `getForecast` failures (e.g., invalid postcode) and set the `error` state.
- [X] T011 [US1] In `src/components/ForecastPage.jsx`, use React's `useEffect` to trigger indoor humidity calculation (`calculateIndoorHumidity` from `src/lib/humidity.js`) whenever `ForecastData.outdoorTemperature`, `ForecastData.outdoorHumidity`, or `UserParameters.indoorTemperature` changes.
- [X] T012 [US1] Pass `ForecastData`, `loading` status, and `error` messages from `src/components/ForecastPage.jsx` down to `src/components/ForecastChart.jsx` and `src/components/DataTable.jsx`.
- [X] T013 [US1] Modify `src/components/ForecastChart.jsx` to display `ForecastData` and conditionally show a loading indicator based on the `loading` state.
- [X] T014 [US1] Modify `src/components/DataTable.jsx` to display `ForecastData` and conditionally show a loading indicator based on the `loading` state.
- [X] T015 [US1] Implement display of user-friendly `error` messages in `src/components/ForecastPage.jsx` (or a sub-component) when the `error` state is set.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories or overall quality.

- [X] T016 [P] Add E2E tests for auto-refresh functionality in `tests/e2e/test_auto_refresh.spec.js`, covering the acceptance scenarios (postcode change, temp change, both, loading, error).
- [X] T017 [P] Add unit tests for the new debounce utility in `tests/unit/test_debounce.test.js`.
- [X] T018 Review and refine UI/UX for loading states and error messages, ensuring consistency and responsiveness.
- [X] T019 Verify performance against SC-001 (forecast update within 2 seconds) and SC-003 (loading indicator within 0.5 seconds).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.

### Within Each User Story

- Core implementation tasks should generally precede UI display tasks if they provide the data.
- Debounce utility creation (T002) should precede its use in ParameterForm (T004, T005).
- State management setup (T007) should precede its usage for data fetching and display.

### Parallel Opportunities

- T001 and T002 in Foundational phase can run in parallel.
- Tasks T003-T006 related to `ParameterForm.jsx` and its integration with `ForecastPage.jsx` can be worked on in parallel.
- Tasks T007-T011 related to data fetching, loading, error handling, and indoor humidity calculation in `ForecastPage.jsx` can be parallelized.
- Tasks T012-T015 related to UI updates and error message display in `ForecastChart.jsx`, `DataTable.jsx`, and `ForecastPage.jsx` can be parallelized.
- All tasks in the Polish phase marked [P] can run in parallel (T016, T017).

---

## Parallel Example: User Story 1 (Implementation)

```bash
# Foundational tasks (can be parallelized):
- [ ] T001 Create a utility directory src/lib/utils/ if it doesn't exist.
- [ ] T002 Create a utility function for debouncing in src/lib/utils/debounce.js.

# Implementation tasks for User Story 1 (can be parallelized within logical groups):
# Group 1: ParameterForm and its integration
- [ ] T003 [US1] Modify src/components/ParameterForm.jsx to internally manage postcode and indoorTemperature state.
- [ ] T004 [US1] Implement debounced change handling for postcode input in src/components/ParameterForm.jsx using src/lib/utils/debounce.js.
- [ ] T005 [US1] Implement debounced change handling for indoorTemperature input in src/components/ParameterForm.jsx using src/lib/utils/debounce.js.
- [ ] T006 [US1] Expose a callback from src/components/ParameterForm.jsx to src/components/ForecastPage.jsx for debounced parameter changes.

# Group 2: ForecastPage logic (data fetching, state management, error handling)
- [ ] T007 [US1] In src/components/ForecastPage.jsx, implement state to hold UserParameters, ForecastData, loading status, and error messages.
- [ ] T008 [US1] In src/components/ForecastPage.jsx, use React's useEffect to trigger getForecast from src/lib/bbc-client.js whenever UserParameters.postcode changes (debounced).
- [ ] T009 [US1] In src/components/ForecastPage.jsx, manage the loading state (set true before, false after) around getForecast calls and indoor humidity calculations.
- [ ] T010 [US1] In src/components/ForecastPage.jsx, implement error handling for getForecast failures (e.g., invalid postcode) and set the error state.
- [ ] T011 [US1] In src/components/ForecastPage.jsx, use React's useEffect to trigger indoor humidity calculation (calculateIndoorHumidity from src/lib/humidity.js) whenever ForecastData.outdoorTemperature, ForecastData.outdoorHumidity, or UserParameters.indoorTemperature changes.

# Group 3: UI Updates and error display
- [ ] T012 [US1] Pass ForecastData, loading status, and error messages from src/components/ForecastPage.jsx down to src/components/ForecastChart.jsx and src/components/DataTable.jsx.
- [ ] T013 [US1] Modify src/components/ForecastChart.jsx to display ForecastData and conditionally show a loading indicator based on the loading state.
- [ ] T014 [US1] Modify src/components/DataTable.jsx to display ForecastData and conditionally show a loading indicator based on the loading state.
- [ ] T015 [US1] Implement display of user-friendly error messages in src/components/ForecastPage.jsx (or a sub-component) when the error state is set.

# Polish tasks (can be parallelized):
- [ ] T016 [P] Add E2E tests for auto-refresh functionality in tests/e2e/test_auto_refresh.spec.js.
- [ ] T017 [P] Add unit tests for the new debounce utility in tests/unit/test_debounce.test.js.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundational together
2. Once Foundational is done:
   - Developer A: ParameterForm modifications (T003-T006)
   - Developer B: ForecastPage logic (T007-T011)
   - Developer C: UI updates and error display (T012-T015)
   - Developer D: Testing (T016, T017)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
