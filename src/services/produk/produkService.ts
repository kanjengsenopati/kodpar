
import { ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";
import { getProdukItems, saveProdukItems, generateProductCode } from "./utils";
import { logAuditEntry } from "@/services/auditService";

// Get all products
export const getAllProdukItems = (): ProdukItem[] => {
  return getProdukItems();
};

// Create new product
export const createProdukItem = (produkData: Omit<ProdukItem, "id" | "createdAt">): ProdukItem => {
  const produkItems = getProdukItems();
  const newProdukItem: ProdukItem = {
    id: generateId("PRD"),
    kode: produkData.kode || generateProductCode(),
    nama: produkData.nama,
    kategori: produkData.kategori,
    hargaBeli: produkData.hargaBeli,
    hargaJual: produkData.hargaJual,
    stok: produkData.stok,
    satuan: produkData.satuan,
    deskripsi: produkData.deskripsi || "",
    gambar: produkData.gambar || "",
    createdAt: new Date().toISOString()
  };
  
  produkItems.push(newProdukItem);
  saveProdukItems(produkItems);
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "PRODUK",
    `Membuat produk baru: ${newProdukItem.nama} (${newProdukItem.kode})`,
    newProdukItem.id
  );
  
  return newProdukItem;
};

// Get product by ID
export const getProdukItemById = (id: string): ProdukItem | null => {
  const produkItems = getProdukItems();
  const produkItem = produkItems.find(item => item.id === id);
  
  return produkItem || null;
};

// Update product
export const updateProdukItem = (id: string, produkData: Partial<ProdukItem>): ProdukItem | null => {
  const produkItems = getProdukItems();
  const index = produkItems.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const oldProduk = { ...produkItems[index] };
  
  // Preserve the image if none is provided
  if (produkData.gambar === undefined) {
    produkData.gambar = produkItems[index].gambar;
  }
  
  // Update the product
  produkItems[index] = {
    ...produkItems[index],
    ...produkData
  };
  
  saveProdukItems(produkItems);
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "PRODUK",
    `Memperbarui produk: ${oldProduk.nama} -> ${produkItems[index].nama}`,
    id
  );
  
  return produkItems[index];
};

// Delete product
export const deleteProdukItem = (id: string): boolean => {
  const produkItems = getProdukItems();
  const produkToDelete = produkItems.find(item => item.id === id);
  const newProdukItems = produkItems.filter(item => item.id !== id);
  
  if (newProdukItems.length === produkItems.length) {
    return false;
  }
  
  saveProdukItems(newProdukItems);
  
  // Log audit entry
  if (produkToDelete) {
    logAuditEntry(
      "DELETE",
      "PRODUK",
      `Menghapus produk: ${produkToDelete.nama} (${produkToDelete.kode})`,
      id
    );
  }
  
  return true;
};

// Update product stock
export const updateProdukStock = (id: string, quantity: number): boolean => {
  const produkItems = getProdukItems();
  const index = produkItems.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  const oldStok = produkItems[index].stok;
  produkItems[index].stok += quantity;
  saveProdukItems(produkItems);
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "PRODUK",
    `Update stok produk ${produkItems[index].nama}: ${oldStok} -> ${produkItems[index].stok}`,
    id
  );
  
  return true;
};
