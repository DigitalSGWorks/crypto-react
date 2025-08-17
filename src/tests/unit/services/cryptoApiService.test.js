import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('CryptoApiService', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
    };
    
    // Mock axios.create to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('API Endpoints', () => {
    it('should have correct API endpoints', () => {
      expect(API_ENDPOINTS.COINS_MARKETS).toBe('/coins/markets');
      expect(API_ENDPOINTS.TRENDING).toBe('/search/trending');
      expect(API_ENDPOINTS.EXCHANGE_RATES).toBe('/exchange_rates');
      expect(API_ENDPOINTS.COIN).toBe('/coins');
      expect(API_ENDPOINTS.COIN_MARKET_CHART).toBe('/coins/{id}/market_chart');
    });
  });

  describe('Axios Configuration', () => {
    it('should create axios instance with correct configuration', () => {
      // Trigger axios.create by importing the service
      require('../../../services/cryptoApiService');
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.coingecko.com/api/v3',
        timeout: 10000,
      });
    });
  });

  describe('Rate Limiting Configuration', () => {
    it('should have correct rate limiting configuration', () => {
      const service = require('../../../services/cryptoApiService').default;
      const rateLimitInfo = service.getRateLimitInfo();
      
      expect(rateLimitInfo.maxRetries).toBe(3);
      expect(rateLimitInfo.baseDelay).toBe(2000);
      expect(rateLimitInfo.maxDelay).toBe(30000);
      expect(rateLimitInfo.retryStatusCodes).toEqual([429, 503]);
    });
  });

  describe('Retry Logic', () => {
    it('should retry on rate limit errors', async () => {
      const service = require('../../../services/cryptoApiService').default;
      
      // Mock axios to fail twice with 429, then succeed
      mockAxiosInstance.get
        .mockRejectedValueOnce({ response: { status: 429 } })
        .mockRejectedValueOnce({ response: { status: 429 } })
        .mockResolvedValueOnce({ data: { success: true } });
      
      // Mock console.warn to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = await service.makeRequest('/test');
      
      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      
      consoleSpy.mockRestore();
    });

    it('should retry on service unavailable errors', async () => {
      const service = require('../../../services/cryptoApiService').default;
      
      // Mock axios to fail once with 503, then succeed
      mockAxiosInstance.get
        .mockRejectedValueOnce({ response: { status: 503 } })
        .mockResolvedValueOnce({ data: { success: true } });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = await service.makeRequest('/test');
      
      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      
      consoleSpy.mockRestore();
    });

    it('should not retry on non-retryable errors', async () => {
      const service = require('../../../services/cryptoApiService').default;
      
      // Mock axios to fail with 404 (not retryable)
      mockAxiosInstance.get.mockRejectedValueOnce({ response: { status: 404 } });
      
      await expect(service.makeRequest('/test')).rejects.toThrow('Resource not found.');
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should stop retrying after max retries', async () => {
      const service = require('../../../services/cryptoApiService').default;
      
      // Mock axios to always fail with 429
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 429 } });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await expect(service.makeRequest('/test')).rejects.toThrow('Rate limit exceeded. Please wait before making another request.');
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // Initial + 3 retries
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Backoff Delay Calculation', () => {
    it('should calculate exponential backoff with jitter', () => {
      const service = require('../../../services/cryptoApiService').default;
      
      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      const delay1 = service.calculateBackoffDelay(0);
      const delay2 = service.calculateBackoffDelay(1);
      const delay3 = service.calculateBackoffDelay(2);
      
      // Base delay is 2000ms, so delays should be approximately:
      // 2000 + 500 = 2500ms
      // 4000 + 500 = 4500ms  
      // 8000 + 500 = 8500ms
      expect(delay1).toBeGreaterThanOrEqual(2000);
      expect(delay1).toBeLessThanOrEqual(3000);
      expect(delay2).toBeGreaterThanOrEqual(4000);
      expect(delay2).toBeLessThanOrEqual(5000);
      expect(delay3).toBeGreaterThanOrEqual(8000);
      expect(delay3).toBeLessThanOrEqual(9000);
      
      Math.random = originalRandom;
    });

    it('should cap delay at maximum value', () => {
      const service = require('../../../services/cryptoApiService').default;
      
      const delay = service.calculateBackoffDelay(10); // Should exceed max delay
      expect(delay).toBeLessThanOrEqual(30000); // maxDelay
    });
  });

  describe('Error Handling', () => {
    it('should handle rate limit errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Simulate rate limit error
      const error = { response: { status: 429 } };
      
      // Import the service to trigger error handling
      const service = require('../../../services/cryptoApiService').default;
      
      // Call handleApiError directly and expect it to throw
      expect(() => service.handleApiError(error)).toThrow('Rate limit exceeded. Please wait before making another request.');
      
      expect(consoleSpy).toHaveBeenCalledWith('Rate limit exceeded. Please wait before making another request.');
      expect(consoleSpy).toHaveBeenCalledWith('CoinGecko API limits: Every 30 seconds for all API plans, last data point available 10 minutes after midnight UTC.');
      
      consoleSpy.mockRestore();
    });

    it('should handle forbidden errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = { response: { status: 403 } };
      const service = require('../../../services/cryptoApiService').default;
      
      expect(() => service.handleApiError(error)).toThrow('Access forbidden. Please check your API key.');
      
      expect(consoleSpy).toHaveBeenCalledWith('Access forbidden. Please check your API key.');
      
      consoleSpy.mockRestore();
    });

    it('should handle service unavailable errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = { response: { status: 503 } };
      const service = require('../../../services/cryptoApiService').default;
      
      expect(() => service.handleApiError(error)).toThrow('Service temporarily unavailable.');
      
      expect(consoleSpy).toHaveBeenCalledWith('Service temporarily unavailable.');
      
      consoleSpy.mockRestore();
    });

    it('should handle general API errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = { message: 'Network error' };
      const service = require('../../../services/cryptoApiService').default;
      
      expect(() => service.handleApiError(error)).toThrow('Network error');
      
      expect(consoleSpy).toHaveBeenCalledWith('API request failed:', 'Network error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Service Functions', () => {
    it('should export all required functions', () => {
      const service = require('../../../services/cryptoApiService');
      
      expect(typeof service.fetchCryptoData).toBe('function');
      expect(typeof service.fetchTrendingData).toBe('function');
      expect(typeof service.fetchHistoricalData).toBe('function');
      expect(typeof service.fetchCoinDetails).toBe('function');
      expect(typeof service.fetchExchangeRates).toBe('function');
      expect(typeof service.default).toBe('object');
    });
  });
});
