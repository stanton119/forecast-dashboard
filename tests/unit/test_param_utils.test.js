import { describe, it, expect } from 'vitest';
import { areOutdoorParametersChanged } from '../../src/lib/utils/param-utils';

describe('Parameter Utilities', () => {
  describe('areOutdoorParametersChanged', () => {
    it('should return false if postcode is the same', () => {
      const oldParams = { postcode: 'SW7', indoorTemp: 20 };
      const newParams = { postcode: 'SW7', indoorTemp: 22 };
      expect(areOutdoorParametersChanged(oldParams, newParams)).toBe(false);
    });

    it('should return true if postcode has changed', () => {
      const oldParams = { postcode: 'SW7', indoorTemp: 20 };
      const newParams = { postcode: 'NW1', indoorTemp: 20 };
      expect(areOutdoorParametersChanged(oldParams, newParams)).toBe(true);
    });

    it('should return true if postcode has changed, even if indoorTemp also changed', () => {
      const oldParams = { postcode: 'SW7', indoorTemp: 20 };
      const newParams = { postcode: 'NW1', indoorTemp: 22 };
      expect(areOutdoorParametersChanged(oldParams, newParams)).toBe(true);
    });

    it('should handle undefined postcodes gracefully (return true if one is defined and other is not)', () => {
      const oldParams1 = { postcode: undefined, indoorTemp: 20 };
      const newParams1 = { postcode: 'SW7', indoorTemp: 20 };
      expect(areOutdoorParametersChanged(oldParams1, newParams1)).toBe(true);

      const oldParams2 = { postcode: 'SW7', indoorTemp: 20 };
      const newParams2 = { postcode: undefined, indoorTemp: 20 };
      expect(areOutdoorParametersChanged(oldParams2, newParams2)).toBe(true);
    });

    it('should return false if both postcodes are undefined', () => {
      const oldParams = { postcode: undefined, indoorTemp: 20 };
      const newParams = { postcode: undefined, indoorTemp: 22 };
      expect(areOutdoorParametersChanged(oldParams, newParams)).toBe(false);
    });
  });
});
