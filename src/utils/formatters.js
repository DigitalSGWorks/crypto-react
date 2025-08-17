export const formatNumberWithCommas = (number) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatNumberWithCommas(0) + getCurrencySymbol(currency);
  }

  // For prices less than 1, show 5 decimal places
  if (amount < 1 && amount > 0) {
    return formatNumberWithCommas(amount.toFixed(5)) + getCurrencySymbol(currency);
  }

  return formatNumberWithCommas(amount.toFixed(2)) + getCurrencySymbol(currency);
};

// Helper function to get currency symbols
const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$'
  };
  return symbols[currency] || currency;
};

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  
  const formattedValue = Math.abs(value).toFixed(decimals);
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formattedValue}%`;
};

export const formatMarketCap = (marketCap, currency = 'USD') => {
  if (marketCap === null || marketCap === undefined || isNaN(marketCap)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }
  
  const billion = 1000000000;
  const million = 1000000;
  
  if (marketCap >= billion) {
    return `${formatNumberWithCommas((marketCap / billion).toFixed(2))}B`;
  } else if (marketCap >= million) {
    return `${formatNumberWithCommas((marketCap / million).toFixed(2))}M`;
  } else {
    return formatNumberWithCommas(marketCap.toFixed(2));
  }
};

export const formatDate = (date, format = 'short') => {
  if (!date || isNaN(new Date(date).getTime())) return '';
  
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string' || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
