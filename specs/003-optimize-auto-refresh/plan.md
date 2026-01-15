# Implementation Plan: Optimize Auto-Refresh API Calls

**Branch**: `003-optimize-auto-refresh` | **Date**: January 14, 2026 | **Spec**: /Users/rich/Developer/Github/forecast-site/specs/003-optimize-auto-refresh/spec.md
**Input**: Feature specification from `/specs/003-optimize-auto-refresh/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The primary requirement is to optimize the auto-refresh mechanism by preventing unnecessary external API calls when only indoor temperature-related parameters change. The technical approach will involve detecting parameter changes to intelligently decide whether to trigger a client-side recalculation or a full API refresh. This will lead to a snappier user experience and lower backend load.

## Technical Context

**Language/Version**: JavaScript/TypeScript  
**Primary Dependencies**: Astro, React, Tailwind CSS. `bbc-client.js` for external API interaction.  
**Storage**: Client-side state management using `useState` within React components. Persistence of forecast parameters is currently handled via URL parameters or component props. No explicit client-side persistence (e.g., localStorage) is used for forecast parameters.  
**Testing**: Playwright (e2e), Vitest/Jest (unit).  
**Target Platform**: Web browser.
**Project Type**: Single web application.  
**Performance Goals**: Updates for indoor-only parameter changes less than 0.5 seconds.  
**Constraints**: Avoid recalling external API unnecessarily.
**Scale/Scope**: Displaying weather forecasts for individual users.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The project's `constitution.md` file is a template. Therefore, a meaningful check against specific project principles or gates cannot be performed at this time, nor can a formal re-evaluation post-design.

## Project Structure

### Documentation (this feature)

```text
specs/003-optimize-auto-refresh/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # Existing React components (Attribution, DataTable, etc.)
├── layouts/              # Existing Astro layouts
├── lib/                  # Existing utility functions (bbc-client, exportCsv, humidity, postcode, url, utils/debounce)
│   └── utils/
├── pages/                # Existing Astro pages
└── styles/
```

**Structure Decision**: Single project structure, modifying existing `src/lib` and `src/components` directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
|           |            |                                      |
