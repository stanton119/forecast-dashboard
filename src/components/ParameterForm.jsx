import React, { useEffect, useCallback } from 'react';
import { debounce } from '../lib/utils/debounce';

const ParameterForm = ({ onParameterChange, currentPostcode, currentIndoorTemp, isLoading }) => {
  // Use currentPostcode and currentIndoorTemp directly as values for a controlled component
  // The state is now managed by the parent component (ForecastPage)

  // Debounced version of onParameterChange
  // It's crucial that this debounced function's dependencies are stable
  const debouncedOnParameterChange = useCallback(
    debounce((newPostcode, newIndoorTemp) => {
      onParameterChange(newPostcode, newIndoorTemp);
    }, 500), // 500ms debounce
    [onParameterChange] // onParameterChange itself should be stable (e.g., wrapped in useCallback in parent)
  );

  // Effect to call debouncedOnParameterChange when currentPostcode or currentIndoorTemp props change
  useEffect(() => {
    // Only call if both postcode and indoorTemp have values
    if (currentPostcode && currentIndoorTemp) {
      debouncedOnParameterChange(currentPostcode, currentIndoorTemp);
    }
  }, [currentPostcode, currentIndoorTemp, debouncedOnParameterChange]); // Now depends on props

  // Handlers for input changes, directly call the debounced function
  const handlePostcodeChange = (e) => {
    debouncedOnParameterChange(e.target.value, currentIndoorTemp);
  };

  const handleIndoorTempChange = (e) => {
    debouncedOnParameterChange(currentPostcode, parseInt(e.target.value, 10));
  };

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
            value={currentPostcode || ''} // Bound to prop
            onChange={handlePostcodeChange}
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
            value={currentIndoorTemp || ''} // Bound to prop
            onChange={handleIndoorTempChange}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ParameterForm;
