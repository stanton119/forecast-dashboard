# Tasks: Remove Gemini Attribution

**Input**: Design documents from `/specs/005-remove-gemini-attribution/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---
## Phase 1: Setup (Shared Infrastructure)

No setup tasks are required for this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

No foundational tasks are required for this feature.

---

## Phase 3: User Story 1 - View Correct Weather Attribution (Priority: P1) 🎯 MVP

**Goal**: To ensure the user interface correctly and exclusively attributes weather data to BBC Weather, removing any other source attribution.

**Independent Test**: The application can be run, and the forecast page can be visually inspected or tested via an E2E test to confirm that only the "BBC Weather" attribution is present.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T001 [US1] Update E2E test to verify correct attribution in `tests/e2e/test_default_view.spec.js`

### Implementation for User Story 1

- [x] T002 [US1] Remove Gemini attribution from `src/components/Attribution.jsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase N: Polish & Cross-Cutting Concerns

No polish tasks are required for this feature.

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 3)**: No dependencies.

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately.

### Within Each User Story

- The test task (T001) should be addressed first to confirm the current incorrect state and validate the final change.
- The implementation task (T002) depends on the test being in place.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 3: User Story 1.
2.  **STOP and VALIDATE**: Run the updated E2E test and manually verify the UI.
3.  The feature is complete.
