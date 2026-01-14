// src/lib/utils/debounce.js
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to wait after the last call.
 * @param {boolean} [immediate=false] If true, trigger the function on the leading edge.
 * @returns {Function} A debounced version of the original function.
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  let result;

  return function executed(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      result = func.apply(context, args);
    }

    return result;
  };
}
