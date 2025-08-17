import React, { createContext, useContext, useState, useCallback } from 'react';
import { SUPPORTED_CURRENCIES } from '../config/apiEndpoints';
import { isValidCurrency } from '../utils/validators';

const CryptoContext = createContext();

export const useCryptoContext = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCryptoContext must be used within a CryptoProvider');
  }
  return context;
};

export const CryptoProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const updateCurrency = useCallback((newCurrency) => {
    if (!isValidCurrency(newCurrency)) {
      console.warn(`Invalid currency: ${newCurrency}`);
      return;
    }

    const normalizedCurrency = newCurrency.toUpperCase();
    setSelectedCurrency(normalizedCurrency);
  }, []);

  const getCurrencyInfo = useCallback(() => {
    return SUPPORTED_CURRENCIES[selectedCurrency] || SUPPORTED_CURRENCIES.USD;
  }, [selectedCurrency]);

  const contextValue = {
    currency: selectedCurrency,
    symbol: getCurrencyInfo().symbol,
    currencyName: getCurrencyInfo().name,
    updateCurrency,
    getCurrencyInfo,
    supportedCurrencies: Object.keys(SUPPORTED_CURRENCIES),
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
};

// Export pour compatibilité avec l'ancien code
export const CryptoState = () => {
  const context = useCryptoContext();
  return {
    currency: context.currency,
    symbol: context.symbol,
    setCurrency: context.updateCurrency,
  };
};

export default CryptoProvider;
