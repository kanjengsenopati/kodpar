
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

export async function submitSimpananForm(
  formData: SimpananFormData,
  initialData?: Transaksi
): Promise<SimpananSubmissionResult> {
  try {
    if (initialData) {
      // Update existing transaction
      const updatedTransaksi = await updateTransaksi(initialData.id, {
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
        return { success: false, error: "Gagal memperbarui data simpanan. Pastikan data valid." };
      }
    } else {
      // Create new transaction
      // The core createTransaksi now returns SubmissionResult, which we propagate
      const result = await createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Simpan",
        kategori: formData.kategori,
        jumlah: parseInt(formData.jumlah),
        keterangan: formData.keterangan,
        status: "Sukses"
      });

      return result;
    }
  } catch (error: any) {
    console.error("Error in submitSimpananForm:", error);
    return { 
      success: false, 
      error: error.message || "Terjadi kesalahan tidak terduga saat mengirim form" 
    };
  }
}
