export const API_ENDPOINTS = {
  COINS_MARKETS: '/coins/markets',
  TRENDING: '/search/trending',
  EXCHANGE_RATES: '/exchange_rates',
  COIN: '/coins',
  COIN_MARKET_CHART: '/coins/{id}/market_chart',
};

export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
};

export const API_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  TIMEOUT: 10000,
  RATE_LIMIT_DELAY: 2000, // 2 seconds between requests
  MAX_RETRIES: 3,
};
