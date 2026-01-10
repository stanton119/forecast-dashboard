import { describe, it, expect } from 'vitest';
import { getInsideRelativeHumidity } from '../../../src/lib/humidity.js';

describe('humidity conversions', () => {
  it('returns same RH when indoor and outdoor temperatures equal', () => {
    const outsideTemp = 20;
    const indoorTemp = 20;
    const outsideRH = 65;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    expect(insideRH).toBeCloseTo(outsideRH, 1);
  });

  it('returns lower RH when indoor temperature is higher than outdoor', () => {
    const outsideTemp = 10;
    const indoorTemp = 20;
    const outsideRH = 80;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    expect(insideRH).toBeLessThan(outsideRH);
  });
});
