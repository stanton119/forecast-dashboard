import React, { useState, useEffect } from 'react';
import { getForecast } from '../lib/bbc-client.js';
import { getInsideRelativeHumidity } from '../lib/humidity.js';
import { getParamsFromUrl, updateUrlParams } from '../lib/url.js';
import { downloadCsv } from '../lib/exportCsv.js';
import { areOutdoorParametersChanged } from '../lib/utils/param-utils.js';

import ParameterForm from './ParameterForm.jsx';
import ForecastChart from './ForecastChart.jsx';
import Attribution from './Attribution.jsx';
import ShareButton from './ShareButton.jsx'; // Import ShareButton
import DataTable from './DataTable.jsx'; // Import DataTable

const ForecastPage = () => {
  // Read initial parameters from URL or use defaults
  const initialParams = getParamsFromUrl();
  const [postcode, setPostcode] = useState(initialParams.postcode || 'SW7');
  const [indoorTemp, setIndoorTemp] = useState(initialParams.indoorTemp || 20);
  // State to store the parameters from the previous successful fetch/update cycle
  const [oldParams, setOldParams] = useState({
    postcode: initialParams.postcode || 'SW7',
    indoorTemp: initialParams.indoorTemp || 20,
  });
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // handleParameterChange is now called by the debounced ParameterForm
  const handleParameterChange = (newPostcode, newIndoorTemp) => {
    setPostcode(newPostcode);
    setIndoorTemp(newIndoorTemp);
  };

  useEffect(() => {
    const currentParams = { postcode, indoorTemp };

    // Prevent re-running effect if parameters haven't truly changed from the last processed state
    // This is crucial to avoid infinite loops with setOldParams and handle debounced updates
    if (
      oldParams.postcode === currentParams.postcode &&
      oldParams.indoorTemp === currentParams.indoorTemp
    ) {
      return;
    }

    // Update URL when postcode or indoorTemp changes
    updateUrlParams(postcode, indoorTemp);

    const outdoorParamsChanged = areOutdoorParametersChanged(oldParams, currentParams);
    const indoorTempChanged = oldParams.indoorTemp !== currentParams.indoorTemp;

    const performClientSideRecalculation = (currentRawForecastData) => {
      // Recalculate only inside_relative_humidity_percent for existing forecastData
      const recalculatedForecast = currentRawForecastData.map((item) => ({
        ...item, // Keep existing item properties
        inside_relative_humidity_percent: getInsideRelativeHumidity(
          item.outside_temp_c,
          item.outside_humidity_percent,
          currentParams.indoorTemp
        ),
      }));
      setForecastData(recalculatedForecast);
    };

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      setForecastData([]); // Clear previous data temporarily

      try {
        const rawForecast = await getForecast(currentParams.postcode);

        const processedForecast = rawForecast.map((item) => ({
          timestamp_iso: item.timestamp_iso,
          outside_humidity_percent: item.outside_humidity_percent,
          outside_temp_c: item.outside_temp_c,
          inside_relative_humidity_percent: getInsideRelativeHumidity(
            item.outside_temp_c,
            item.outside_humidity_percent,
            currentParams.indoorTemp
          ),
        }));
        setForecastData(processedForecast);
        setOldParams(currentParams); // Update oldParams only after successful fetch
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (outdoorParamsChanged) {
      fetchForecast();
    } else if (indoorTempChanged && forecastData.length > 0) {
      // Only indoor temp changed, and we have existing forecast data to recalculate
      // We need to re-map the existing forecast data items to their original format
      // before recalculating indoor humidity to avoid modifying the original data structure
      performClientSideRecalculation(
        forecastData.map((item) => ({
          timestamp_iso: item.timestamp_iso,
          outside_humidity_percent: item.outside_humidity_percent,
          outside_temp_c: item.outside_temp_c,
          // We only need outside data to recalculate indoor humidity
        }))
      );
      setOldParams(currentParams); // Update oldParams after successful recalculation
    } else if (indoorTempChanged && forecastData.length === 0) {
      // Indoor temp changed but no forecast data to recalculate, need to fetch
      fetchForecast();
    }
    // If neither outdoor nor indoor params changed, do nothing.
    // This case should ideally be caught by the initial oldParams === currentParams check.
  }, [postcode, indoorTemp, oldParams]);

  const handleDownloadCsv = () => {
    downloadCsv('humidity_forecast.csv', forecastData);
  };

  return (
    <>
      <section id="parameter-form" className="mb-8">
        <ParameterForm
          onParameterChange={handleParameterChange}
          currentPostcode={postcode}
          currentIndoorTemp={indoorTemp}
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
      {error && <p className="text-center text-red-500">Error: {error}</p>}

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
