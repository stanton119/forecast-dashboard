import { z } from 'zod';

// Zod schemas for validation
const ReportSchema = z.object({
  localDate: z.string(),
  timeslot: z.string(),
  humidity: z.number(),
  temperatureC: z.number(),
});

const DetailedSchema = z.object({
  reports: z.array(ReportSchema),
});

const ForecastSchema = z.object({
  detailed: DetailedSchema,
});

const BbcResponseSchema = z.object({
  forecasts: z.array(ForecastSchema),
});

/**
 * Fetches the weather forecast for a given location, prioritizing postcode.
 * If only latitude and longitude are provided, this client cannot fulfill the request.
 * @param {{postcode: string | null, latitude: number | null, longitude: number | null}} location - The location to fetch forecast for.
 * @returns {Promise<Array<{timestamp_iso: string, outside_humidity_percent: number, outside_temp_c: number}>>}
 * @throws {Error} if postcode is missing or API call fails.
 */
export async function getForecast(location) {
  const { postcode, latitude, longitude } = location;

  let url;
  if (postcode) {
    url = `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/${postcode}`;
  } else if (latitude && longitude) {
    // This specific BBC client currently only supports postcode.
    // A different API endpoint or reverse geocoding would be needed for lat/lon.
    throw new Error("BBC client requires a postcode for forecast. Latitude/Longitude only is not supported by this specific client.");
  } else {
    throw new Error("A valid postcode, latitude, or longitude is required to fetch forecast.");
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // More graceful error handling, re-throwing a custom error for consumer
      let errorMessage = `Failed to fetch forecast for ${postcode || 'lat/lon'}: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = `${errorMessage} - ${errorData.message}`;
        }
      } catch (jsonError) {
        // Ignore JSON parsing error if response is not JSON
      }
      console.error("API Response not OK. Error Message:", errorMessage); // Added log
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const parsedData = BbcResponseSchema.parse(data);

    const forecastSeries = [];
    for (const forecast of parsedData.forecasts) {
      for (const report of forecast.detailed.reports) {
        const timestamp = new Date(`${report.localDate}T${report.timeslot}:00.000Z`);
        forecastSeries.push({
          timestamp_iso: timestamp.toISOString(),
          outside_humidity_percent: report.humidity,
          outside_temp_c: report.temperatureC,
        });
      }
    }

    return forecastSeries;
  } catch (error) {
    // Catch network errors or other unexpected issues
    console.error("Error in getForecast:", error);
    throw error; // Re-throw to allow upstream handling
  }
}
