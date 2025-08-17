import {
  isValidCryptoData,
  isValidCoinData,
  isValidHistoricalData,
  isValidCurrency,
  isValidDays,
  sanitizeSearchTerm,
  validatePaginationParams,
} from '../../../utils/validators';

describe('Validators Utils', () => {
  describe('isValidCryptoData', () => {
    it('should return true for valid crypto data array', () => {
      const validData = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth' },
      ];
      expect(isValidCryptoData(validData)).toBe(true);
    });

    it('should return false for invalid data', () => {
      expect(isValidCryptoData(null)).toBe(false);
      expect(isValidCryptoData(undefined)).toBe(false);
      expect(isValidCryptoData('not an array')).toBe(false);
      expect(isValidCryptoData([])).toBe(true);
    });

    it('should return false for array with invalid items', () => {
      const invalidData = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
        { name: 'Ethereum', symbol: 'eth' }, // missing id
      ];
      expect(isValidCryptoData(invalidData)).toBe(false);
    });
  });

  describe('isValidCoinData', () => {
    it('should return true for valid coin data', () => {
      const validCoin = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        market_data: { current_price: { usd: 50000 } },
      };
      expect(isValidCoinData(validCoin)).toBe(true);
    });

    it('should return false for invalid coin data', () => {
      expect(isValidCoinData(null)).toBe(false);
      expect(isValidCoinData(undefined)).toBe(false);
      expect(isValidCoinData({})).toBe(false);
      expect(isValidCoinData({ id: 'bitcoin' })).toBe(false);
    });
  });

  describe('isValidHistoricalData', () => {
    it('should return true for valid historical data', () => {
      const validData = {
        prices: [[1640995200000, 50000], [1641081600000, 51000]],
      };
      expect(isValidHistoricalData(validData)).toBe(true);
    });

    it('should return false for invalid historical data', () => {
      expect(isValidHistoricalData(null)).toBe(false);
      expect(isValidHistoricalData(undefined)).toBe(false);
      expect(isValidHistoricalData({})).toBe(false);
      expect(isValidHistoricalData({ prices: [] })).toBe(false);
      expect(isValidHistoricalData({ prices: 'not an array' })).toBe(false);
    });
  });

  describe('isValidCurrency', () => {
    it('should return true for valid currencies', () => {
      expect(isValidCurrency('USD')).toBe(true);
      expect(isValidCurrency('EUR')).toBe(true);
      expect(isValidCurrency('GBP')).toBe(true);
      expect(isValidCurrency('usd')).toBe(true); // case insensitive
    });

    it('should return false for invalid currencies', () => {
      expect(isValidCurrency('INVALID')).toBe(false);
      expect(isValidCurrency('')).toBe(false);
      expect(isValidCurrency(null)).toBe(false);
      expect(isValidCurrency(undefined)).toBe(false);
    });
  });

  describe('isValidDays', () => {
    it('should return true for valid days', () => {
      expect(isValidDays(1)).toBe(true);
      expect(isValidDays(7)).toBe(true);
      expect(isValidDays(30)).toBe(true);
      expect(isValidDays(365)).toBe(true);
    });

    it('should return false for invalid days', () => {
      expect(isValidDays(2)).toBe(false);
      expect(isValidDays(15)).toBe(false);
      expect(isValidDays(100)).toBe(false);
      expect(isValidDays(0)).toBe(false);
      expect(isValidDays(-1)).toBe(false);
      expect(isValidDays('invalid')).toBe(false);
    });
  });

  describe('sanitizeSearchTerm', () => {
    it('should sanitize search terms correctly', () => {
      expect(sanitizeSearchTerm('  Bitcoin  ')).toBe('bitcoin');
      expect(sanitizeSearchTerm('ETHEREUM')).toBe('ethereum');
      expect(sanitizeSearchTerm('')).toBe('');
    });

    it('should handle invalid inputs', () => {
      expect(sanitizeSearchTerm(null)).toBe('');
      expect(sanitizeSearchTerm(undefined)).toBe('');
      expect(sanitizeSearchTerm(123)).toBe('');
      expect(sanitizeSearchTerm({})).toBe('');
    });
  });

  describe('validatePaginationParams', () => {
    it('should validate and normalize pagination parameters', () => {
      expect(validatePaginationParams(0, 20)).toEqual({ validPage: 0, validItemsPerPage: 20 });
      expect(validatePaginationParams(5, 50)).toEqual({ validPage: 5, validItemsPerPage: 50 });
    });

    it('should handle negative values', () => {
      expect(validatePaginationParams(-1, 20)).toEqual({ validPage: 0, validItemsPerPage: 20 });
      expect(validatePaginationParams(0, -10)).toEqual({ validPage: 0, validItemsPerPage: 1 });
    });

    it('should limit items per page to maximum', () => {
      expect(validatePaginationParams(0, 200)).toEqual({ validPage: 0, validItemsPerPage: 100 });
    });

    it('should handle non-numeric inputs', () => {
      expect(validatePaginationParams('invalid', 'invalid')).toEqual({ validPage: 0, validItemsPerPage: 20 });
    });
  });
});
