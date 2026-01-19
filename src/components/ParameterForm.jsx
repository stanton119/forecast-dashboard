import React from 'react';

const ParameterForm = ({ postcode, indoorTemp, onPostcodeChange, onIndoorTempChange, isLoading }) => {
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
            onChange={(e) => onPostcodeChange(e.target.value)}
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
            onChange={(e) => onIndoorTempChange(parseInt(e.target.value, 10))}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ParameterForm;
