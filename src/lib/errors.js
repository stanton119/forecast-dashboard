// src/lib/errors.js

/**
 * Provides a generic user-friendly error message for API failures.
 * @param {Error} [error] - The original error object, for logging or debugging purposes.
 * @returns {string} A user-friendly error message.
 */
export const getFriendlyErrorMessage = (error) => {
  // Log the actual error for debugging, but return a generic message to the user.
  if (error) {
    console.error('API Error caught:', error);
  }
  return 'Forecast data unavailable. Please try again later.';
};
