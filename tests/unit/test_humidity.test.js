import { describe, it, expect } from 'vitest';
import { getInsideRelativeHumidity } from '../../src/lib/humidity.js';

describe('getInsideRelativeHumidity', () => {
  it('should return the same RH when indoor and outdoor temperatures are equal', () => {
    const outsideTemp = 20;
    const indoorTemp = 20;
    const outsideRH = 65;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    expect(insideRH).toBeCloseTo(outsideRH, 2);
  });

  it('should return lower RH when indoor temperature is higher than outdoor (heating effect)', () => {
    const outsideTemp = 10;
    const indoorTemp = 20;
    const outsideRH = 80;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    // Expect a significant drop in RH due to increased temperature
    expect(insideRH).toBeLessThan(outsideRH);
    expect(insideRH).toBeCloseTo(38.65, 2); // Calculated value for these inputs
  });

  it('should return higher RH when indoor temperature is lower than outdoor (cooling effect)', () => {
    const outsideTemp = 25;
    const indoorTemp = 15;
    const outsideRH = 60;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    // Expect an increase in RH due to decreased temperature, potentially leading to condensation
    expect(insideRH).toBeGreaterThan(outsideRH);
    expect(insideRH).toBeCloseTo(116.64, 2); // Calculated value for these inputs (indicating condensation if > 100)
  });

  it('should handle 0% outdoor RH correctly', () => {
    const outsideTemp = 15;
    const indoorTemp = 20;
    const outsideRH = 0;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    expect(insideRH).toBeCloseTo(0, 2);
  });

  it('should handle 100% outdoor RH correctly', () => {
    const outsideTemp = 15;
    const indoorTemp = 15;
    const outsideRH = 100;
    const insideRH = getInsideRelativeHumidity(outsideTemp, outsideRH, indoorTemp);
    expect(insideRH).toBeCloseTo(100, 2);
  });

  it('should handle extreme outdoor temperatures', () => {
    // Very cold outdoor
    let insideRH = getInsideRelativeHumidity(-20, 90, 20);
    expect(insideRH).toBeCloseTo(5.27, 2);

    // Very hot outdoor
    insideRH = getInsideRelativeHumidity(40, 30, 25);
    expect(insideRH).toBeCloseTo(59.98, 2);
  });

  it('should handle extreme indoor temperatures', () => {
    // Very cold indoor
    let insideRH = getInsideRelativeHumidity(20, 60, 5);
    expect(insideRH).toBeCloseTo(166.45, 2);

    // Very hot indoor
    insideRH = getInsideRelativeHumidity(20, 60, 35);
    expect(insideRH).toBeCloseTo(24.47, 2);
  });
});
