import React, { useState, useEffect } from 'react';
import { getForecast } from '../lib/bbc-client.js';
import { getInsideRelativeHumidity } from '../lib/humidity.js';
import { getParamsFromUrl, updateUrlParams } from '../lib/url.js';
import { downloadCsv } from '../lib/exportCsv.js';

import ParameterForm from './ParameterForm.jsx';
import ForecastChart from './ForecastChart.jsx';
import Attribution from './Attribution.jsx';
import ShareButton from './ShareButton.jsx'; // Import ShareButton
import DataTable from './DataTable.jsx'; // Import DataTable

const ForecastPage = () => {
  // Read initial parameters from URL or use defaults
  const initialParams = getParamsFromUrl();
  const [postcode, setPostcode] = useState(initialParams.postcode || "SW7");
  const [indoorTemp, setIndoorTemp] = useState(initialParams.indoorTemp || 20);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update URL when postcode or indoorTemp changes
    updateUrlParams(postcode, indoorTemp);

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      setForecastData([]); // Clear previous data

      try {
        const rawForecast = await getForecast(postcode);

        const processedForecast = rawForecast.map(item => ({
          timestamp_iso: item.timestamp_iso, // Ensure timestamp_iso is present
          outside_humidity_percent: item.outside_humidity_percent,
          outside_temp_c: item.outside_temp_c,
          inside_relative_humidity_percent: getInsideRelativeHumidity(
            item.outside_temp_c,
            item.outside_humidity_percent,
            indoorTemp
          )
        }));
        setForecastData(processedForecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [postcode, indoorTemp]);

  const handleParameterChange = (newPostcode, newIndoorTemp) => {
    setPostcode(newPostcode);
    setIndoorTemp(newIndoorTemp);
  };

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

      {loading && <p className="text-center text-blue-500">Loading forecast...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && forecastData.length > 0 && (
        <>
          <section id="forecast-chart" className="mb-8">
            <ForecastChart forecastData={forecastData} />
          </section>
          <section id="data-table" className="mb-8">
            <DataTable forecastData={forecastData} />
          </section>
        </>
      )}
      {!loading && !error && forecastData.length === 0 && (
        <p className="text-center text-gray-500">No forecast data available. Adjust parameters and try again.</p>
      )}

      <section id="attribution">
        <Attribution />
      </section>
    </>
  );
};

export default ForecastPage;
