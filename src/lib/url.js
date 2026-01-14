// src/lib/url.js

/**
 * Reads postcode and indoorTemp from the current URL's query parameters.
 * @returns {{postcode: string | null, indoorTemp: number | null}}
 */
export const getParamsFromUrl = () => {
  if (typeof window === 'undefined') {
    return { postcode: null, indoorTemp: null };
  }
  const params = new URLSearchParams(window.location.search);
  const postcode = params.get('postcode');
  const indoorTemp = params.get('indoorTemp');
  return {
    postcode: postcode,
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
  window.history.pushState({ path: newUrl }, '', newUrl);
};
