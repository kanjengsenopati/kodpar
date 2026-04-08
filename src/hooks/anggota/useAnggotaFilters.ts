
import { useState } from "react";
import { Anggota } from "@/types";

export function useAnggotaFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const getFilteredAnggota = (anggotaList: Anggota[]) => {
    return anggotaList.filter(anggota => 
      anggota.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
      anggota.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (anggota.nip && anggota.nip.includes(searchQuery))
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    getFilteredAnggota
  };
}
