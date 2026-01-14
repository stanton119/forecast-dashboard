import { describe, it, expect } from 'vitest';
import { isValidPostcode } from '../../src/lib/postcode';

describe('Postcode Validation', () => {
  it('should return true for a valid postcode', () => {
    expect(isValidPostcode('SW7 2AZ')).toBe(true);
  });

  it('should return true for a valid postcode without a space', () => {
    expect(isValidPostcode('SW72AZ')).toBe(true);
  });

  it('should return true for a valid postcode with lowercase letters', () => {
    expect(isValidPostcode('sw7 2az')).toBe(true);
  });

  it('should return false for an invalid postcode', () => {
    expect(isValidPostcode('INVALID')).toBe(false);
  });

    it('should return false for an empty string', () => {
    expect(isValidPostcode('')).toBe(false);
    });

    it('should return false for a null value', () => {
    expect(isValidPostcode(null)).toBe(false);
    });
});
