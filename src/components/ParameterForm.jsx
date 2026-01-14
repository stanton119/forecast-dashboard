import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from '../lib/utils/debounce';

const ParameterForm = ({ onParameterChange, currentPostcode, currentIndoorTemp, isLoading }) => {
  const [postcode, setPostcode] = useState(currentPostcode || '');
  const [indoorTemp, setIndoorTemp] = useState(currentIndoorTemp || '');

  // Debounced version of onParameterChange
  const debouncedOnParameterChange = useCallback(
    debounce((newPostcode, newIndoorTemp) => {
      onParameterChange(newPostcode, newIndoorTemp);
    }, 500), // 500ms debounce
    [onParameterChange]
  );

  // Effect to call debouncedOnParameterChange when internal state changes
  useEffect(() => {
    // Only call if both postcode and indoorTemp have values
    if (postcode && indoorTemp) {
      debouncedOnParameterChange(postcode, indoorTemp);
    }
  }, [postcode, indoorTemp, debouncedOnParameterChange]);

  // If currentPostcode or currentIndoorTemp are meant to reset/initialize the form,
  // we might need a separate mechanism or reconsider the state ownership.
  // For now, assuming internal state takes precedence after initial render.
  // The original useEffects for syncing with props are removed as per task T003's intent
  // for internal management.

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Parameters</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="postcode" className="block text-gray-700 text-sm font-bold mb-2">
            UK Postcode:
          </label>
          <input
            type="text"
            id="postcode"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., SW7"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="indoorTemp" className="block text-gray-700 text-sm font-bold mb-2">
            Indoor Temperature (&deg;C):
          </label>
          <input
            type="number"
            id="indoorTemp"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., 20"
            value={indoorTemp}
            onChange={(e) => setIndoorTemp(parseInt(e.target.value, 10))}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ParameterForm;