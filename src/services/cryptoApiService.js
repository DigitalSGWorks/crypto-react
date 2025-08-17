import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';

class CryptoApiService {
  constructor(baseURL = 'https://api.coingecko.com/api/v3') {
    // Use external CORS proxies for production (Firebase Hosting)
    this.baseURL = baseURL;
    this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    this.localProxyURL = '/api';
    this.corsProxyURLs = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.currentProxyIndex = 0;
    this.useProxy = this.isProduction; // Use proxy by default in production
    this.proxyType = this.isProduction ? 'external' : 'none'; // 'none', 'local', 'external'
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CryptoReact/1.0',
      },
    });
    
    // Rate limiting configuration based on CoinGecko documentation
    this.rateLimitConfig = {
      maxRetries: 3,
      baseDelay: 2000, // 2 seconds base delay
      maxDelay: 30000, // 30 seconds max delay
      retryStatusCodes: [429, 503], // Retry on rate limit and service unavailable
    };
    
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  async makeRequest(endpoint, params = {}, retryCount = 0) {
    try {
      // Add delay between requests to respect rate limits
      if (this.requestQueue.length > 0) {
        await this.delay(1000); // 1 second delay between requests
      }
      
      // In production, start with external proxy
      if (this.isProduction && this.proxyType === 'external') {
        this.axiosInstance.defaults.baseURL = this.corsProxyURLs[this.currentProxyIndex] + this.baseURL;
      }
      
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      // In development, try local proxy first if direct request fails
      if (!this.isProduction && !this.useProxy && (error.message.includes('CORS') || error.code === 'ERR_NETWORK')) {
        console.warn('Direct API request failed, trying local proxy...');
        this.useProxy = true;
        this.proxyType = 'local';
        this.axiosInstance.defaults.baseURL = this.localProxyURL;
        return this.makeRequest(endpoint, params, retryCount);
      }
      
      // Try external CORS proxy if local proxy fails (development) or current proxy fails (production)
      if ((!this.isProduction && this.useProxy && this.proxyType === 'local' && 
           (error.response?.status === 403 || error.response?.status === 429 || error.code === 'ERR_NETWORK')) ||
          (this.isProduction && this.proxyType === 'external' && 
           (error.response?.status === 403 || error.response?.status === 429))) {
        console.warn('Current proxy failed, trying next external CORS proxy...');
        this.proxyType = 'external';
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxyURLs.length;
        this.axiosInstance.defaults.baseURL = this.corsProxyURLs[this.currentProxyIndex] + this.baseURL;
        return this.makeRequest(endpoint, params, retryCount);
      }
      
      // Check if we should retry the request
      if (this.shouldRetry(error, retryCount)) {
        const delay = this.calculateBackoffDelay(retryCount);
        console.warn(`API request failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${this.rateLimitConfig.maxRetries})`);
        await this.delay(delay);
        return this.makeRequest(endpoint, params, retryCount + 1);
      }
      
      this.handleApiError(error);
      throw error;
    }
  }

  shouldRetry(error, retryCount) {
    if (retryCount >= this.rateLimitConfig.maxRetries) {
      return false;
    }
    
    const statusCode = error.response?.status;
    return this.rateLimitConfig.retryStatusCodes.includes(statusCode);
  }

  calculateBackoffDelay(retryCount) {
    // Exponential backoff with jitter
    const exponentialDelay = this.rateLimitConfig.baseDelay * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000; // Random jitter up to 1 second
    const delay = Math.min(exponentialDelay + jitter, this.rateLimitConfig.maxDelay);
    
    return delay;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetProxy() {
    this.useProxy = false;
    this.proxyType = 'none';
    this.currentProxyIndex = 0;
    this.axiosInstance.defaults.baseURL = this.baseURL;
  }

  handleApiError(error) {
    // Handle CORS errors specifically
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS error detected. This might be due to API restrictions or network issues.');
      console.error('CoinGecko API may have temporary restrictions. Please try again later.');
      throw new Error('CORS error: API access temporarily restricted. Please try again later.');
    }
    
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please wait before making another request.');
      console.error('CoinGecko API limits: Every 30 seconds for all API plans, last data point available 10 minutes after midnight UTC.');
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    } else if (error.response?.status === 403) {
      console.error('Access forbidden. Please check your API key.');
      throw new Error('Access forbidden. Please check your API key.');
    } else if (error.response?.status === 503) {
      console.error('Service temporarily unavailable.');
      throw new Error('Service temporarily unavailable.');
    } else if (error.response?.status === 404) {
      console.error('Resource not found.');
      throw new Error('Resource not found.');
    } else if (error.response?.status === 400) {
      console.error('Bad request. Please check your parameters.');
      throw new Error('Bad request. Please check your parameters.');
    } else if (error.response?.status === 500) {
      console.error('Internal server error.');
      throw new Error('Internal server error.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout.');
      throw new Error('Request timeout. Please try again.');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error. Please check your connection.');
      throw new Error('Network error. Please check your connection.');
    } else {
      console.error('API request failed:', error.message);
      throw new Error(error.message || 'API request failed');
    }
  }

  async fetchCryptoData(currency = 'USD', perPage = 250, page = 1) {
    const params = {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: false,
      locale: 'en',
    };

    return this.makeRequest(API_ENDPOINTS.COINS_MARKETS, params);
  }

  async fetchTrendingData() {
    return this.makeRequest(API_ENDPOINTS.TRENDING);
  }

  async fetchHistoricalData(coinId, days, currency = 'USD') {
    const params = {
      vs_currency: currency,
      days,
    };

    const endpoint = API_ENDPOINTS.COIN_MARKET_CHART.replace('{id}', coinId);
    return this.makeRequest(endpoint, params);
  }

  async fetchCoinDetails(coinId) {
    return this.makeRequest(`${API_ENDPOINTS.COIN}/${coinId}`);
  }

  async fetchExchangeRates() {
    return this.makeRequest(API_ENDPOINTS.EXCHANGE_RATES);
  }

  // Method to get rate limit information
  getRateLimitInfo() {
    return {
      maxRetries: this.rateLimitConfig.maxRetries,
      baseDelay: this.rateLimitConfig.baseDelay,
      maxDelay: this.rateLimitConfig.maxDelay,
      retryStatusCodes: this.rateLimitConfig.retryStatusCodes,
    };
  }
}

// Instance singleton
const cryptoApiService = new CryptoApiService();

// Fonctions d'export pour compatibilité
export const fetchCryptoData = (currency, perPage, page) => 
  cryptoApiService.fetchCryptoData(currency, perPage, page);

export const fetchTrendingData = () => 
  cryptoApiService.fetchTrendingData();

export const fetchHistoricalData = (coinId, days, currency) => 
  cryptoApiService.fetchHistoricalData(coinId, days, currency);

export const fetchCoinDetails = (coinId) => 
  cryptoApiService.fetchCoinDetails(coinId);

export const fetchExchangeRates = () => 
  cryptoApiService.fetchExchangeRates();

export default cryptoApiService;
