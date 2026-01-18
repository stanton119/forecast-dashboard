# Implementation Plan: Remove Gemini Attribution

## 1. Technical Context

-   **Feature**: Remove the "Powered by Gemini" attribution text from the user interface.
-   **Affected Components**:
    -   `src/components/Attribution.jsx`: This component contains the attribution text and will be modified.
-   **Dependencies**: No new dependencies. This work involves removing code.
-   **Integrations**: No external integrations are affected.

## 2. Constitution Check

-   **I. Spec-Driven Development**: Compliant. This plan is derived from an approved specification.
-   **II. Test-Driven Development (TDD)**: Compliant. The implementation will include a verification step and updates to E2E tests to ensure the attribution is correct.
-   **III. Modular & Reusable Components**: Compliant. The change is isolated to the existing `Attribution.jsx` component.
-   **IV. Client-Side First**: Compliant. The change is a client-side UI modification.
-   **V. Clear and Consistent UI/UX**: Compliant. This change directly supports this principle by ensuring attribution is clear and not confusing.

**Result**: All constitutional gates passed.

## 3. Phase 0: Research

No research is required. The scope is narrow and the file to be changed has been identified.

See `research.md` for details.

## 4. Phase 1: Design

### Data Model & Contracts

-   **Data Model**: No changes to the data model are required.
-   **API Contracts**: No changes to API contracts are required.

See `data-model.md` and the `contracts/` directory.

### Quick Start Guide

Instructions for developers to get started with the implementation are in `quickstart.md`.

## 5. Implementation Approach

The implementation is straightforward:

1.  Locate the file `src/components/Attribution.jsx`.
2.  Remove the line of code that renders the "Powered by Gemini" text.

## 6. Testing Strategy

1.  **E2E Tests**: Update the existing Playwright E2E tests in `tests/e2e/test_default_view.spec.js` or a relevant test file to:
    -   Assert that the text "Powered by Gemini" is NOT present on the page.
    -   Assert that the text "Forecast from BBC Weather" IS present on the page.
2.  **Manual Verification**: Run the application locally and visually confirm the attribution is correct.