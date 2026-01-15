# Research: Integrating Tailwind CSS with Astro

**Date**: 2026-01-12
**Context**: The feature requires using Tailwind CSS for styling within an Astro project that also uses React components. The `plan.md` identified that Tailwind CSS was not yet installed or configured.

## Investigation

A search was conducted to determine the best practice for adding Tailwind CSS to an Astro project. The official Astro documentation and Tailwind CSS documentation were consulted.

## Decision

The recommended and most straightforward method to add Tailwind CSS to an Astro project is to use the `astro add` command.

**Command:**

```bash
npx astro add tailwind
```

This command automates the entire setup process:

1.  **Installs Dependencies**: It installs the necessary packages, including `@astrojs/tailwind` and `tailwindcss`.
2.  **Configuration**: It creates a `tailwind.config.mjs` file in the project root.
3.  **Integration**: It automatically updates the `astro.config.mjs` file to include the Tailwind integration.

## Rationale

This approach is preferred over manual installation because:

- It is the officially recommended method by the Astro team.
- It handles all boilerplate configuration, reducing the chance of manual error.
- It ensures that the project is set up correctly for immediate use of Tailwind's utility classes in `.astro` files and any framework components (like React).

## Alternatives Considered

Manually installing and configuring Tailwind was considered but rejected. The manual process is more complex, involving:

- Installing packages via `npm` or `yarn`.
- Manually creating and configuring `tailwind.config.mjs`.
- Manually editing `astro.config.mjs`.

The automated `astro add` command makes this process much simpler and more reliable.
