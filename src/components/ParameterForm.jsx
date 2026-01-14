import React, { useState, useEffect } from 'react';

const ParameterForm = ({ onParameterChange, currentPostcode, currentIndoorTemp, isLoading }) => {
  const [postcode, setPostcode] = useState(currentPostcode);
  const [indoorTemp, setIndoorTemp] = useState(currentIndoorTemp);

  useEffect(() => {
    setPostcode(currentPostcode);
  }, [currentPostcode]);

  useEffect(() => {
    setIndoorTemp(currentIndoorTemp);
  }, [currentIndoorTemp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onParameterChange(postcode, indoorTemp);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Parameters</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Forecast'}
        </button>
      </form>
    </div>
  );
};

export default ParameterForm;