import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../../hooks/usePagination';

describe('usePagination Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination(100));

    expect(result.current.currentPage).toBe(0);
    expect(result.current.itemsPerPage).toBe(20);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(20);
    expect(result.current.totalItems).toBe(100);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should calculate pagination correctly', () => {
    const { result } = renderHook(() => usePagination(250, 50));

    expect(result.current.totalPages).toBe(5);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(50);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination(100, 20));

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.startIndex).toBe(20);
    expect(result.current.endIndex).toBe(40);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination(100, 20));

    // Go to page 2 first
    act(() => {
      result.current.goToPage(2);
    });

    // Then go back
    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.startIndex).toBe(20);
    expect(result.current.endIndex).toBe(40);
  });

  it('should not go beyond boundaries', () => {
    const { result } = renderHook(() => usePagination(100, 20));

    // Try to go to negative page
    act(() => {
      result.current.goToPage(-1);
    });
    expect(result.current.currentPage).toBe(0);

    // Try to go beyond last page
    act(() => {
      result.current.goToPage(10);
    });
    expect(result.current.currentPage).toBe(4); // Last page is 4 (0-based)

    // Try to go next when on last page
    act(() => {
      result.current.goToNextPage();
    });
    expect(result.current.currentPage).toBe(4); // Should stay on last page

    // Reset to first page and try to go previous
    act(() => {
      result.current.goToPage(0);
    });
    
    // Try to go previous when on first page
    act(() => {
      result.current.goToPreviousPage();
    });
    expect(result.current.currentPage).toBe(0); // Should stay on first page
  });

  it('should change items per page and reset to first page', () => {
    const { result } = renderHook(() => usePagination(100, 20));

    // Go to page 2
    act(() => {
      result.current.goToPage(2);
    });

    // Change items per page
    act(() => {
      result.current.changeItemsPerPage(50);
    });

    expect(result.current.itemsPerPage).toBe(50);
    expect(result.current.currentPage).toBe(0); // Should reset to first page
    expect(result.current.totalPages).toBe(2);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(50);
  });

  it('should handle edge cases', () => {
    // Empty data
    const { result: emptyResult } = renderHook(() => usePagination(0, 20));
    expect(emptyResult.current.totalPages).toBe(0);
    expect(emptyResult.current.endIndex).toBe(0);

    // Single page
    const { result: singleResult } = renderHook(() => usePagination(10, 20));
    expect(singleResult.current.totalPages).toBe(1);
    expect(singleResult.current.hasNextPage).toBe(false);
    expect(singleResult.current.hasPreviousPage).toBe(false);
  });

  it('should update pagination info when total items change', () => {
    const { result, rerender } = renderHook(
      ({ totalItems }) => usePagination(totalItems, 20),
      { initialProps: { totalItems: 100 } }
    );

    expect(result.current.totalPages).toBe(5);

    // Change total items
    rerender({ totalItems: 200 });
    expect(result.current.totalPages).toBe(10);
    expect(result.current.totalItems).toBe(200);
  });
});
