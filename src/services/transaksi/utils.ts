
import { getPengaturan } from "../pengaturanService";
import { getAnggotaById } from "../anggotaService";

/**
 * Calculate penalty amount for overdue loan using settings
 * This is different from the one in loanOperations.ts
 * as it uses the settings configuration
 */
export function calculatePenaltyWithSettings(jumlahPinjaman: number, daysOverdue: number): number {
  const pengaturan = getPengaturan();
  const dendaPercentage = pengaturan.denda.persentase;
  const gracePeriod = pengaturan.denda.gracePeriod;
  
  if (daysOverdue <= gracePeriod) return 0;
  
  const effectiveDaysOverdue = daysOverdue - gracePeriod;
  
  if (pengaturan.denda.metodeDenda === "harian") {
    return jumlahPinjaman * (dendaPercentage / 100) * effectiveDaysOverdue;
  } else {
    // For monthly calculation, we divide by 30 days to get months
    const monthsOverdue = Math.ceil(effectiveDaysOverdue / 30);
    return jumlahPinjaman * (dendaPercentage / 100) * monthsOverdue;
  }
}
