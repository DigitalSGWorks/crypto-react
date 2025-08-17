import { useState, useEffect, useCallback } from 'react';
import { fetchCryptoData, fetchTrendingData, fetchHistoricalData } from '../services/cryptoApiService';

export const useCryptoData = (currency = 'USD') => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCryptoData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCryptoData(currency);
      setCryptoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    loadCryptoData();
  }, [loadCryptoData]);

  return { cryptoData, loading, error, refetch: loadCryptoData };
};

export const useTrendingData = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTrendingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrendingData();
      // Extract the coins array from the API response
      const coinsData = data?.coins || [];
      setTrendingData(coinsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingData();
  }, [loadTrendingData]);

  return { trendingData, loading, error, refetch: loadTrendingData };
};

export const useHistoricalData = (coinId, days, currency) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistoricalData = useCallback(async () => {
    if (!coinId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHistoricalData(coinId, days, currency);
      setHistoricalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId, days, currency]);

  useEffect(() => {
    loadHistoricalData();
  }, [loadHistoricalData]);

  return { historicalData, loading, error, refetch: loadHistoricalData };
};
