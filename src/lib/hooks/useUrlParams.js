// src/lib/hooks/useUrlParams.js
import { useState, useEffect, useCallback } from 'react';

// Helper to parse URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const postcode = params.get('postcode') || '';
  const indoorTemp = parseInt(params.get('indoorTemp'), 10);
  return { postcode, indoorTemp: isNaN(indoorTemp) ? 20 : indoorTemp }; // Default to 20 if not a valid number
}

// Helper to update URL parameters
function setUrlParams(postcode, indoorTemp) {
  const url = new URL(window.location.href);
  if (postcode) {
    url.searchParams.set('postcode', postcode);
  } else {
    url.searchParams.delete('postcode');
  }
  url.searchParams.set('indoorTemp', indoorTemp);
  window.history.replaceState({}, '', url.toString());
}

export function useUrlParams() {
  const [postcode, setPostcode] = useState(() => getUrlParams().postcode);
  const [indoorTemp, setIndoorTemp] = useState(() => getUrlParams().indoorTemp);

  // Effect to update internal state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setPostcode(params.postcode);
      setIndoorTemp(params.indoorTemp);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((newPostcode, newIndoorTemp) => {
    setPostcode(newPostcode);
    setIndoorTemp(newIndoorTemp);
    setUrlParams(newPostcode, newIndoorTemp);
  }, []);

  return { postcode, indoorTemp, updateParams };
}
