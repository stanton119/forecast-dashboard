// src/lib/url.js

/**
 * Reads location-related parameters (postcode, latitude, longitude) and indoorTemp
 * from the current URL's query parameters.
 * @returns {{postcode: string | null, latitude: number | null, longitude: number | null, indoorTemp: number | null}}
 */
export const getParamsFromUrl = () => {
  if (typeof window === 'undefined') {
    return { postcode: null, latitude: null, longitude: null, indoorTemp: null };
  }
  const params = new URLSearchParams(window.location.search);
  const postcode = params.get('postcode');
  const latitude = params.get('latitude');
  const longitude = params.get('longitude');
  const indoorTemp = params.get('indoorTemp'); // Keep existing indoorTemp

  return {
    postcode: postcode,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    indoorTemp: indoorTemp ? parseInt(indoorTemp, 10) : null,
  };
};

/**
 * Updates the URL's query parameters with the given postcode and indoorTemp.
 * @param {string} postcode
 * @param {number} indoorTemp
 */
export const updateUrlParams = (postcode, indoorTemp) => {
  if (typeof window === 'undefined') {
    return;
  }
  console.log("updateUrlParams called with:", { postcode, indoorTemp, currentSearch: window.location.search }); // Added log
  const params = new URLSearchParams(window.location.search);
  if (postcode) {
    params.set('postcode', postcode);
  } else {
    params.delete('postcode');
  }
  if (indoorTemp !== null && indoorTemp !== undefined) {
    params.set('indoorTemp', indoorTemp.toString());
  } else {
    params.delete('indoorTemp');
  }

  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  console.log("New URL after update:", newUrl); // Added log
  window.history.pushState({ path: newUrl }, '', newUrl);
};
