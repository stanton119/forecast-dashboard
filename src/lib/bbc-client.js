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
 * Fetches the weather forecast for a given postcode.
 * @param {string} postcode - The UK postcode.
 * @returns {Promise<Array<{timestamp_iso: string, outside_humidity_percent: number, outside_temp_c: number}>>}
 */
export async function getForecast(postcode) {
  const url = `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/${postcode}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast: ${response.status}`);
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
}
