import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';

class CryptoApiService {
  constructor(baseURL = 'https://api.coingecko.com/api/v3') {
    // Use external CORS proxies for production (Firebase Hosting)
    this.baseURL = baseURL;
    this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    this.localProxyURL = '/api';
    
    // Detect browsers for specific handling
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isChrome = /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);
    this.isFirefox = /firefox/i.test(navigator.userAgent);
    
    console.log('Browser detected:', {
      isSafari: this.isSafari,
      isChrome: this.isChrome,
      isFirefox: this.isFirefox,
      userAgent: navigator.userAgent
    });
    
         this.corsProxyURLs = [
       'https://corsproxy.io/?',
       'https://api.allorigins.win/raw?url=',
       'https://thingproxy.freeboard.io/fetch/',
       'https://cors-anywhere.herokuapp.com/'
     ];
    this.currentProxyIndex = 0;
    this.useProxy = this.isProduction; // Use proxy by default in production
    this.proxyType = this.isProduction ? 'external' : 'none'; // 'none', 'local', 'external'
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 20000, // Increased timeout for all browsers
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Rate limiting configuration based on CoinGecko documentation
    this.rateLimitConfig = {
      maxRetries: 5, // Increased retries
      baseDelay: 1000, // Reduced base delay
      maxDelay: 15000, // Reduced max delay
      retryStatusCodes: [429, 503, 408, 500, 502, 504], // More retry status codes
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
      
      let url = endpoint;
      
      // Browser-specific handling
      if (this.isProduction && this.proxyType === 'external') {
        // Safari: Try direct request first, then proxy
        if (this.isSafari) {
          console.log('Safari detected, trying direct request first...');
          try {
            this.axiosInstance.defaults.baseURL = this.baseURL;
            const response = await this.axiosInstance.get(endpoint, { params });
            return response.data;
          } catch (safariError) {
            console.warn('Safari direct request failed, falling back to proxy...');
          }
        }
        
        // Chrome: Use simplified parameters to avoid 422 errors
        if (this.isChrome) {
          console.log('Chrome detected, using simplified parameters...');
          const chromeParams = this.simplifyParamsForChrome(params);
          try {
            this.axiosInstance.defaults.baseURL = this.baseURL;
            const response = await this.axiosInstance.get(endpoint, { params: chromeParams });
            return response.data;
          } catch (chromeError) {
            console.warn('Chrome direct request failed, falling back to proxy...');
          }
        }
        const proxyUrl = this.corsProxyURLs[this.currentProxyIndex];
        // Construct the full URL properly with parameters
        const fullUrl = this.baseURL + endpoint;
        
        // Simplified URL construction to avoid 422 errors
        const paramString = Object.keys(params)
          .filter(key => params[key] !== undefined && params[key] !== null)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
          .join('&');
        
        const urlWithParams = fullUrl + (paramString ? `?${paramString}` : '');
        url = proxyUrl + encodeURIComponent(urlWithParams);
        // Reset baseURL for this request
        this.axiosInstance.defaults.baseURL = '';
      } else {
        this.axiosInstance.defaults.baseURL = this.baseURL;
      }
      
      const response = await this.axiosInstance.get(url);
      
      // Validate response data
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      // Handle cases where proxy returns HTML instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<html>')) {
        throw new Error('Proxy returned HTML instead of JSON data');
      }
      
      return response.data;
    } catch (error) {
                   // Try next CORS proxy if current one fails
       if (this.isProduction && this.proxyType === 'external' && 
           (error.response?.status === 403 || error.response?.status === 429 || 
            error.response?.status === 404 || error.response?.status === 422 ||
            error.message.includes('CORS') || error.message.includes('HTML instead of JSON') || 
            error.message.includes('No data received') || error.message.includes('Safari compatibility') ||
            error.message.includes('market_chart') || error.message.includes('Market chart') ||
            error.code === 'ERR_NETWORK' || error.code === 'ERR_CERT_DATE_INVALID' || 
            error.code === 'ECONNABORTED')) {
        
        console.warn(`Proxy ${this.currentProxyIndex + 1} failed, trying next...`);
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxyURLs.length;
        
                 // If we've tried all proxies, try direct request
         if (this.currentProxyIndex === 0) {
           console.warn('All proxies failed, trying direct request...');
           this.proxyType = 'none';
           this.axiosInstance.defaults.baseURL = this.baseURL;
           // Reduced delay for faster fallback
           await this.delay(1000);
          
                     // Try direct request with simplified parameters
           try {
             const simplifiedParams = { ...params };
             // Remove potentially problematic parameters
             delete simplifiedParams.sparkline;
             delete simplifiedParams.locale;
             
                           // Special handling for market_chart endpoint
              if (endpoint.includes('market_chart')) {
                // More aggressive parameter simplification for market_chart
                if (simplifiedParams.days > 90) {
                  simplifiedParams.days = 180; // Try 6 months instead of 1 year
                } else if (simplifiedParams.days > 30) {
                  simplifiedParams.days = 60; // Try 2 months instead of 3 months
                } else {
                  simplifiedParams.days = Math.min(simplifiedParams.days || 1, 30);
                }
                console.log('Trying market_chart with simplified params:', simplifiedParams);
              }
             
             const response = await this.axiosInstance.get(endpoint, { params: simplifiedParams });
             return response.data;
           } catch (directError) {
             console.warn('Direct request also failed, throwing error');
             this.handleApiError(directError);
             throw directError;
           }
        }
        
        return this.makeRequest(endpoint, params, retryCount);
      }
      
      // In development, try local proxy first if direct request fails
      if (!this.isProduction && !this.useProxy && (error.message.includes('CORS') || error.code === 'ERR_NETWORK')) {
        console.warn('Direct API request failed, trying local proxy...');
        this.useProxy = true;
        this.proxyType = 'local';
        this.axiosInstance.defaults.baseURL = this.localProxyURL;
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

  simplifyParamsForChrome(params) {
    // Chrome-specific parameter simplification to avoid 422 errors
    const simplified = { ...params };
    
    // Remove potentially problematic parameters for Chrome
    delete simplified.sparkline;
    delete simplified.locale;
    
    // For market_chart endpoint, limit days
    if (simplified.days) {
      if (simplified.days > 90) {
        simplified.days = 180; // 6 months instead of 1 year
      } else if (simplified.days > 30) {
        simplified.days = 60; // 2 months instead of 3 months
      } else {
        simplified.days = Math.min(simplified.days, 30);
      }
    }
    
    // For coins/markets endpoint, limit per_page
    if (simplified.per_page && simplified.per_page > 100) {
      simplified.per_page = 100;
    }
    
    console.log('Chrome simplified params:', simplified);
    return simplified;
  }

  resetProxy() {
    this.useProxy = false;
    this.proxyType = 'none';
    this.currentProxyIndex = 0;
    this.axiosInstance.defaults.baseURL = this.baseURL;
  }

  handleApiError(error) {
    // Handle CORS errors specifically
    if (error.message && (error.message.includes('CORS') || error.message.includes('Network Error'))) {
      console.error('CORS/Network error detected. This might be due to API restrictions or network issues.');
      console.error('CoinGecko API may have temporary restrictions. Please try again later.');
      throw new Error('CORS error: API access temporarily restricted. Please try again later.');
    }
    
    // Handle 422 errors (Unprocessable Entity) - often Safari-specific issues
    if (error.response?.status === 422) {
      console.error('422 error detected. This might be due to Safari-specific request formatting issues.');
      console.error('Attempting to retry with different parameters...');
      throw new Error('Safari compatibility issue. Please try again.');
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
    // Browser-specific parameters
    let params;
    
    if (this.isChrome) {
      // Chrome: Use simplified parameters to avoid 422 errors
      params = {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: Math.min(perPage, 100), // Limit to 100 for Chrome
        page,
        // Remove sparkline and locale for Chrome
      };
    } else if (this.isSafari) {
      // Safari: Use full parameters
      params = {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        locale: 'en',
      };
    } else {
      // Other browsers: Use standard parameters
      params = {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        locale: 'en',
      };
    }

    console.log(`Fetching crypto data for ${this.isChrome ? 'Chrome' : this.isSafari ? 'Safari' : 'Other'} with params:`, params);
    return this.makeRequest(API_ENDPOINTS.COINS_MARKETS, params);
  }

  async fetchTrendingData() {
    return this.makeRequest(API_ENDPOINTS.TRENDING);
  }

  async fetchHistoricalData(coinId, days, currency = 'USD') {
    const endpoint = API_ENDPOINTS.COIN_MARKET_CHART.replace('{id}', coinId);
    
    // Browser-specific parameters for historical data
    let params;
    
    if (this.isChrome) {
      // Chrome: Use more conservative parameters
      let chromeDays = days;
      if (days > 90) {
        chromeDays = 180; // 6 months instead of 1 year
      } else if (days > 30) {
        chromeDays = 60; // 2 months instead of 3 months
      } else {
        chromeDays = Math.min(days, 30);
      }
      
      params = {
        vs_currency: currency,
        days: chromeDays,
      };
      
      console.log(`Chrome historical data: ${days} days → ${chromeDays} days`);
    } else {
      // Safari and other browsers: Use original parameters
      params = {
        vs_currency: currency,
        days,
      };
    }
    
    // Special handling for market_chart endpoint which can be problematic with CORS
    try {
      return await this.makeRequest(endpoint, params);
    } catch (error) {
      console.warn('Market chart request failed, trying with simplified parameters...');
      
      // Try different fallback strategies based on the requested days
      let fallbackDays = days;
      
      if (days > 90) {
        // For 1 year (365 days), try 180 days first
        fallbackDays = 180;
        console.log('Trying fallback to 180 days for 1 year request');
      } else if (days > 30) {
        // For 3 months (90 days), try 60 days first
        fallbackDays = 60;
        console.log('Trying fallback to 60 days for 3 months request');
      } else {
        // For other cases, limit to 30 days
        fallbackDays = Math.min(days, 30);
        console.log('Trying fallback to 30 days max');
      }
      
      const simplifiedParams = {
        vs_currency: currency,
        days: fallbackDays,
      };
      
      try {
        return await this.makeRequest(endpoint, simplifiedParams);
      } catch (secondError) {
        // If still failing, try with the most basic parameters
        console.warn('Second attempt failed, trying with minimal parameters...');
        const minimalParams = {
          vs_currency: currency,
          days: Math.min(days, 7), // Last resort: 7 days max
        };
        
        return await this.makeRequest(endpoint, minimalParams);
      }
    }
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
