/**
 * Validates a UK postcode using a permissive regex.
 * @param {string | null | undefined} postcode - The postcode to validate.
 * @returns {boolean} True if the postcode is valid, false otherwise.
 */
export function isValidPostcode(postcode) {
  if (!postcode) {
    return false;
  }
  // Permissive regex for UK postcodes.
  // It allows for variations in spacing and case.
  const postcodeRegex = /^[a-z]{1,2}[0-9][a-z0-9]?\s?[0-9][a-z]{2}$/i;
  return postcodeRegex.test(postcode);
}
