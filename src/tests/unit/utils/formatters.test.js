import { 
  formatNumberWithCommas, 
  formatCurrency, 
  formatPercentage, 
  formatMarketCap, 
  formatDate, 
  truncateText 
} from '../../../utils/formatters';

describe('Formatters', () => {
  describe('formatNumberWithCommas', () => {
    it('should format numbers with commas', () => {
      expect(formatNumberWithCommas(1000)).toBe('1,000');
      expect(formatNumberWithCommas(1000000)).toBe('1,000,000');
    });

    it('should handle null, undefined and NaN values', () => {
      expect(formatNumberWithCommas(null)).toBe('0');
      expect(formatNumberWithCommas(undefined)).toBe('0');
      expect(formatNumberWithCommas(NaN)).toBe('0');
    });

    it('should handle zero and small numbers', () => {
      expect(formatNumberWithCommas(0)).toBe('0');
      expect(formatNumberWithCommas(123)).toBe('123');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });

    it('should handle null, undefined and NaN values', () => {
      expect(formatCurrency(null, 'USD')).toBe('$0.00');
      expect(formatCurrency(undefined, 'USD')).toBe('$0.00');
      expect(formatCurrency(NaN, 'USD')).toBe('$0.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%');
      expect(formatPercentage(-3.2)).toBe('-3.20%');
    });

    it('should handle null, undefined and NaN values', () => {
      expect(formatPercentage(null)).toBe('0.00%');
      expect(formatPercentage(undefined)).toBe('0.00%');
      expect(formatPercentage(NaN)).toBe('0.00%');
    });

    it('should handle zero and small values', () => {
      expect(formatPercentage(0)).toBe('+0.00%');
      expect(formatPercentage(0.1)).toBe('+0.10%');
    });
  });

  describe('formatMarketCap', () => {
    it('should format market cap in billions', () => {
      expect(formatMarketCap(1000000000000, 'USD')).toBe('1,000.00B');
    });

    it('should format market cap in millions', () => {
      expect(formatMarketCap(500000000, 'USD')).toBe('500.00M');
    });

    it('should handle null, undefined and NaN values', () => {
      expect(formatMarketCap(null, 'USD')).toBe('$0.00');
      expect(formatMarketCap(undefined, 'USD')).toBe('$0.00');
      expect(formatMarketCap(NaN, 'USD')).toBe('$0.00');
    });

    it('should handle small values', () => {
      expect(formatMarketCap(1000, 'USD')).toBe('1,000.00');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date, 'short')).toBe('01/01/2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate(NaN)).toBe('');
    });

    it('should handle different formats', () => {
      const date = new Date('2024-01-01T12:30:00');
      expect(formatDate(date, 'time')).toMatch(/^\d{1,2}:\d{2}\s[AP]M$/);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle null, undefined and non-string values', () => {
      expect(truncateText(null)).toBe(null);
      expect(truncateText(undefined)).toBe(undefined);
      expect(truncateText(123)).toBe(123);
    });
  });
});
