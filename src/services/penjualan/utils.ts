
import { Penjualan, PenjualanItem } from "@/types";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

// Utility to get sales from localStorage
export const getPenjualanList = (): Penjualan[] => {
  return getFromLocalStorage<Penjualan[]>("penjualanList", []);
};

// Utility to save sales to localStorage
export const savePenjualanList = (penjualanList: Penjualan[]): void => {
  saveToLocalStorage("penjualanList", penjualanList);
};

// Generate transaction number (format: TRX-YYYYMMDD-XXXX)
export const generateTransactionNumber = (count: number): string => {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
                 (date.getMonth() + 1).toString().padStart(2, '0') +
                 date.getDate().toString().padStart(2, '0');
  return `TRX-${dateStr}-${count.toString().padStart(4, '0')}`;
};

// Calculate total for a list of items
export const calculateTotal = (items: PenjualanItem[], diskon: number = 0, pajak: number = 0): {
  subtotal: number;
  total: number;
} => {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const diskonAmount = (subtotal * diskon) / 100;
  const afterDiskon = subtotal - diskonAmount;
  const pajakAmount = (afterDiskon * pajak) / 100;
  const total = afterDiskon + pajakAmount;
  
  return {
    subtotal,
    total
  };
};
