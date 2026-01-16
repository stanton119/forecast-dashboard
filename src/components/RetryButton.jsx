// src/components/RetryButton.jsx
import React from 'react';

/**
 * A simple button component to trigger a retry action.
 * @param {Object} props
 * @param {function} props.onRetry - Function to call when the button is clicked.
 * @param {string} [props.label='Retry'] - Optional label for the button.
 */
function RetryButton({ onRetry, label = 'Retry' }) {
  return (
    <button
      onClick={onRetry}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {label}
    </button>
  );
}

export default RetryButton;
