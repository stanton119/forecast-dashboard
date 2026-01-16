import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getForecast } from '../lib/bbc-client.js';
import { getInsideRelativeHumidity } from '../lib/humidity.js';
import { getParamsFromUrl, updateUrlParams } from '../lib/url.js';
import { getDefaultLocation, determinePrioritizedLocation } from '../lib/location.js'; // T003, T004
import { getFriendlyErrorMessage } from '../lib/errors.js'; // T006
import { downloadCsv } from '../lib/exportCsv.js';
import { areOutdoorParametersChanged } from '../lib/utils/param-utils.js';

import ParameterForm from './ParameterForm.jsx';
import ForecastChart from './ForecastChart.jsx';
import Attribution from './Attribution.jsx';
import ShareButton from './ShareButton.jsx';
import DataTable from './DataTable.jsx';
import RetryButton from './RetryButton.jsx'; // T007

const ForecastPage = () => {
  // Read initial parameters from URL
  const initialUrlParams = getParamsFromUrl(); // Includes postcode, latitude, longitude, indoorTemp

  // Determine initial prioritized location
  const defaultLocation = getDefaultLocation(); // T003
  const initialPrioritizedLocation = determinePrioritizedLocation(initialUrlParams, defaultLocation); // T004

  // State for the currently displayed/fetched location and indoor temperature
  const [currentLocation, setCurrentLocation] = useState({
    postcode: initialPrioritizedLocation.postcode || null,
    latitude: initialPrioritizedLocation.latitude || null,
    longitude: initialPrioritizedLocation.longitude || null,
    city: initialPrioritizedLocation.city || null, // Keep city for display if needed
  });
  const [currentIndoorTemp, setCurrentIndoorTemp] = useState(initialUrlParams.indoorTemp || 20);

  // Use refs to track the last successfully fetched location and indoorTemp without causing re-renders
  const oldLocationRef = useRef(currentLocation);
  const oldIndoorTempRef = useRef(currentIndoorTemp);

  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch forecast data
  const fetchForecast = useCallback(async (locationToFetch, indoorTempToUse) => {
    setLoading(true);
    setError(null);
    setForecastData([]); // Clear previous data temporarily

    try {
      // T005: Use the refactored getForecast that accepts a location object
      const rawForecast = await getForecast(locationToFetch);

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
      oldLocationRef.current = locationToFetch; // Update ref directly
      oldIndoorTempRef.current = indoorTempToUse; // Update ref directly
    } catch (err) {
      setError(getFriendlyErrorMessage(err)); // T006: Use friendly error message
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies for useCallback. No external deps needed if states are passed as args.

  // Handle retry
  const handleRetry = () => {
    fetchForecast(currentLocation, currentIndoorTemp);
  };

  // Effect for initial load and when location/indoorTemp from form changes
  useEffect(() => {
    // Update URL when postcode or indoorTemp changes (from form or initial load)
    updateUrlParams(currentLocation.postcode, currentIndoorTemp);

    const outdoorParamsChanged = areOutdoorParametersChanged(oldLocationRef.current, currentLocation);
    const indoorTempChanged = oldIndoorTempRef.current !== currentIndoorTemp;

    // T008: Trigger initial fetch or fetch when outdoor params change
    if (forecastData.length === 0 || outdoorParamsChanged) {
      fetchForecast(currentLocation, currentIndoorTemp);
    } else if (indoorTempChanged && forecastData.length > 0) {
      // Only indoor temp changed, and we have existing forecast data to recalculate
      const recalculatedForecast = forecastData.map((item) => ({
        ...item,
        inside_relative_humidity_percent: getInsideRelativeHumidity(
          item.outside_temp_c,
          item.outside_humidity_percent,
          currentIndoorTemp
        ),
      }));
      setForecastData(recalculatedForecast);
      oldIndoorTempRef.current = currentIndoorTemp; // Update ref directly
    } else if (indoorTempChanged && forecastData.length === 0) {
      // Indoor temp changed but no forecast data to recalculate, need to fetch
      fetchForecast(currentLocation, currentIndoorTemp);
    }
    // If neither outdoor nor indoor params changed, do nothing.
  }, [currentLocation, currentIndoorTemp, fetchForecast, forecastData.length]); // Re-added forecastData.length as dependency for initial fetch logic

  // handleParameterChange is now called by the debounced ParameterForm
  const handleParameterChange = (newPostcodeFromForm, newIndoorTempFromForm) => {
    setCurrentLocation(prevLocation => ({
      ...prevLocation,
      postcode: newPostcodeFromForm, // Update postcode from form
      latitude: null, // Clear lat/lon when postcode is manually entered from form
      longitude: null,
    }));
    setCurrentIndoorTemp(newIndoorTempFromForm);
  };

  const handleDownloadCsv = () => {
    downloadCsv('humidity_forecast.csv', forecastData);
  };

  return (
    <>
      <section id="parameter-form" className="mb-8">
        <ParameterForm
          onParameterChange={handleParameterChange}
          currentPostcode={currentLocation.postcode || ''}
          currentIndoorTemp={currentIndoorTemp}
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
          <RetryButton onRetry={handleRetry} className="mt-2" /> {/* T007: Retry Button */}
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
