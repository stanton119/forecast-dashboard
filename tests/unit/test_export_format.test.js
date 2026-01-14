import { describe, it, expect } from 'vitest';
import { formatDataForCsv } from '../../src/lib/exportCsv.js';

describe('CSV export formatting', () => {
  it('should correctly format an array of data into CSV string', () => {
    const testData = [
      { timestamp_iso: '2026-01-12T10:00:00Z', outside_humidity_percent: 70, outside_temp_c: 10, inside_relative_humidity_percent: 50 },
      { timestamp_iso: '2026-01-12T11:00:00Z', outside_humidity_percent: 72, outside_temp_c: 11, inside_relative_humidity_percent: 52 },
    ];
    const expectedCsv = "Date,Time,Outdoor Humidity (%)\,Outdoor Temp (C),Indoor RH (%)\n" +
                         "1/12/2026,10:00 AM,70,10,50.0\n" +
                         "1/12/2026,11:00 AM,72,11,52.0";
    expect(formatDataForCsv(testData)).toBe(expectedCsv);
  });

  it('should handle empty data array', () => {
    const expectedCsv = "Date,Time,Outdoor Humidity (%)\,Outdoor Temp (C),Indoor RH (%)";
    expect(formatDataForCsv([])).toBe(expectedCsv);
  });

  it('should handle data with missing fields gracefully', () => {
    const testData = [
      { timestamp_iso: '2026-01-12T10:00:00Z', outside_humidity_percent: 70, outside_temp_c: 10 }, // Missing inside_relative_humidity_percent
    ];
    const expectedCsv = "Date,Time,Outdoor Humidity (%)\,Outdoor Temp (C),Indoor RH (%)\n" +
                         "1/12/2026,10:00 AM,70,10,"; // Indoor humidity should be empty
    expect(formatDataForCsv(testData)).toBe(expectedCsv);
  });
});
