
import { Penjualan } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { generateId } from "@/lib/utils";
import { generateTransactionNumber } from "./utils";

// Initialize sample penjualan data
export const initSamplePenjualanData = (): void => {
  const penjualanList = getFromLocalStorage<Penjualan[]>("penjualanList", []);
  
  // Only initialize if no data exists
  if (penjualanList.length === 0) {
    const sampleData: Penjualan[] = [
      {
        id: generateId("POS"),
        nomorTransaksi: generateTransactionNumber(1),
        tanggal: "2024-01-15T08:30:00.000Z",
        kasirId: "KSR001",
        items: [
          {
            produkId: "PRD001",
            jumlah: 2,
            hargaSatuan: 12000,
            total: 24000
          },
          {
            produkId: "PRD004",
            jumlah: 1,
            hargaSatuan: 7500,
            total: 7500
          }
        ],
        subtotal: 31500,
        diskon: 0,
        pajak: 0,
        total: 31500,
        dibayar: 50000,
        kembalian: 18500,
        metodePembayaran: "cash",
        status: "sukses",
        createdAt: "2024-01-15T08:30:00.000Z"
      },
      {
        id: generateId("POS"),
        nomorTransaksi: generateTransactionNumber(2),
        tanggal: "2024-01-15T10:15:00.000Z",
        kasirId: "KSR002",
        items: [
          {
            produkId: "PRD002",
            jumlah: 1,
            hargaSatuan: 14000,
            total: 14000
          },
          {
            produkId: "PRD003",
            jumlah: 2,
            hargaSatuan: 18000,
            total: 36000
          },
          {
            produkId: "PRD005",
            jumlah: 1,
            hargaSatuan: 25000,
            total: 25000
          }
        ],
        subtotal: 75000,
        diskon: 5,
        pajak: 0,
        total: 71250,
        dibayar: 71250,
        kembalian: 0,
        metodePembayaran: "debit",
        status: "sukses",
        createdAt: "2024-01-15T10:15:00.000Z"
      },
      {
        id: generateId("POS"),
        nomorTransaksi: generateTransactionNumber(3),
        tanggal: "2024-01-16T14:20:00.000Z",
        kasirId: "KSR001",
        items: [
          {
            produkId: "PRD006",
            jumlah: 3,
            hargaSatuan: 4500,
            total: 13500
          },
          {
            produkId: "PRD007",
            jumlah: 2,
            hargaSatuan: 22000,
            total: 44000
          }
        ],
        subtotal: 57500,
        diskon: 0,
        pajak: 10,
        total: 63250,
        dibayar: 63250,
        kembalian: 0,
        metodePembayaran: "qris",
        status: "sukses",
        createdAt: "2024-01-16T14:20:00.000Z"
      }
    ];
    
    saveToLocalStorage("penjualanList", sampleData);
  }
};

