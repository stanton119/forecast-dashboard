<!--
Sync Impact Report
====================
Version change: template -> 1.0.0
Modified principles:
  - [PRINCIPLE_1_NAME] -> "Spec-Driven Development"
  - [PRINCIPLE_2_NAME] -> "Test-Driven Development (TDD)"
  - [PRINCIPLE_3_NAME] -> "Modular & Reusable Components"
  - [PRINCIPLE_4_NAME] -> "Client-Side First, with Server-Side Fallback"
  - [PRINCIPLE_5_NAME] -> "Clear and Consistent UI/UX"
Added sections: None
Removed sections: None
Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specifyy/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md (no changes needed for now)
Follow-up TODOs: None
-->

# Forecast Dashboard Constitution

## Core Principles

### I. Spec-Driven Development

Every new feature or significant change must begin with a clear, written specification (`spec.md`). This specification should define the feature's scope, user stories, requirements, and success criteria before implementation begins. The goal is to ensure clarity, alignment, and a shared understanding of what is being built.

### II. Test-Driven Development (TDD)

All new functionality must be accompanied by tests. Where possible, tests should be written before the implementation code, following a red-green-refactor cycle. This includes unit tests for individual components and E2E tests for user-facing features. This ensures code quality, maintainability, and confidence in changes.

### III. Modular & Reusable Components

The UI should be built with modular, reusable React components. Each component should have a single, well-defined responsibility and be independent of other components where possible. This promotes code reuse, simplifies maintenance, and improves testability.

### IV. Client-Side First, with Server-Side Fallback

The application should be designed to be primarily client-side rendered for a fast, interactive user experience. However, it should gracefully degrade or provide server-side rendering (SSR) where appropriate, especially for initial page loads and SEO. This principle is supported by the use of Astro with React.

### V. Clear and Consistent UI/UX

The user interface should be clean, intuitive, and consistent across all forecast types and components. This includes a consistent color scheme, typography, and interaction patterns. The goal is to provide a seamless and user-friendly experience, even as new forecast types are added.

## Development Workflow

The development process for new features follows the `speckit` workflow, which includes:
1.  **Specification (`/speckit.specify`)**: Define the feature.
2.  **Planning (`/speckit.plan`)**: Create a technical plan.
3.  **Task Generation (`/speckit.tasks`)**: Break down the plan into actionable tasks.
4.  **Implementation (`/speckit.implement`)**: Execute the tasks.

All changes must be reviewed via a pull request process.

## Governance

This constitution supersedes all other practices and conventions. Amendments to this constitution require a documented proposal, review, and approval from the project maintainers.

All code reviews must verify compliance with these principles. Any deviation from these principles must be explicitly justified and documented.

**Version**: 1.0.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-01-15