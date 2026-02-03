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
  const { postcode, indoorTemp, updateParams, isInitialized } = useUrlParams();

  // State for raw postcode input (for immediate display in form)
  const [rawPostcode, setRawPostcode] = useState(postcode || '');

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

  // Effect 1: Sync rawPostcode input with the canonical postcode from the URL
  useEffect(() => {
    setRawPostcode(postcode || '');
  }, [postcode]);

  // Effect 2: Handle fetching data when the postcode changes
  useEffect(() => {
    // Only fetch if we have a postcode. The default-setting effect will handle the empty case.
    if (postcode) {
      fetchForecast(postcode, indoorTemp);
    }
  }, [postcode, indoorTemp, fetchForecast]);


  // Effect 3: Set the default postcode on initial load if no postcode is present
  useEffect(() => {
    // Wait until the URL has been parsed before deciding to set a default.
    if (isInitialized && !postcode) {
      const defaultLocation = getDefaultLocation();
      updateParams(defaultLocation.postcode, indoorTemp);
    }
    // This effect should only run when `isInitialized` becomes true, or if other params change.
  }, [isInitialized, postcode, indoorTemp, updateParams]);

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
    <div data-testid="forecast-page">
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
    </div>
  );
};

export default ForecastPage;
