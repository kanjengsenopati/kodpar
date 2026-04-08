
import { toast } from "@/components/ui/use-toast";
import { addNotification } from "../notificationService";
import { Transaksi } from "@/types";

/**
 * Handle success notifications for transaction creation
 */
export function handleTransactionCreateSuccess(transaksi: Transaksi): void {
  // Show success toast notification
  toast({
    title: "Transaksi Berhasil Dibuat",
    description: `${transaksi.jenis} sebesar Rp ${transaksi.jumlah.toLocaleString('id-ID')} telah berhasil disimpan`,
  });

  // Add badge notification
  addNotification({
    type: "transaction",
    title: "Transaksi Baru",
    message: `${transaksi.jenis} sebesar Rp ${transaksi.jumlah.toLocaleString('id-ID')} untuk ${transaksi.anggotaNama} berhasil dibuat`
  });
}

/**
 * Handle pending transaction notifications
 */
export function handleTransactionPending(transaksi: Transaksi): void {
  // Show notification for pending transactions
  toast({
    title: "Transaksi Disimpan",
    description: `${transaksi.jenis} sebesar Rp ${transaksi.jumlah.toLocaleString('id-ID')} disimpan dengan status ${transaksi.status}`,
  });

  // Add badge notification for pending transactions
  addNotification({
    type: "transaction",
    title: "Transaksi Pending",
    message: `${transaksi.jenis} sebesar Rp ${transaksi.jumlah.toLocaleString('id-ID')} untuk ${transaksi.anggotaNama} dalam status ${transaksi.status}`
  });
}

/**
 * Handle accounting sync success notifications
 */
export function handleAccountingSyncSuccess(transaksi: Transaksi, journalNumber: string): void {
  // Show accounting sync notification
  toast({
    title: "Auto-Sync Akuntansi",
    description: `Transaksi telah otomatis disinkronisasi ke sistem akuntansi (Jurnal: ${journalNumber})`,
  });

  // Add badge notification for accounting sync
  addNotification({
    type: "accounting",
    title: "Sync Akuntansi Berhasil",
    message: `Transaksi ${transaksi.jenis} telah disinkronisasi ke jurnal ${journalNumber}`
  });
}

/**
 * Handle accounting sync error notifications
 */
export function handleAccountingSyncError(transaksi: Transaksi): void {
  // Show sync error notification
  toast({
    title: "Peringatan Sync Akuntansi",
    description: "Transaksi berhasil disimpan, namun gagal disinkronisasi ke akuntansi",
    variant: "destructive",
  });

  // Add badge notification for sync error
  addNotification({
    type: "accounting",
    title: "Gagal Sync Akuntansi",
    message: `Transaksi ${transaksi.jenis} untuk ${transaksi.anggotaNama} gagal disinkronisasi ke sistem akuntansi`
  });
}

/**
 * Handle transaction update notifications
 */
export function handleTransactionUpdateSuccess(transaksi: Transaksi): void {
  // Show update notification
  toast({
    title: "Transaksi Diperbarui",
    description: `${transaksi.jenis} telah berhasil diperbarui`,
  });

  // Add badge notification for transaction update
  addNotification({
    type: "transaction",
    title: "Transaksi Diperbarui",
    message: `${transaksi.jenis} untuk ${transaksi.anggotaNama} telah diperbarui`
  });
}

/**
 * Handle transaction update sync notifications
 */
export function handleTransactionUpdateSyncSuccess(transaksi: Transaksi, journalNumber: string): void {
  toast({
    title: "Sync Akuntansi Berhasil",
    description: `Perubahan transaksi telah disinkronisasi ke akuntansi`,
  });

  // Add badge notification for accounting sync
  addNotification({
    type: "accounting",
    title: "Update Sync Berhasil",
    message: `Perubahan transaksi ${transaksi.jenis} telah disinkronisasi ke jurnal ${journalNumber}`
  });
}

/**
 * Handle transaction update sync error notifications
 */
export function handleTransactionUpdateSyncError(transaksi: Transaksi): void {
  toast({
    title: "Peringatan Sync Akuntansi",
    description: "Transaksi berhasil diperbarui, namun gagal disinkronisasi ke akuntansi",
    variant: "destructive",
  });

  // Add badge notification for sync error
  addNotification({
    type: "accounting",
    title: "Gagal Sync Update",
    message: `Perubahan transaksi ${transaksi.jenis} gagal disinkronisasi ke sistem akuntansi`
  });
}

/**
 * Handle transaction deletion notifications
 */
export function handleTransactionDeleteSuccess(transaksi: Transaksi): void {
  // Show delete notification
  toast({
    title: "Transaksi Dihapus",
    description: `${transaksi.jenis} telah berhasil dihapus dari sistem`,
  });

  // Add badge notification for transaction deletion
  addNotification({
    type: "transaction",
    title: "Transaksi Dihapus",
    message: `${transaksi.jenis} untuk ${transaksi.anggotaNama} telah dihapus dari sistem`
  });
}

/**
 * Handle data reset notifications
 */
export function handleDataResetSuccess(): void {
  toast({
    title: "Data Transaksi Direset",
    description: "Semua data transaksi telah dikembalikan ke kondisi awal",
  });

  // Add badge notification for data reset
  addNotification({
    type: "system",
    title: "Data Reset",
    message: "Semua data transaksi telah dikembalikan ke kondisi awal"
  });
}

/**
 * Handle error notifications
 */
export function handleTransactionError(): void {
  // Show error notification
  toast({
    title: "Gagal Membuat Transaksi",
    description: "Terjadi kesalahan saat menyimpan transaksi. Silakan coba lagi.",
    variant: "destructive",
  });
}

/**
 * Handle transaction not found notifications
 */
export function handleTransactionNotFound(): void {
  toast({
    title: "Transaksi Tidak Ditemukan",
    description: "Transaksi yang akan diperbarui tidak ditemukan",
    variant: "destructive",
  });
}

/**
 * Handle member not found notifications
 */
export function handleMemberNotFound(): void {
  toast({
    title: "Anggota Tidak Ditemukan",
    description: "Anggota yang dipilih tidak ditemukan",
    variant: "destructive",
  });
}

/**
 * Handle transaction delete not found notifications
 */
export function handleTransactionDeleteNotFound(): void {
  toast({
    title: "Transaksi Tidak Ditemukan",
    description: "Transaksi yang akan dihapus tidak ditemukan",
    variant: "destructive",
  });
}
