/**
 * Calculates the saturation vapor pressure (SVP) at a given temperature.
 * Uses the Magnus-Tetens formula, a common approximation.
 * @param {number} tempC - Temperature in degrees Celsius.
 * @returns {number} Saturation vapor pressure in hPa.
 */
function getSaturationVaporPressure(tempC) {
  return 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
}

/**
 * Calculates the indoor relative humidity based on outdoor conditions and indoor temperature.
 * Assumes no change in absolute humidity (no indoor moisture sources/sinks).
 * @param {number} outsideTempC - Outdoor temperature in degrees Celsius.
 * @param {number} outsideRH - Outdoor relative humidity as a percentage (e.g., 65 for 65%).
 * @param {number} indoorTempC - Indoor temperature in degrees Celsius.
 * @returns {number} Indoor relative humidity as a percentage.
 */
export function getInsideRelativeHumidity(outsideTempC, outsideRH, indoorTempC) {
  // 1. Calculate the saturation vapor pressure outdoors.
  const svpOutside = getSaturationVaporPressure(outsideTempC);

  // 2. Calculate the actual vapor pressure outdoors.
  const avp = (outsideRH / 100) * svpOutside;

  // 3. The actual vapor pressure remains constant as air moves indoors and heats up.

  // 4. Calculate the saturation vapor pressure indoors.
  const svpInside = getSaturationVaporPressure(indoorTempC);

  // 5. Calculate the new indoor relative humidity.
  const insideRH = (avp / svpInside) * 100;

  return insideRH;
}
