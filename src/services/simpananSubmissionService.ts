
import { createTransaksi, updateTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";

interface SimpananFormData {
  tanggal: string;
  anggotaId: string;
  kategori: string;
  jumlah: string;
  keterangan: string;
}

export interface SimpananSubmissionResult {
  success: boolean;
  data?: Transaksi;
  error?: string;
}

export function submitSimpananForm(
  formData: SimpananFormData,
  initialData?: Transaksi
): SimpananSubmissionResult {
  try {
    if (initialData) {
      // Update existing transaction
      const updatedTransaksi = updateTransaksi(initialData.id, {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Simpan",
        kategori: formData.kategori,
        jumlah: parseInt(formData.jumlah),
        keterangan: formData.keterangan,
        status: initialData.status
      });

      if (updatedTransaksi) {
        return { success: true, data: updatedTransaksi };
      } else {
        return { success: false, error: "Gagal memperbarui data simpanan" };
      }
    } else {
      // Create new transaction
      const newTransaksi = createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Simpan",
        kategori: formData.kategori,
        jumlah: parseInt(formData.jumlah),
        keterangan: formData.keterangan,
        status: "Sukses"
      });

      if (newTransaksi) {
        return { success: true, data: newTransaksi };
      } else {
        return { success: false, error: "Gagal menyimpan data simpanan" };
      }
    }
  } catch (error) {
    console.error("Error in submitSimpananForm:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga" 
    };
  }
}
