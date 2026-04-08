
import { Penjualan, PenjualanItem } from "@/types";
import { generateId } from "@/lib/utils";
import { 
  getPenjualanList, 
  savePenjualanList, 
  generateTransactionNumber,
  calculateTotal
} from "./utils";
import { updateProdukStock } from "../produk";
import { logAuditEntry } from "@/services/auditService";

// Get all sales
export const getAllPenjualan = (): Penjualan[] => {
  return getPenjualanList();
};

// Create new sale
export const createPenjualan = (penjualanData: Omit<Penjualan, "id" | "nomorTransaksi" | "createdAt">): Penjualan => {
  const penjualanList = getPenjualanList();
  
  // Generate transaction number
  const count = penjualanList.length + 1;
  const nomorTransaksi = generateTransactionNumber(count);
  
  const newPenjualan: Penjualan = {
    id: generateId("POS"),
    nomorTransaksi,
    tanggal: penjualanData.tanggal,
    kasirId: penjualanData.kasirId,
    items: penjualanData.items,
    subtotal: penjualanData.subtotal,
    diskon: penjualanData.diskon || 0,
    pajak: penjualanData.pajak || 0,
    total: penjualanData.total,
    dibayar: penjualanData.dibayar,
    kembalian: penjualanData.kembalian,
    metodePembayaran: penjualanData.metodePembayaran,
    status: penjualanData.status,
    catatan: penjualanData.catatan || "",
    createdAt: new Date().toISOString()
  };
  
  // Update product stock for each item
  if (newPenjualan.status === "sukses") {
    newPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, -item.jumlah);
    });
  }
  
  penjualanList.push(newPenjualan);
  savePenjualanList(penjualanList);
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "PENJUALAN",
    `Membuat transaksi penjualan ${newPenjualan.nomorTransaksi} sebesar Rp ${newPenjualan.total.toLocaleString('id-ID')}`,
    newPenjualan.id
  );
  
  return newPenjualan;
};

// Get sale by ID
export const getPenjualanById = (id: string): Penjualan | null => {
  const penjualanList = getPenjualanList();
  const penjualan = penjualanList.find(item => item.id === id);
  
  return penjualan || null;
};

// Update sale
export const updatePenjualan = (id: string, penjualanData: Partial<Penjualan>): Penjualan | null => {
  const penjualanList = getPenjualanList();
  const index = penjualanList.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const oldPenjualan = penjualanList[index];
  
  // If status changes from sukses to dibatalkan, revert stock updates
  if (oldPenjualan.status === "sukses" && penjualanData.status === "dibatalkan") {
    oldPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, item.jumlah); // Add stock back
    });
  }
  
  // If status changes from dibatalkan to sukses, apply stock updates
  if (oldPenjualan.status === "dibatalkan" && penjualanData.status === "sukses") {
    oldPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, -item.jumlah); // Reduce stock
    });
  }
  
  penjualanList[index] = {
    ...oldPenjualan,
    ...penjualanData
  };
  
  savePenjualanList(penjualanList);
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "PENJUALAN",
    `Memperbarui transaksi penjualan ${oldPenjualan.nomorTransaksi}: status ${oldPenjualan.status} -> ${penjualanList[index].status}`,
    id
  );
  
  return penjualanList[index];
};

// Delete sale
export const deletePenjualan = (id: string): boolean => {
  const penjualanList = getPenjualanList();
  const penjualan = penjualanList.find(item => item.id === id);
  
  if (!penjualan) return false;
  
  // If deleting a successful sale, add back the stock
  if (penjualan.status === "sukses") {
    penjualan.items.forEach(item => {
      updateProdukStock(item.produkId, item.jumlah); // Add stock back
    });
  }
  
  const newPenjualanList = penjualanList.filter(item => item.id !== id);
  savePenjualanList(newPenjualanList);
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "PENJUALAN",
    `Menghapus transaksi penjualan ${penjualan.nomorTransaksi} sebesar Rp ${penjualan.total.toLocaleString('id-ID')}`,
    id
  );
  
  return true;
};

// Export the calculateTotal function for external use
export { calculateTotal } from "./utils";
