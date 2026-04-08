
import { Pemasok } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { generateId } from "@/lib/utils";
import { getAllPembelian } from "./pembelianService";

const PEMASOK_KEY = "koperasi_pemasok";

// Get all suppliers
export const getAllPemasok = (): Pemasok[] => {
  return getFromLocalStorage<Pemasok[]>(PEMASOK_KEY, initialPemasok);
};

// Get supplier by ID
export const getPemasokById = (id: string): Pemasok | undefined => {
  const pemasok = getAllPemasok();
  return pemasok.find((item) => item.id === id);
};

// Create new supplier
export const createPemasok = (pemasokData: Omit<Pemasok, "id" | "createdAt">): Pemasok => {
  const pemasokList = getAllPemasok();
  
  const newPemasok: Pemasok = {
    ...pemasokData,
    id: generateId("SUP"),
    createdAt: new Date().toISOString(),
  };
  
  pemasokList.push(newPemasok);
  saveToLocalStorage(PEMASOK_KEY, pemasokList);
  
  return newPemasok;
};

// Update existing supplier
export const updatePemasok = (id: string, pemasokData: Partial<Pemasok>): Pemasok | null => {
  const pemasokList = getAllPemasok();
  const index = pemasokList.findIndex((item) => item.id === id);
  
  if (index === -1) return null;
  
  const updatedPemasok: Pemasok = {
    ...pemasokList[index],
    ...pemasokData
  };
  
  pemasokList[index] = updatedPemasok;
  saveToLocalStorage(PEMASOK_KEY, pemasokList);
  
  return updatedPemasok;
};

// Delete supplier
export const deletePemasok = (id: string): boolean => {
  // Check if supplier is referenced in any purchases
  const pembelianList = getAllPembelian();
  const isPemasokReferenced = pembelianList.some(item => item.pemasokId === id);
  
  if (isPemasokReferenced) {
    return false; // Cannot delete if referenced
  }
  
  const pemasokList = getAllPemasok();
  const filteredList = pemasokList.filter((item) => item.id !== id);
  
  if (filteredList.length === pemasokList.length) {
    return false;
  }
  
  saveToLocalStorage(PEMASOK_KEY, filteredList);
  return true;
};

// Initial sample supplier data
const initialPemasok: Pemasok[] = [
  {
    id: "SUP001",
    nama: "PT Distributor Sembako Utama",
    alamat: "Jl. Raya Pasar Minggu No. 45, Jakarta Selatan",
    telepon: "021-5552345",
    email: "sales@sembakoutama.co.id",
    kontak: "Budi Hartono",
    createdAt: "2025-01-15T09:30:00.000Z"
  },
  {
    id: "SUP002",
    nama: "CV Sinar Jaya Distribusi",
    alamat: "Jl. Melati No. 23, Bandung",
    telepon: "022-3348790",
    email: "order@sinarjaya.com",
    kontak: "Dewi Sartika",
    createdAt: "2025-02-10T13:45:00.000Z"
  },
  {
    id: "SUP003",
    nama: "UD Berkah Makmur",
    alamat: "Jl. Pahlawan No. 12, Surabaya",
    telepon: "031-7893421",
    email: "info@berkahmakmur.id",
    kontak: "Anton Wijaya",
    createdAt: "2025-03-05T10:15:00.000Z"
  },
  {
    id: "SUP004",
    nama: "PT Maju Bersama Sejahtera",
    alamat: "Jl. Diponegoro No. 78, Semarang",
    telepon: "024-6714289",
    email: "cs@majubersama.co.id",
    kontak: "Siti Fatimah",
    createdAt: "2025-03-12T11:20:00.000Z"
  },
  {
    id: "SUP005",
    nama: "CV Mulia Sentosa",
    alamat: "Jl. Ahmad Yani No. 156, Malang",
    telepon: "0341-556723",
    email: "info@muliasentosa.com",
    kontak: "Hendra Wijaya",
    createdAt: "2025-03-20T14:30:00.000Z"
  }
];
