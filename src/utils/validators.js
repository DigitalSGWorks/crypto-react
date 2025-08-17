export const isValidCryptoData = (data) => {
  if (!data || !Array.isArray(data)) return false;
  
  return data.every(item => 
    item && 
    typeof item === 'object' && 
    item.id && 
    item.name && 
    item.symbol
  );
};

export const isValidCoinData = (coin) => {
  if (!coin || typeof coin !== 'object') return false;
  
  return !!(coin.id && coin.name && coin.symbol && coin.market_data);
};

export const isValidHistoricalData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  return !!(Array.isArray(data.prices) && data.prices.length > 0);
};

export const isValidCurrency = (currency) => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];
  return validCurrencies.includes(currency?.toUpperCase());
};

export const isValidDays = (days) => {
  const validDays = [1, 7, 14, 30, 90, 180, 365];
  return validDays.includes(Number(days));
};

export const sanitizeSearchTerm = (searchTerm) => {
  if (typeof searchTerm !== 'string') return '';
  return searchTerm.trim().toLowerCase();
};

export const validatePaginationParams = (page, itemsPerPage) => {
  const validPage = Math.max(0, Math.floor(Number(page)) || 0);
  const validItemsPerPage = Math.max(1, Math.min(100, Math.floor(Number(itemsPerPage)) || 20));
  
  return { validPage, validItemsPerPage };
};
