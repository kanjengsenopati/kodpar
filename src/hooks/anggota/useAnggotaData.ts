
import { useState, useEffect } from "react";
import { Anggota } from "@/types";
import { getAllAnggota } from "@/services/anggotaService";

export function useAnggotaData() {
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);

  const loadAnggota = () => {
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    return loadedAnggota;
  };

  useEffect(() => {
    loadAnggota();
  }, []);

  const refreshAnggotaList = () => {
    setAnggotaList(getAllAnggota());
  };

  return {
    anggotaList,
    setAnggotaList,
    loadAnggota,
    refreshAnggotaList
  };
}
