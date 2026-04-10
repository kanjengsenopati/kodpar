
import { useState } from "react";
import { Anggota } from "@/types";

export function useAnggotaFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getFilteredAnggota = (anggotaList: Anggota[]) => {
    const filtered = anggotaList.filter(anggota => 
      anggota.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
      anggota.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (anggota.nip && anggota.nip.includes(searchQuery))
    );

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    
    // Reset to page 1 if search changes and current page becomes invalid
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filtered.slice(startIndex, startIndex + rowsPerPage);

    return {
      paginatedList,
      totalRecords,
      totalPages,
      currentPage,
      setCurrentPage,
      rowsPerPage,
      setRowsPerPage
    };
  };

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    getFilteredAnggota
  };
}
