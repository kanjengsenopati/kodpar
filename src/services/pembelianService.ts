
import { Pembelian, PembelianItem } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { updateProdukStock } from "./produk";
import { generateId } from "@/lib/utils";
import { getPemasokById } from "./pemasokService";

const PEMBELIAN_KEY = "koperasi_pembelian";

// Get all purchases
export const getAllPembelian = (): Pembelian[] => {
  return getFromLocalStorage<Pembelian[]>(PEMBELIAN_KEY, initialPembelian);
};

// Get purchase by ID
export const getPembelianById = (id: string): Pembelian | undefined => {
  const pembelian = getAllPembelian();
  return pembelian.find((item) => item.id === id);
};

// Generate purchase number
export const generatePembelianNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `PB${year}${month}-${random}`;
};

// Create new purchase
export const createPembelian = (pembelianData: Omit<Pembelian, "id" | "nomorTransaksi" | "createdAt">): Pembelian => {
  const pembelianList = getAllPembelian();
  
  const newPembelian: Pembelian = {
    ...pembelianData,
    id: generateId("PB"),
    nomorTransaksi: generatePembelianNumber(),
    createdAt: new Date().toISOString(),
  };
  
  pembelianList.push(newPembelian);
  saveToLocalStorage(PEMBELIAN_KEY, pembelianList);
  
  // Update stock if status is "selesai"
  if (newPembelian.status === "selesai") {
    updateProductStock(newPembelian.items);
  }
  
  return newPembelian;
};

// Update existing purchase
export const updatePembelian = (id: string, pembelianData: Partial<Pembelian>): Pembelian | null => {
  const pembelianList = getAllPembelian();
  const index = pembelianList.findIndex((item) => item.id === id);
  
  if (index === -1) return null;
  
  const oldPembelian = pembelianList[index];
  const updatedPembelian: Pembelian = {
    ...oldPembelian,
    ...pembelianData,
    updatedAt: new Date().toISOString(),
  };
  
  pembelianList[index] = updatedPembelian;
  saveToLocalStorage(PEMBELIAN_KEY, pembelianList);
  
  // Handle stock updates when status changes to "selesai"
  if (oldPembelian.status !== "selesai" && updatedPembelian.status === "selesai") {
    updateProductStock(updatedPembelian.items);
  }
  
  return updatedPembelian;
};

// Delete purchase
export const deletePembelian = (id: string): boolean => {
  const pembelianList = getAllPembelian();
  const filteredList = pembelianList.filter((item) => item.id !== id);
  
  if (filteredList.length === pembelianList.length) {
    return false;
  }
  
  saveToLocalStorage(PEMBELIAN_KEY, filteredList);
  return true;
};

// Update product stock when purchase is completed
const updateProductStock = (items: PembelianItem[]): void => {
  items.forEach((item) => {
    updateProdukStock(item.produkId, item.jumlah);
  });
};

// Initial sample purchase data
const initialPembelian: Pembelian[] = [
  {
    id: "PB0001",
    nomorTransaksi: "PB2504-001",
    tanggal: "2025-04-15",
    pemasokId: "SUP001",
    pemasok: "PT Distributor Sembako Utama",
    items: [
      {
        produkId: "PRD001",
        produkNama: "Beras Premium",
        jumlah: 25,
        hargaSatuan: 10000,
        total: 250000
      },
      {
        produkId: "PRD002",
        produkNama: "Gula Pasir",
        jumlah: 15,
        hargaSatuan: 12000,
        total: 180000
      }
    ],
    subtotal: 430000,
    ppn: 43000,
    total: 473000,
    status: "selesai",
    catatan: "Pengadaan barang bulanan",
    createdAt: "2025-04-15T08:30:00.000Z"
  },
  {
    id: "PB0002",
    nomorTransaksi: "PB2504-002",
    tanggal: "2025-04-20",
    pemasokId: "SUP002",
    pemasok: "CV Sinar Jaya Distribusi",
    items: [
      {
        produkId: "PRD004",
        produkNama: "Teh Celup",
        jumlah: 30,
        hargaSatuan: 5000,
        total: 150000
      },
      {
        produkId: "PRD005",
        produkNama: "Kopi Bubuk",
        jumlah: 20,
        hargaSatuan: 20000,
        total: 400000
      }
    ],
    subtotal: 550000,
    diskon: 50000,
    ppn: 50000,
    total: 550000,
    status: "selesai",
    createdAt: "2025-04-20T13:45:00.000Z"
  },
  {
    id: "PB0003",
    nomorTransaksi: "PB2504-003",
    tanggal: "2025-04-25",
    pemasokId: "SUP003",
    pemasok: "UD Berkah Makmur",
    items: [
      {
        produkId: "PRD006",
        produkNama: "Sabun Mandi",
        jumlah: 50,
        hargaSatuan: 3000,
        total: 150000
      },
      {
        produkId: "PRD007",
        produkNama: "Sampo",
        jumlah: 30,
        hargaSatuan: 18000,
        total: 540000
      },
      {
        produkId: "PRD008",
        produkNama: "Sikat Gigi",
        jumlah: 40,
        hargaSatuan: 7000,
        total: 280000
      }
    ],
    subtotal: 970000,
    ppn: 97000,
    total: 1067000,
    status: "proses",
    catatan: "Pengadaan barang toiletries",
    createdAt: "2025-04-25T10:15:00.000Z"
  }
];
