// src/lib/hooks/useUrlParams.js
import { useState, useEffect, useCallback } from 'react';

// Helper to parse URL parameters, only runs on the client
function getUrlParams() {
  if (typeof window === 'undefined') {
    return { postcode: '', indoorTemp: 20 };
  }
  const params = new URLSearchParams(window.location.search);
  const postcode = params.get('postcode') || '';
  const indoorTemp = parseInt(params.get('indoorTemp'), 10);
  return { postcode, indoorTemp: isNaN(indoorTemp) ? 20 : indoorTemp }; // Default to 20 if not a valid number
}

// Helper to update URL parameters
function setUrlParams(postcode, indoorTemp) {
  if (typeof window === 'undefined') {
    return;
  }
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
  const [postcode, setPostcode] = useState('');
  const [indoorTemp, setIndoorTemp] = useState(20);

  useEffect(() => {
    const params = getUrlParams();
    setPostcode(params.postcode);
    setIndoorTemp(params.indoorTemp);
  }, []);

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
