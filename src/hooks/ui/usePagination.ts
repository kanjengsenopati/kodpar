import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  data: T[];
  initialRowsPerPage?: number;
}

export function usePagination<T>({ data, initialRowsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page
  };

  return {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex: (currentPage - 1) * rowsPerPage
  };
}
