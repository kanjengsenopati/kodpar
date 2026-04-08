
import { ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

// Utility to get products from localStorage
export const getProdukItems = (): ProdukItem[] => {
  return getFromLocalStorage<ProdukItem[]>("produkItems", []);
};

// Utility to save products to localStorage
export const saveProdukItems = (produkItems: ProdukItem[]): void => {
  saveToLocalStorage("produkItems", produkItems);
};

// Generate product code if not provided
export const generateProductCode = (prefix: string = "PRD"): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

