
import { useState, useEffect } from "react";
import { Anggota } from "@/types";
import { getAllAnggota } from "@/services/anggotaService";

export function useAnggotaData() {
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);

  const loadAnggota = async () => {
    const loadedAnggota = await getAllAnggota();
    setAnggotaList(loadedAnggota);
    return loadedAnggota;
  };

  useEffect(() => {
    loadAnggota();
  }, []);

  const refreshAnggotaList = async () => {
    setAnggotaList(await getAllAnggota());
  };

  return {
    anggotaList,
    setAnggotaList,
    loadAnggota,
    refreshAnggotaList
  };
}
