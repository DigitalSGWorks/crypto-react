import { useState, useCallback, useMemo } from 'react';

export const usePagination = (totalItems, initialItemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return currentPage * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const goToPage = useCallback((page) => {
    const validPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(validPage);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0); // Reset to first page when changing items per page
  }, []);

  const paginationInfo = useMemo(() => ({
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
  }), [currentPage, itemsPerPage, totalPages, startIndex, endIndex, totalItems]);

  return {
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
  };
};
