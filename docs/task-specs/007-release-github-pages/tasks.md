# Tasks: Release Website on GitHub Pages

**Input**: Design documents from `/specs/007-release-github-pages/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The feature specification does not explicitly request new tests for the deployment workflow, but the existing Vitest and Playwright tests will be run as part of the CI process before deployment.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create GitHub Actions workflow file at .github/workflows/deploy-gh-pages.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add workflow name and trigger on push to `main` in .github/workflows/deploy-gh-pages.yml
- [x] T003 Define job to run on `ubuntu-latest` in .github/workflows/deploy-gh-pages.yml
- [x] T004 Add step to checkout repository code using `actions/checkout@v4` in .github/workflows/deploy-gh-pages.yml
- [x] T005 Add step to set up Node.js environment using `actions/setup-node@v4` with version 20 in .github/workflows/deploy-gh-pages.yml
- [x] T006 Add step to install project dependencies using `npm ci` in .github/workflows/deploy-gh-pages.yml
- [x] T007 Add step to build the Astro project using `npm run build` in .github/workflows/deploy-gh-pages.yml

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Automated Deployment on Push to `main` (Priority: P1) 🎯 MVP

**Goal**: The website is automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch.

**Independent Test**: Push a small, visible change to the `main` branch and verify that the live GitHub Pages URL reflects this change after the deployment workflow completes.

### Implementation for User Story 1

- [x] T008 [US1] Add step to deploy static assets to `gh-pages` branch using `peaceiris/actions-gh-pages@v3` in .github/workflows/deploy-gh-pages.yml
- [x] T009 [US1] Configure deployment action to use build output directory (e.g., `dist`) in .github/workflows/deploy-gh-pages.yml
- [x] T010 [US1] Ensure `GITHUB_TOKEN` permissions are correctly configured for deployment in .github/workflows/deploy-gh-pages.yml

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T011 Review `deploy-gh-pages.yml` for security best practices (e.g., least privilege, trusted sources)
- [x] T012 Add comments to `deploy-gh-pages.yml` for clarity and maintainability
- [x] T013 Update `README.md` with instructions on how to set up GitHub Pages for the repository and a link to the deployed site.
- [x] T014 Run `quickstart.md` validation by manually triggering a test push to `main` and verifying the deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Setup (Phase 1)**: No dependencies - can start immediately
-   **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
-   **User Stories (Phase 3+)**: All depend on Foundational phase completion
    -   User stories can then proceed sequentially in priority order (P1)
-   **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

-   **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

-   Core implementation before integration
-   Story complete before moving to next priority

### Parallel Opportunities

-   No significant parallel opportunities are identified due to the sequential nature of building and deploying a single workflow file.

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

---

## Notes

-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
