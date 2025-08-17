import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../../../hooks/useSearch';

describe('useSearch Hook', () => {
  const mockData = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC' },
    { id: '2', name: 'Ethereum', symbol: 'ETH' },
    { id: '3', name: 'Cardano', symbol: 'ADA' },
    { id: '4', name: 'Polkadot', symbol: 'DOT' },
  ];

  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useSearch(mockData));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredData).toEqual(mockData);
    expect(result.current.hasSearchTerm).toBe(false);
  });

  it('should filter data by name', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('Bitcoin');
    });

    expect(result.current.searchTerm).toBe('Bitcoin');
    expect(result.current.filteredData).toEqual([mockData[0]]);
    expect(result.current.hasSearchTerm).toBe(true);
  });

  it('should filter data by symbol', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('ETH');
    });

    expect(result.current.searchTerm).toBe('ETH');
    expect(result.current.filteredData).toEqual([mockData[1]]);
    expect(result.current.hasSearchTerm).toBe(true);
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('bitcoin');
    });

    expect(result.current.filteredData).toEqual([mockData[0]]);
  });

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('bit');
    });

    expect(result.current.filteredData).toEqual([mockData[0]]);
  });

  it('should handle empty search term', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('Bitcoin');
    });

    expect(result.current.filteredData).toHaveLength(1);

    act(() => {
      result.current.updateSearchTerm('');
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredData).toEqual(mockData);
    expect(result.current.hasSearchTerm).toBe(false);
  });

  it('should clear search', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('Bitcoin');
    });

    expect(result.current.hasSearchTerm).toBe(true);

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredData).toEqual(mockData);
    expect(result.current.hasSearchTerm).toBe(false);
  });

  it('should handle whitespace in search term', () => {
    const { result } = renderHook(() => useSearch(mockData));

    act(() => {
      result.current.updateSearchTerm('  Bitcoin  ');
    });

    expect(result.current.filteredData).toEqual([mockData[0]]);
  });

  it('should handle custom search fields', () => {
    const customData = [
      { id: '1', title: 'Bitcoin', code: 'BTC' },
      { id: '2', title: 'Ethereum', code: 'ETH' },
    ];

    const { result } = renderHook(() => useSearch(customData, ['title', 'code']));

    act(() => {
      result.current.updateSearchTerm('Bitcoin');
    });

    expect(result.current.filteredData).toEqual([customData[0]]);
  });

  it('should handle null or undefined data', () => {
    const { result: nullResult } = renderHook(() => useSearch(null));
    expect(nullResult.current.filteredData).toBeNull();

    const { result: undefinedResult } = renderHook(() => useSearch(undefined));
    expect(undefinedResult.current.filteredData).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const { result } = renderHook(() => useSearch([]));

    act(() => {
      result.current.updateSearchTerm('Bitcoin');
    });

    expect(result.current.filteredData).toEqual([]);
  });

  it('should handle items without search fields', () => {
    const incompleteData = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC' },
      { id: '2', name: 'Ethereum' }, // missing symbol
      { id: '3', symbol: 'ADA' }, // missing name
    ];

    const { result } = renderHook(() => useSearch(incompleteData));

    act(() => {
      result.current.updateSearchTerm('Ethereum');
    });

    expect(result.current.filteredData).toEqual([incompleteData[1]]);
  });
});
