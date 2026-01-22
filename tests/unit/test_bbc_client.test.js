import { describe, it, expect, vi } from 'vitest';
import { getForecast } from '../../src/lib/bbc-client';

// Mock the global fetch function
global.fetch = vi.fn();

describe('BBC Weather API Client', () => {
  it('should fetch and parse weather data for a valid postcode', async () => {
    const mockSuccessResponse = {
      forecasts: [
        {
          detailed: {
            reports: [
              {
                localDate: '2026-01-12',
                timeslot: '12:00',
                humidity: 75,
                temperatureC: 9,
              },
            ],
          },
        },
      ],
    };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse),
    });

    const forecast = await getForecast({ postcode: 'SW7' });

    expect(fetch).toHaveBeenCalledWith(
      'https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/SW7'
    );
    expect(forecast).toEqual([
      {
        timestamp_iso: '2026-01-12T12:00:00.000Z',
        outside_humidity_percent: 75,
        outside_temp_c: 9,
      },
    ]);
  });

  it('should handle 404 for an invalid postcode', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getForecast({ postcode: 'INVALID' })).rejects.toThrow('Failed to fetch forecast for INVALID: 404');
  });

  it('should handle server errors', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getForecast({ postcode: 'SW7' })).rejects.toThrow('Failed to fetch forecast for SW7: 500');
  });
});
