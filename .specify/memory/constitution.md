<!--
Sync Impact Report

- Version change: N/A → 0.1.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> Code Quality & Maintainability
	- [PRINCIPLE_2_NAME] -> Testing Standards (Test-First, CI)
	- [PRINCIPLE_3_NAME] -> User Experience Consistency
	- [PRINCIPLE_4_NAME] -> Performance Requirements
	- [PRINCIPLE_5_NAME] -> Cross-cutting Standards (Observability, Versioning)
- Added sections: Development Workflow, Governance (expanded)
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ reviewed (no changes required)
	- .specify/templates/commands/ ⚠ pending (no commands directory found)
	- Runtime docs (README.md, docs/) ⚠ pending manual review
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): provide original ratification date
	- Manual check: update any CI job descriptions referencing old gates
-->

# Forecast Site Constitution

## Core Principles

### Code Quality & Maintainability
All code MUST be clear, well-structured, and reviewed. Requirements:

- **MUST** pass linters and static analysis before merging.
- **MUST** include inline documentation for public interfaces and non-obvious
	implementation choices.
- **MUST** keep modules small and focused; prefer composition over inheritance.

Rationale: High-quality code reduces defects, lowers maintenance cost, and
improves onboarding speed.

### Testing Standards (Test-First, CI)
Testing is non-negotiable. Requirements:

- **MUST** follow a test-first approach: write tests that fail before
	implementation (Red-Green-Refactor).
- **MUST** include unit tests for logic, integration tests for contracts, and
	end-to-end tests for critical user journeys as described in specs.
- **MUST** all tests required by the spec be run in CI and pass before merge.

Rationale: Tests ensure correctness, enable safe refactoring, and act as
executable documentation for expected behavior.

### User Experience Consistency
The product MUST provide predictable, accessible, and coherent UX. Requirements:

- **MUST** define acceptance criteria for primary user journeys in the spec.
- **MUST** follow established design tokens, spacing, and interaction patterns
	across screens/components.
- **SHOULD** validate critical flows with lightweight usability checks or
	stakeholder review before release.

Rationale: Consistent UX reduces user friction and support costs; it preserves
brand trust and accessibility.

### Performance Requirements
Performance goals MUST be explicit and testable. Requirements:

- **MUST** document measurable performance targets (latency, throughput,
	memory) in the plan and spec where applicable.
- **MUST** include at least one smoke performance test or benchmark for any
	feature with non-trivial performance impact.
- **SHOULD** use p50/p95/p99 metrics and define acceptable thresholds.

Rationale: Explicit performance goals prevent regressions and guide
architecture and testing decisions.

### Cross-cutting Standards (Observability, Versioning, Security)
Standards that apply to all work. Requirements:

- **Observability**: Logs MUST be structured; critical services MUST expose
	basic metrics and health checks.
- **Versioning**: Use semantic versioning for published libraries and public
	APIs. Breaking changes MUST follow the governance change process.
- **Security & Compliance**: Sensitive data handling and access control MUST
	follow applicable laws and internal security guidelines.

Rationale: These cross-cutting items ensure systems remain operable,
traceable, and manageable at scale.

## Additional Constraints

Technology and deployment constraints for the Forecast Site project:

- Preferred stack: minimal, well-supported tools; prefer stable LTS runtimes.
- CI pipelines MUST include lint, test, and a basic build step.
- Data retention, PII handling, and third-party integrations MUST be
	documented in the spec when applicable.

## Development Workflow

Standards for how work is proposed, reviewed, and merged:

- **PRs**: Every change MUST be submitted via a pull request with a clear
	description, linked spec or task, and test evidence.
- **Reviews**: At least one approving review from a teammate with context is
	REQUIRED for non-trivial changes; critical changes require two approvers.
- **Quality Gates**: CI checks (lint, tests, build) MUST pass before merge.
- **Release Notes**: Every release that affects consumers MUST include
	migration notes when breaking/intentional API changes occur.

## Governance

Amendments, compliance, and versioning policy:

- **Amendments**: Changes to this Constitution MUST be proposed in a spec
	document, reviewed by maintainers, and recorded with a rationale and
	migration plan when they affect existing workflows.
- **Approval**: Minor wording or clarifying edits MAY be approved by a single
	maintainer. Material changes (new principles, redefinitions, removals)
	REQUIRE consensus from the maintainers group.
- **Versioning**: The Constitution uses semantic versioning:
	- MAJOR for incompatible governance changes (removal/redefinition of
		principles)
	- MINOR for additions of new principles or material expansions
	- PATCH for clarifications, typos, and non-semantic edits
- **Compliance Review**: Periodic reviews (at least annually) SHOULD be
	scheduled to ensure practices align with the Constitution. CI and template
	checks SHOULD be added where feasible to prevent regressions.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): provide original adoption date | **Last Amended**: 2026-01-10

