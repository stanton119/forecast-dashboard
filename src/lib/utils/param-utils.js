export function areOutdoorParametersChanged(oldParams, newParams) {
  // Assuming 'postcode' is the only outdoor parameter that triggers a new API call
  // 'date' is implicitly handled by the API itself for current forecast, or would be explicit if user could select it.
  return oldParams.postcode !== newParams.postcode;
}

// Placeholder for other parameter utility functions if needed later
// export function areIndoorParametersChanged(oldParams, newParams) {
//   return oldParams.indoorTemp !== newParams.indoorTemp;
// }
