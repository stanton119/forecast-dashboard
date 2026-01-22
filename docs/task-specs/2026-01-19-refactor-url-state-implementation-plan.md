# Refactor URL State Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the application's state management to use the URL as the single source of truth for `postcode` and `indoorTemp` parameters, simplifying logic and improving user experience.

**Architecture:** The core idea is to introduce a `useUrlParams` custom hook to abstract URL parameter reading and writing. Components will then interact with this hook, ensuring the URL always reflects the application's state. `ForecastPage` will handle debouncing for postcode updates, while temperature updates will be immediate.

**Tech Stack:** React, JavaScript (ESM), Astro, URL API.

---

### Task 1: Create `src/lib/hooks` directory

**Files:**
- Create: `src/lib/hooks`

**Step 1: Create the directory for custom hooks.**

```bash
mkdir -p src/lib/hooks
```

**Step 2: Commit**

```bash
git add src/lib/hooks
git commit -m "feat: create hooks directory for custom hooks"
```

### Task 2: Create `useUrlParams.js` custom hook

**Files:**
- Create: `src/lib/hooks/useUrlParams.js`

**Step 1: Write the initial version of `useUrlParams.js`.**
This hook will manage reading and writing `postcode` and `indoorTemp` parameters from/to the URL. It will also handle initial parameter parsing and URL updates.

```javascript
// src/lib/hooks/useUrlParams.js
import { useState, useEffect, useCallback } from 'react';

// Helper to parse URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const postcode = params.get('postcode') || '';
  const indoorTemp = parseInt(params.get('indoorTemp'), 10);
  return { postcode, indoorTemp: isNaN(indoorTemp) ? 20 : indoorTemp }; // Default to 20 if not a valid number
}

// Helper to update URL parameters
function setUrlParams(postcode, indoorTemp) {
  const url = new URL(window.location.href);
  if (postcode) {
    url.searchParams.set('postcode', postcode);
  } else {
    url.searchParams.delete('postcode');
  }
  url.searchParams.set('indoorTemp', indoorTemp);
  window.history.replaceState({}, '', url.toString());
}

export function useUrlParams() {
  const [postcode, setPostcode] = useState(() => getUrlParams().postcode);
  const [indoorTemp, setIndoorTemp] = useState(() => getUrlParams().indoorTemp);

  // Effect to update internal state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setPostcode(params.postcode);
      setIndoorTemp(params.indoorTemp);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((newPostcode, newIndoorTemp) => {
    setPostcode(newPostcode);
    setIndoorTemp(newIndoorTemp);
    setUrlParams(newPostcode, newIndoorTemp);
  }, []);

  return { postcode, indoorTemp, updateParams };
}
```

**Step 2: Commit**

```bash
git add src/lib/hooks/useUrlParams.js
git commit -m "feat: create useUrlParams custom hook"
```

### Task 3: Refactor `src/components/ParameterForm.jsx`

**Files:**
- Modify: `src/components/ParameterForm.jsx`

**Step 1: Modify `ParameterForm.jsx` to be a controlled component.**
It will now accept `postcode`, `indoorTemp`, `onPostcodeChange`, and `onIndoorTempChange` as props. Remove the internal debouncing logic if any, and ensure `value` and `onChange` are correctly bound to props.

```javascript
// src/components/ParameterForm.jsx
import React from 'react';

const ParameterForm = ({ postcode, indoorTemp, onPostcodeChange, onIndoorTempChange, isLoading }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Parameters</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="postcode" className="block text-gray-700 text-sm font-bold mb-2">
            UK Postcode:
          </label>
          <input
            type="text"
            id="postcode"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., SW7"
            value={postcode}
            onChange={(e) => onPostcodeChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="indoorTemp" className="block text-gray-700 text-sm font-bold mb-2">
            Indoor Temperature (&deg;C):
          </label>
          <input
            type="number"
            id="indoorTemp"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 20"
            value={indoorTemp}
            onChange={(e) => onIndoorTempChange(parseInt(e.target.value, 10))}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ParameterForm;
```

**Step 2: Commit**

```bash
git add src/components/ParameterForm.jsx
git commit -m "refactor: simplify ParameterForm to be a controlled component"
```

### Task 4: Refactor `src/components/ForecastPage.jsx`

**Files:**
- Modify: `src/components/ForecastPage.jsx`
- Delete: `src/lib/url.js` (or adjust its contents to be minimal if other modules depend on it)

**Step 1: Update imports and use `useUrlParams` hook.**
Remove existing `currentLocation`, `currentIndoorTemp`, `oldLocationRef`, `oldIndoorTempRef` states/refs and the `updateUrlParams` import. Import `useUrlParams` and `debounce`.

**Step 2: Integrate `useUrlParams` and implement parameter change handlers.**
Replace state management for parameters with `useUrlParams`. Create distinct `handlePostcodeChange` (debounced) and `handleIndoorTempChange` (immediate).

**Step 3: Adjust `useEffect` hooks for data fetching and recalculation.**
The main `useEffect` should now react to changes in the `postcode` and `indoorTemp` values from `useUrlParams`. The logic for fetching new data versus recalculating humidity should be clearer.

```javascript
// src/components/ForecastPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getForecast } from '../lib/bbc-client.js';
import { getInsideRelativeHumidity } from '../lib/humidity.js';
// Removed: import { getParamsFromUrl, updateUrlParams } from '../lib/url.js';
import { getDefaultLocation, determinePrioritizedLocation } from '../lib/location.js';
import { getFriendlyErrorMessage } from '../lib/errors.js';
import { downloadCsv } from '../lib/exportCsv.js';
import { debounce } from '../lib/utils/debounce.js';
import { useUrlParams } from '../lib/hooks/useUrlParams.js'; // New import

import ParameterForm from './ParameterForm.jsx';
import ForecastChart from './ForecastChart.jsx';
import Attribution from './Attribution.jsx';
import ShareButton from './ShareButton.jsx';
import DataTable from './DataTable.jsx';
import RetryButton from './RetryButton.jsx';

const ForecastPage = () => {
  const { postcode, indoorTemp, updateParams } = useUrlParams();

  // State for raw postcode input (for immediate display in form)
  const [rawPostcode, setRawPostcode] = useState(postcode);

  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced function to update URL with new postcode
  const debouncedUpdatePostcode = useCallback(
    debounce((newPostcode) => {
      updateParams(newPostcode, indoorTemp);
    }, 500),
    [indoorTemp, updateParams]
  );

  // Handlers for ParameterForm changes
  const handlePostcodeChange = useCallback((newPostcode) => {
    setRawPostcode(newPostcode); // Update raw input immediately
    debouncedUpdatePostcode(newPostcode);
  }, [debouncedUpdatePostcode]);

  const handleIndoorTempChange = useCallback((newIndoorTemp) => {
    updateParams(postcode, newIndoorTemp); // Update URL and trigger recalculation immediately
  }, [postcode, updateParams]);


  // Function to fetch forecast data (now dependent only on effectivePostcode, not rawPostcode)
  const fetchForecast = useCallback(async (postcodeToFetch, indoorTempToUse) => {
    if (!postcodeToFetch) {
      setForecastData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setForecastData([]);

    try {
      // Use the refactored getForecast that accepts a location object (assuming getForecast can take postcode string)
      // If getForecast expects an object with latitude/longitude, this will need further adjustment,
      // but for now, we pass postcode directly.
      const rawForecast = await getForecast({ postcode: postcodeToFetch });

      const processedForecast = rawForecast.map((item) => ({
        timestamp_iso: item.timestamp_iso,
        outside_humidity_percent: item.outside_humidity_percent,
        outside_temp_c: item.outside_temp_c,
        inside_relative_humidity_percent: getInsideRelativeHumidity(
          item.outside_temp_c,
          item.outside_humidity_percent,
          indoorTempToUse
        ),
      }));
      setForecastData(processedForecast);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial load and when actual postcode from URL changes
  useEffect(() => {
    // Only fetch new data if the effective postcode (from URL) changes
    fetchForecast(postcode, indoorTemp);
  }, [postcode, fetchForecast]);

  // Effect for when only indoorTemp changes (recalculate existing data)
  useEffect(() => {
    if (forecastData.length > 0 && indoorTemp !== undefined) {
      const recalculatedForecast = forecastData.map((item) => ({
        ...item,
        inside_relative_humidity_percent: getInsideRelativeHumidity(
          item.outside_temp_c,
          item.outside_humidity_percent,
          indoorTemp
        ),
      }));
      setForecastData(recalculatedForecast);
    }
  }, [indoorTemp]); // No need to depend on forecastData.length, if it's empty, this effect won't do anything.

  const handleRetry = () => {
    // Retry with current URL parameters
    fetchForecast(postcode, indoorTemp);
  };

  const handleDownloadCsv = () => {
    downloadCsv('humidity_forecast.csv', forecastData);
  };

  return (
    <>
      <section id="parameter-form" className="mb-8">
        <ParameterForm
          postcode={rawPostcode} // Display raw input for better UX
          indoorTemp={indoorTemp} // Display indoorTemp from URL (actual state)
          onPostcodeChange={handlePostcodeChange}
          onIndoorTempChange={handleIndoorTempChange}
          isLoading={loading}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <ShareButton />
          <button
            id="export-csv-button"
            onClick={handleDownloadCsv}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            disabled={!forecastData.length || loading}
          >
            Export to CSV
          </button>
        </div>
      </section>

      {/* Render loading/error messages and pass to children */}
      {loading && <p className="text-center text-blue-500">Loading forecast...</p>}
      {error && (
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <RetryButton onRetry={handleRetry} className="mt-2" />
        </div>
      )}

      {!loading && !error && (
        <>
          <section id="forecast-chart" className="mb-8">
            <ForecastChart forecastData={forecastData} isLoading={loading} error={error} />
          </section>
          <section id="data-table" className="mb-8">
            <DataTable forecastData={forecastData} isLoading={loading} error={error} />
          </section>
        </>
      )}
      {!loading && !error && forecastData.length === 0 && (
        <p className="text-center text-gray-500">
          No forecast data available. Adjust parameters and try again.
        </p>
      )}

      <section id="attribution">
        <Attribution />
      </section>
    </>
  );
};

export default ForecastPage;
```

**Step 4: Consider `src/lib/url.js` for removal or modification.**
The `getParamsFromUrl` and `updateUrlParams` functions in `src/lib/url.js` are now redundant with the introduction of `useUrlParams`. We should verify if any other parts of the codebase depend on them. For now, I'll propose deleting it. If issues arise, it can be re-evaluated.

```bash
# Optional: If no other modules depend on it
rm src/lib/url.js
```

**Step 5: Commit**

```bash
git add src/components/ForecastPage.jsx
git rm src/lib/url.js # Only if it's safe to remove
git commit -m "refactor: ForecastPage to use useUrlParams hook and simplify state logic"
```

### Task 5: Add a unit test for `useUrlParams.js`

**Files:**
- Create: `tests/unit/test_use_url_params.test.js`

**Step 1: Write a failing test for `useUrlParams.js`.**
This test will ensure that the hook correctly reads and updates URL parameters.

```javascript
// tests/unit/test_use_url_params.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useUrlParams } from '../../src/lib/hooks/useUrlParams';

describe('useUrlParams', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        search: '',
        replace: jest.fn(),
      },
    });
  });

  afterEach(() => {
    // Reset URL after each test
    window.location.search = '';
    window.location.replace.mockClear();
  });

  afterAll(() => {
    // Restore original window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  test('should return default values if no URL parameters are present', () => {
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('');
    expect(result.current.indoorTemp).toBe(20);
  });

  test('should read initial parameters from URL', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=22';
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('SW1A0AA');
    expect(result.current.indoorTemp).toBe(22);
  });

  test('should update URL and state when updateParams is called', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateParams('SE100XX', 18);
    });

    expect(result.current.postcode).toBe('SE100XX');
    expect(result.current.indoorTemp).toBe(18);
    expect(window.location.replace).toHaveBeenCalledWith('http://localhost/?postcode=SE100XX&indoorTemp=18');
  });

  test('should handle invalid indoorTemp in URL by defaulting to 20', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=abc';
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('SW1A0AA');
    expect(result.current.indoorTemp).toBe(20);
  });

  test('should remove postcode from URL if newPostcode is empty', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=20';
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateParams('', 20);
    });

    expect(result.current.postcode).toBe('');
    expect(result.current.indoorTemp).toBe(20);
    expect(window.location.replace).toHaveBeenCalledWith('http://localhost/?indoorTemp=20');
  });
});
```
*(Note: I will need to install `@testing-library/react-hooks` if it's not already installed)*

**Step 2: Run test to verify it fails (or passes if dependencies are already set up).**

```bash
npx vitest tests/unit/test_use_url_params.test.js
```
Expected: FAIL due to `jest` being undefined or `useUrlParams` not being completely correct yet. The `@testing-library/react-hooks` might also need to be installed.

**Step 3: Implement minimal code to make the test pass (already done in Task 2)**

**Step 4: Run test to verify it passes.**

```bash
npx vitest tests/unit/test_use_url_params.test.js
```
Expected: PASS

**Step 5: Commit**

```bash
git add tests/unit/test_use_url_params.test.js
git commit -m "test: add unit tests for useUrlParams hook"
```

### Task 6: Run existing unit and e2e tests

**Files:**
- N/A

**Step 1: Run all unit tests.**

```bash
npm run test:unit
```

**Step 2: Run all e2e tests.**

```bash
npm run test:e2e
```

**Step 3: Commit (if tests pass)**

```bash
git commit -m "ci: ensure all tests pass after URL state refactor"
```
