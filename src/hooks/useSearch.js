import { useState, useMemo, useCallback } from 'react';

export const useSearch = (data, searchFields = ['name', 'symbol']) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || !data) return data;

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (!fieldValue) return false;
        
        return fieldValue.toLowerCase().includes(normalizedSearchTerm);
      });
    });
  }, [data, searchTerm, searchFields]);

  const updateSearchTerm = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    filteredData,
    updateSearchTerm,
    clearSearch,
    hasSearchTerm: searchTerm.trim().length > 0,
  };
};
