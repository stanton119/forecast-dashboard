import React from 'react';

const Attribution = () => {
  return (
    <div className="text-center text-sm text-gray-500 mt-8">
      <p>
        Data provided by{' '}
        <a
          href="https://www.bbc.co.uk/weather/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          BBC Weather
        </a>
        .
      </p>
    </div>
  );
};

export default Attribution;
