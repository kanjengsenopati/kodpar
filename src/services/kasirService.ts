
import { Kasir } from "@/types";
import { generateId } from "@/lib/utils";

// Local storage key
const KASIR_STORAGE_KEY = "koperasi_kasir_data";

// Get all kasir from local storage
export const getAllKasir = (): Kasir[] => {
  const kasirData = localStorage.getItem(KASIR_STORAGE_KEY);
  if (!kasirData) return [];
  return JSON.parse(kasirData);
};

// Get kasir by ID
export const getKasirById = (id: string): Kasir | null => {
  const kasirList = getAllKasir();
  return kasirList.find(kasir => kasir.id === id) || null;
};

// Save kasir to local storage
export const saveKasir = (kasirList: Kasir[]): void => {
  localStorage.setItem(KASIR_STORAGE_KEY, JSON.stringify(kasirList));
};

// Create a new kasir
export const createKasir = (kasirData: Omit<Kasir, "id" | "createdAt">): Kasir => {
  const kasirList = getAllKasir();
  
  const newKasir: Kasir = {
    id: generateId("KSR"),
    ...kasirData,
    createdAt: new Date().toISOString()
  };
  
  kasirList.push(newKasir);
  saveKasir(kasirList);
  
  return newKasir;
};

// Update an existing kasir
export const updateKasir = (id: string, kasirData: Partial<Kasir>): Kasir | null => {
  const kasirList = getAllKasir();
  const kasirIndex = kasirList.findIndex(kasir => kasir.id === id);
  
  if (kasirIndex === -1) return null;
  
  kasirList[kasirIndex] = {
    ...kasirList[kasirIndex],
    ...kasirData
  };
  
  saveKasir(kasirList);
  return kasirList[kasirIndex];
};

// Delete a kasir
export const deleteKasir = (id: string): boolean => {
  const kasirList = getAllKasir();
  const filteredList = kasirList.filter(kasir => kasir.id !== id);
  
  if (filteredList.length === kasirList.length) {
    return false;
  }
  
  saveKasir(filteredList);
  return true;
};

// Initialize sample kasir data if not exist
export const initSampleKasirData = (): void => {
  const existingData = localStorage.getItem(KASIR_STORAGE_KEY);
  if (existingData) return;
  
  const sampleKasir: Kasir[] = [
    {
      id: "KSR001",
      nama: "John Doe",
      username: "john.doe",
      noHp: "081234567890",
      role: "kasir",
      aktif: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "KSR002",
      nama: "Jane Smith",
      username: "jane.smith",
      noHp: "082345678901",
      role: "kasir",
      aktif: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "KSR003",
      nama: "Robert Johnson",
      username: "robert.j",
      noHp: "083456789012",
      role: "admin",
      aktif: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  saveKasir(sampleKasir);
};
