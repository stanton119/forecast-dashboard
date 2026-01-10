/**
 * Humidity conversion helpers
 * Exports:
 * - saturatePressure(tempC): saturation vapor pressure approximation
 * - getInsideRelativeHumidity(outsideTempC, outsideHumidityPercent, indoorTempC)
 */

export function saturatePressure(tempC) {
  // Magnus approximation (hPa)
  return 6.122 * Math.exp((17.62 * tempC) / (243.12 + tempC));
}

export function getInsideRelativeHumidity(outsideTempC, outsideHumidityPercent, indoorTempC) {
  if (outsideTempC == null || outsideHumidityPercent == null || indoorTempC == null) {
    throw new Error('Missing input');
  }

  const outsideK = outsideTempC + 273.15;
  const indoorK = indoorTempC + 273.15;

  const satOutside = saturatePressure(outsideTempC);
  const satIndoor = saturatePressure(indoorTempC);

  // Formula derived from Clausius-Clapeyron relation and humidity scaling
  const insideRH = (indoorK * outsideHumidityPercent * satOutside) / (outsideK * satIndoor);

  // Clamp to [0, 100]
  const clamped = Math.max(0, Math.min(100, insideRH));
  return Math.round(clamped * 10) / 10; // one decimal
}

export default { saturatePressure, getInsideRelativeHumidity };
