
import { getPengaturan } from "../../pengaturanService";

/**
 * Calculate and return the SHU distribution according to specified percentages
 * @param totalSHU The total SHU amount to distribute
 * @returns Object containing the distribution values
 */
export function calculateSHUDistribution(totalSHU: number) {
  // Get distribution percentages from settings
  const settings = getPengaturan();
  const distribution = settings.shu?.distribution || {
    rekening_penyimpan: 25,       // 25% - Porsi untuk rekening anggota penyimpan
    rekening_berjasa: 25,         // 25% - Porsi untuk rekening anggota berjasa
    pengurus: 10,                 // 10% - Porsi untuk pengurus koperasi
    dana_karyawan: 5,             // 5%  - Porsi untuk dana kesejahteraan karyawan
    dana_pendidikan: 10,          // 10% - Porsi untuk dana pendidikan anggota
    dana_pembangunan_daerah: 2.5, // 2.5% - Porsi untuk pembangunan daerah
    dana_sosial: 2.5,             // 2.5% - Porsi untuk keperluan sosial
    cadangan: 20                  // 20% - Porsi untuk dana cadangan koperasi
  };
  
  // Calculate each distribution component
  const result = {
    rekening_penyimpan: totalSHU * (distribution.rekening_penyimpan / 100),
    rekening_berjasa: totalSHU * (distribution.rekening_berjasa / 100),
    pengurus: totalSHU * (distribution.pengurus / 100),
    dana_karyawan: totalSHU * (distribution.dana_karyawan / 100),
    dana_pendidikan: totalSHU * (distribution.dana_pendidikan / 100),
    dana_pembangunan_daerah: totalSHU * (distribution.dana_pembangunan_daerah / 100),
    dana_sosial: totalSHU * (distribution.dana_sosial / 100),
    cadangan: totalSHU * (distribution.cadangan / 100)
  };

  console.log("SHU Distribution calculated:", result);
  return result;
}
