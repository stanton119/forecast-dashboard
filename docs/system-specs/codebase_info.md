# Codebase Info

This document provides a high-level overview of the `forecast-site` codebase, including its technology stack, structure, and key scripts.

## Technology Stack

The project is built with the following primary technologies:

- **Framework:** [Astro](https://astro.build/) for the overall site structure and static generation.
- **UI Components:** [React](https://reactjs.org/) for building interactive UI components.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **Charting:** [Recharts](https://recharts.org/) for creating charts.
- **Unit Testing:** [Vitest](https://vitest.dev/) for unit and component testing.
- **E2E Testing:** [Playwright](https://playwright.dev/) for end-to-end testing.
- **Linting & Formatting:** ESLint and Prettier for code quality and consistency.
- **Languages:** JavaScript (ESM) and TypeScript.

## Project Structure

The core application code resides in the `src/` directory, which is organized as follows:

```
src/
├── components/   # Reusable React components (.jsx)
├── layouts/      # Astro layout components (.astro)
├── lib/          # Core application logic and utilities (.js)
│   ├── hooks/    # Custom React hooks
│   └── utils/    # Utility functions
├── pages/        # Astro pages, defining the routes of the site (.astro)
└── styles/       # Global CSS styles
```

- **`src/components`**: Contains modular and reusable React components that form the building blocks of the user interface.
- **`src/layouts`**: Defines the overall page structure and layout using Astro's layout system.
- **`src/lib`**: Holds the client-side business logic, such as API clients (`bbc-client.js`), data manipulation, and custom hooks.
- **`src/pages`**: Contains the Astro pages that correspond to the routes of the website. `index.astro` is the main entry page.
- **`src/styles`**: Contains global stylesheets.

## Key Scripts

The following scripts are defined in `package.json` and are used for development and testing:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run test`: Runs unit tests using Vitest.
- `npm run test:e2e`: Runs end-to-end tests using Playwright.
- `npm run lint`: Lints the codebase for potential errors.
- `npm run format`: Formats the code using Prettier.
