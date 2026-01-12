<!--
Sync Impact Report

- Version change: 0.1.0 → 1.0.0
- Modified principles:
	- Testing Standards (Test-First, CI) -> REMOVED (governance change)
	- Code Quality & Maintainability -> unchanged
	- User Experience Consistency -> unchanged
	- Performance Requirements -> unchanged
	- Cross-cutting Standards (Observability, Versioning) -> unchanged
- Removed sections:
	- Testing Standards (entire principle removed)
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ reviewed (no changes required)
	- .specify/templates/commands/ ⚠ pending (manual review - directory may not exist)
	- Runtime docs (README.md, docs/) ⚠ pending manual review for references to testing or PRs
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): provide original ratification date
	- Manual check: update any CI job descriptions referencing removed governance gates
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
Performance goals MUST be explicit and measurable. Requirements:

- **MUST** document measurable performance targets (latency, throughput,
	memory) in the plan and spec where applicable.
- **MUST** include at least one smoke performance benchmark for any
	feature with non-trivial performance impact.
- **SHOULD** use p50/p95/p99 metrics and define acceptable thresholds.

Rationale: Explicit performance goals prevent regressions and guide
architecture and validation decisions.

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
- CI pipelines MUST include lint and a basic build step.
- Data retention, PII handling, and third-party integrations MUST be
	documented in the spec when applicable.

## Development Workflow

Standards for how work is proposed, reviewed, and merged:

- **Change Proposals**: Every change MUST be submitted with a clear
	description, linked spec or task, and evidence of validation or verification.
- **Reviews**: At least one approving review from a teammate with context is
	REQUIRED for non-trivial changes; critical changes require two approvers.
- **Quality Gates**: CI checks (lint, build) MUST pass before merge.
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

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): provide original adoption date | **Last Amended**: 2026-01-12

