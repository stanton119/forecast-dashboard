// src/lib/location.js

/**
 * Provides a hardcoded default location.
 * @returns {{postcode: string, city: string}}
 */
export const getDefaultLocation = () => {
  // Using a default postcode for London as an example.
  // This could be made configurable in a separate config file if needed.
  return {
    postcode: 'SW1A0AA', // Example postcode for London
    city: 'London',
  };
};

/**
 * Determines the prioritized location based on URL parameters and a default location.
 * URL parameters take precedence over the default.
 * @param {{postcode: string | null, latitude: number | null, longitude: number | null}} urlParams
 * @param {{postcode: string, city: string}} defaultLocation
 * @returns {{postcode: string | null, latitude: number | null, longitude: number | null, city: string}}
 */
export const determinePrioritizedLocation = (urlParams, defaultLocation) => {
  let prioritizedLocation = { ...defaultLocation };

  if (urlParams.postcode) {
    prioritizedLocation.postcode = urlParams.postcode;
  }
  if (urlParams.latitude && urlParams.longitude) {
    prioritizedLocation.latitude = urlParams.latitude;
    prioritizedLocation.longitude = urlParams.longitude;
    // If lat/lon are present, postcode from URL or default might be less relevant for API call
    // but keeping it for consistency if needed for display.
    if (!urlParams.postcode && defaultLocation.postcode) {
      prioritizedLocation.postcode = defaultLocation.postcode; // Keep default postcode if not in URL and available
    }
  }

  // If a postcode was prioritized from URL, clear lat/lon if they weren't also from URL,
  // to avoid sending conflicting or less precise data to the API.
  if (urlParams.postcode && (!urlParams.latitude || !urlParams.longitude)) {
    prioritizedLocation.latitude = null;
    prioritizedLocation.longitude = null;
  }

  return prioritizedLocation;
};
