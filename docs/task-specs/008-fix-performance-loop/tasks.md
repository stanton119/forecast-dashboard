# Tasks: Fix Performance Loop

**Input**: Design documents from `/specs/008-fix-performance-loop/`
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

**Purpose**: Project initialization and basic structure

- [x] T001 Verify development environment setup per `quickstart.md`
- [x] T002 Ensure project dependencies are installed by running `npm install`
- [ ] T003 Verify `npm run dev` starts the application successfully

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Identify relevant API call sites in `src/lib/bbc-client.js`
- [x] T005 Analyze React components in `src/components/` (e.g., `ForecastPage.jsx`) that consume forecast data
- [x] T006 Pinpoint the exact conditions triggering redundant calls or infinite loops based on network tab observations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Stable Forecast Display (Priority: P1) 🎯 MVP

**Goal**: The application displays the weather forecast without noticeable performance degradation, repeating data calls, or infinite loops.

**Independent Test**: The application loads the forecast page successfully without freezing or excessive network requests, and the displayed data remains consistent.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Write unit test for `src/lib/utils/debounce.js` to ensure proper debouncing behavior in `tests/unit/test_debounce.test.js`
- [ ] T008 [P] [US1] Write unit test for request cancellation logic in `src/lib/bbc-client.js` in `tests/unit/test_bbc_client.test.js` (or new test file if needed)
- [ ] T009 [US1] Write E2E test to verify single API call on initial load in `tests/e2e/test_stable_forecast.spec.js`
- [ ] T010 [US1] Write E2E test to verify no excessive calls on UI interaction in `tests/e2e/test_stable_forecast.spec.js`
- [ ] T011 [US1] Write E2E test to detect infinite loop behavior in `tests/e2e/test_stable_forecast.spec.js`

- [x] T012 [P] [US1] Implement or enhance debouncing logic for API calls in `src/lib/utils/debounce.js`
- [ ] T013 [US1] Integrate debouncing into API calls in `src/lib/bbc-client.js`
- [ ] T014 [P] [US1] Implement request cancellation mechanism in `src/lib/bbc-client.js`
- [x] T015 [US1] Integrate request cancellation into data fetching hooks/components in `src/components/ForecastPage.jsx` (and potentially other relevant components)
- [x] T016 [US1] Refine React effect hooks (e.g., `useEffect`) in `src/components/ForecastPage.jsx` to correctly manage data fetching lifecycle and dependencies

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Efficient Resource Usage (Priority: P2)

**Goal**: The application minimizes CPU and network resource consumption when displaying and updating forecast data, avoiding excessive calls to the backend API.

**Independent Test**: Monitor network activity and CPU usage while the application runs; they should remain within expected low thresholds during stable operation.

### Tests for User Story 2

- [ ] T017 [P] [US2] Write unit tests for URL parameter comparison logic to prevent unnecessary re-fetches in `tests/unit/test_param_utils.test.js` (or new test file if needed)
- [ ] T018 [US2] Write E2E test to monitor network requests count for different URL parameter changes in `tests/e2e/test_resource_usage.spec.js`
- [ ] T019 [US2] Write E2E test to monitor general page responsiveness and CPU usage using Playwright performance APIs in `tests/e2e/test_resource_usage.spec.js`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement or enhance URL parameter comparison logic in `src/lib/utils/param-utils.js` (or new utility file) to determine if a new fetch is truly required
- [ ] T021 [US2] Integrate parameter comparison into data fetching components in `src/components/ForecastPage.jsx` to prevent unnecessary API calls
- [ ] T022 [US2] Optimize state updates and component re-renders related to forecast data to minimize CPU usage in `src/components/ForecastPage.jsx`
- [ ] T023 [US2] Implement graceful error handling and retry mechanisms for API slow/unavailable or network disconnection edge cases in `src/lib/bbc-client.js` and `src/components/ForecastPage.jsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T024 Perform a final code review for clarity, maintainability, and adherence to project standards.
- [ ] T025 Run all unit and E2E tests to ensure full regression coverage.
- [ ] T026 Run `quickstart.md` validation to ensure the reproduction and verification steps are accurate and easy to follow.

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Setup (Phase 1)**: No dependencies - can start immediately
-   **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
-   **User Stories (Phase 3+)**: All depend on Foundational phase completion
    -   User stories can then proceed in parallel (if staffed)
    -   Or sequentially in priority order (P1 → P2 → P3)
-   **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

-   **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
-   **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

-   Tests (if included) MUST be written and FAIL before implementation
-   Core implementation before integration
-   Story complete before moving to next priority

### Parallel Opportunities

-   All Setup tasks marked [P] can run in parallel
-   All Foundational tasks marked [P] can run in parallel (within Phase 2)
-   Once Foundational phase completes, both User Story 1 and User Story 2 could be worked on in parallel by different team members (if team capacity allows)
-   All tests for a user story marked [P] can run in parallel
-   Specific implementation tasks within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
- [ ] T007 [P] [US1] Write unit test for `src/lib/utils/debounce.js` to ensure proper debouncing behavior in `tests/unit/test_debounce.test.js`
- [ ] T008 [P] [US1] Write unit test for request cancellation logic in `src/lib/bbc-client.js` in `tests/unit/test_bbc_client.test.js` (or new test file if needed)

# Launch parallel implementation tasks for User Story 1:
- [ ] T012 [P] [US1] Implement or enhance debouncing logic for API calls in `src/lib/utils/debounce.js`
- [ ] T014 [P] [US1] Implement request cancellation mechanism in `src/lib/bbc-client.js`
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
3.  Add User Story 2 → Test independently → Deploy/Demo
4.  Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together
2.  Once Foundational is done:
    -   Developer A: User Story 1
    -   Developer B: User Story 2
3.  Stories complete and integrate independently

---

## Notes

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence