# Design Doc: Refactor URL State Management

**Date:** 2026-01-19

**Author:** Gemini

## 1. Overview

This document outlines a plan to refactor the state management of the forecast application. The goal is to simplify the logic by using the URL as the single source of truth for application parameters like `postcode` and `indoorTemp`. This will make the application more robust, easier to maintain, and provide a better user experience.

## 2. Problems with the Current Implementation

*   **Complex State Management:** The current implementation uses a combination of `useState` and `useRef` to manage the application's parameters, leading to complex synchronization logic.
*   **Unintuitive User Experience:** Changes to the indoor temperature are not reflected immediately, as they are tied to the debounced postcode input.
*   **Difficult to Maintain:** The complex data flow and state synchronization make the code harder to understand and modify.

## 3. Proposed Solution

The proposed solution is to refactor the application to use the URL as the single source of truth for its parameters. This will be achieved by:

1.  **Creating a custom hook `useUrlParams`:** This hook will be responsible for reading from and writing to the URL.
2.  **Refactoring `ForecastPage.jsx`:** This component will be simplified to use the `useUrlParams` hook, removing the complex state management logic.
3.  **Refactoring `ParameterForm.jsx`:** This component will be simplified to a controlled component that receives its props and callbacks from the `ForecastPage`.

### 3.1. `useUrlParams` Custom Hook

A new custom hook will be created at `src/lib/hooks/useUrlParams.js`. This hook will provide a simple interface to interact with the URL parameters.

*   It will read the initial `postcode` and `indoorTemp` from the URL.
*   It will provide a function to update the URL parameters.
*   It will listen for URL changes (e.g., from browser back/forward buttons) and update the component's state.

### 3.2. `ForecastPage.jsx` Refactoring

This component will be the main consumer of the `useUrlParams` hook.

*   The existing `useState` and `useRef` hooks for managing location and temperature will be removed.
*   The component will get the `postcode` and `indoorTemp` from the `useUrlParams` hook.
*   It will have two separate handlers for postcode and temperature changes:
    *   `handleIndoorTempChange`: Will update the URL immediately.
    *   `handlePostcodeChange`: Will be a debounced function that updates the URL after a 500ms delay.
*   The `useEffect` hooks will be simplified to react to changes in the `postcode` and `indoorTemp` parameters from the URL.

### 3.3. `ParameterForm.jsx` Refactoring

This component will be a simple controlled component.

*   It will receive `postcode`, `indoorTemp`, `onPostcodeChange`, and `onIndoorTempChange` as props.
*   It will not have any internal state or logic for debouncing.

## 4. Data Flow

The new data flow will be unidirectional and much simpler to follow:

`Form Input -> URL -> useEffect -> Fetch/Recalculate -> Render`

## 5. Implementation Plan

1.  Create the `docs/` directory and add this design document.
2.  Create the `useUrlParams.js` custom hook.
3.  Refactor the `ParameterForm.jsx` component.
4.  Refactor the `ForecastPage.jsx` component.
5.  Test the new implementation to ensure all requirements are met.
