import { getAllTransaksi } from "../transaksiCore";
import { getPengaturan } from "../../pengaturanService";
import { evaluateFormulaWithVariables } from "../../keuangan/formulaEvaluatorService";

/**
 * SHU Calculator Service - PURE DATABASE DRIVEN
 * Responsible for calculating Sisa Hasil Usaha (SHU) based on structured ledger data
 */
export class SHUCalculator {
  /**
   * Calculate SHU (Sisa Hasil Usaha) using structured DB data
   */
  static async calculate(anggotaId: string | number): Promise<number> {
    const idAsString = String(anggotaId);
    const settings = getPengaturan();
    const minValue = Number(settings.shu?.minValue || 0);
    const maxValue = Number(settings.shu?.maxValue || Infinity);
    
    // Formula from settings (DB Driven)
    const formula = settings.shu?.formula || "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02";
    
    // Prepare variables strictly from DB
    const variables = await this.prepareVariables(idAsString);
    
    try {
      const result = evaluateFormulaWithVariables(formula, variables);
      
      if (result === null) {
        return minValue; // Prevent negative/null values
      }
      
      return Math.max(minValue, Math.min(maxValue, Math.round(result)));
    } catch (error) {
      console.error("❌ SHU Calculation Error:", error);
      return minValue;
    }
  }
  
  /**
   * Prepare variables strictly from structured database fields
   */
  private static async prepareVariables(anggotaId: string): Promise<Record<string, number>> {
    const allTransaksi = await getAllTransaksi();
    const memberTransaksi = allTransaksi.filter(t => t.anggotaId === anggotaId && t.status === "Sukses");
    
    // 1. Simpanan Variables (Structure Categorized)
    const simpanan_pokok = memberTransaksi
      .filter(t => t.jenis === "Simpan" && t.kategori === "Simpanan Pokok")
      .reduce((total, t) => total + (t.jumlah || 0), 0);
      
    const simpanan_wajib = memberTransaksi
      .filter(t => t.jenis === "Simpan" && t.kategori === "Simpanan Wajib")
      .reduce((total, t) => total + (t.jumlah || 0), 0);
      
    const simpanan_khusus = memberTransaksi
      .filter(t => t.jenis === "Simpan" && (t.kategori === "Simpanan Sukarela" || t.kategori === "Simpanan Khusus"))
      .reduce((total, t) => total + (t.jumlah || 0), 0);
      
    const totalSimpanan = simpanan_pokok + simpanan_wajib + simpanan_khusus;
    
    // 2. Loan Variables (Pure DB Driven)
    const pinjamTransactions = memberTransaksi.filter(t => t.jenis === "Pinjam");
    const totalPinjaman = pinjamTransactions.reduce((total, t) => total + (t.jumlah || 0), 0);
    
    // 3. Jasa (Interest) - SUM of strictly structured nominalJasa fields from Angsuran
    const jasa = memberTransaksi
      .filter(t => t.jenis === "Angsuran")
      .reduce((total, t) => total + (t.nominalJasa || 0), 0);
    
    // 4. Pendapatan (Revenue) - Realized Interest
    const pendapatan = jasa; // Realized interest IS the revenue for the coop
    
    const lama_keanggotaan = this.calculateMembershipDuration(memberTransaksi);
    const angsuran_total = memberTransaksi
      .filter(t => t.jenis === "Angsuran")
      .reduce((total, t) => total + (t.jumlah || 0), 0);
    
    const variables: Record<string, number> = {
      simpanan_pokok,
      simpanan_wajib,
      simpanan_khusus,
      totalSimpanan,
      jasa,
      pendapatan,
      pinjaman: totalPinjaman,
      lama_keanggotaan,
      angsuran: angsuran_total
    };
    
    // 5. Custom Dynamic Settings
    const settings = getPengaturan();
    (settings.shu?.customVariables || []).forEach(variable => {
      variables[variable.id] = variable.value;
    });
    
    return variables;
  }
  
  /**
   * Calculate membership duration (Legacy duration Logic replaced with dynamic date calculation)
   */
  private static calculateMembershipDuration(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    
    const sorted = [...transactions].sort((a, b) => 
      new Date(a.tanggal || a.createdAt).getTime() - new Date(b.tanggal || b.createdAt).getTime()
    );
    
    const start = new Date(sorted[0].tanggal || sorted[0].createdAt);
    const now = new Date();
    
    const yearsDiff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.max(0, Math.round(yearsDiff * 10) / 10); // 1 decimal place precision
  }
}
