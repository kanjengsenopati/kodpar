import { getAllTransaksi } from "../transaksiCore";
import { getPengaturan } from "../../pengaturanService";
import { evaluateFormulaWithVariables } from "../../keuangan/formulaEvaluatorService";
import { getActiveJenisByType } from "../../jenisService";

/**
 * SHU Calculator Service - PURE DATABASE DRIVEN
 * Responsible for calculating Sisa Hasil Usaha (SHU) based on structured ledger data
 */
export class SHUCalculator {
  /**
   * Calculate SHU (Sisa Hasil Usaha) using structured DB data for a specific period (Fiscal Year)
   */
  static async calculate(anggotaId: string | number, periode?: string): Promise<number> {
    const idAsString = String(anggotaId);
    const settings = getPengaturan();
    const minValue = Number(settings.shu?.minValue || 0);
    const maxValue = Number(settings.shu?.maxValue || Infinity);
    
    // Formula from settings (DB Driven)
    const formula = settings.shu?.formula || "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02";
    
    // Prepare variables for the specific period
    const variables = await this.prepareVariables(idAsString, periode);
    
    try {
      const result = evaluateFormulaWithVariables(formula, variables);
      
      if (result === null) {
        return minValue;
      }
      
      return Math.max(minValue, Math.min(maxValue, Math.round(result)));
    } catch (error) {
      console.error("❌ SHU Calculation Error:", error);
      return minValue;
    }
  }
  
  /**
   * Prepare variables strictly from structured database fields, scoped to a period if provided
   */
  private static async prepareVariables(anggotaId: string, periode?: string): Promise<Record<string, number>> {
    const allTransaksi = await getAllTransaksi();
    
    // Scope transactions to the specific year if period is provided (e.g., "2023")
    const filteredTransaksi = periode 
      ? allTransaksi.filter(t => t.tanggal && t.tanggal.startsWith(periode))
      : allTransaksi;

    const memberTransaksi = filteredTransaksi.filter(t => t.anggotaId === anggotaId && t.status === "Sukses");
    
    // Resolve Jenis IDs for mapping to ensure ID-driven SSOT
    const simpananJenis = getActiveJenisByType("Simpanan");
    const idPokok = simpananJenis.find(j => j.nama === "Simpanan Pokok")?.id;
    const idWajib = simpananJenis.find(j => j.nama === "Simpanan Wajib")?.id;
    const idSukarela = simpananJenis.find(j => j.nama.includes("Sukarela") || j.nama.includes("Khusus"))?.id;

    const isCategory = (t: any, id?: string, name?: string) => {
      return t.kategori === id || t.kategori === name;
    };

    // 1. Simpanan Variables (Calculation: Closing mutation for the period)
    // SAK EP: Proportional contribution should reflect the net increase/balance in the period
    const getBalance = (catId?: string, catName?: string) => {
      const simpan = memberTransaksi
        .filter(t => t.jenis === "Simpan" && isCategory(t, catId, catName))
        .reduce((total, t) => total + (t.jumlah || 0), 0);
      
      const tarik = memberTransaksi
        .filter(t => t.jenis === "Penarikan" && isCategory(t, catId, catName))
        .reduce((total, t) => total + Math.abs(t.jumlah || 0), 0);
      
      return Math.max(0, simpan - tarik);
    };

    const simpanan_pokok = getBalance(idPokok, "Simpanan Pokok");
    const simpanan_wajib = getBalance(idWajib, "Simpanan Wajib");
    const simpanan_khusus = getBalance(idSukarela, "Simpanan Sukarela") || getBalance(undefined, "Simpanan Khusus");
    const totalSimpanan = simpanan_pokok + simpanan_wajib + simpanan_khusus;
    
    // 2. Loan Variables (Scope: New loans disbursed in this period)
    const pinjamTransactions = memberTransaksi.filter(t => t.jenis === "Pinjam");
    const totalPinjaman = pinjamTransactions.reduce((total, t) => total + (t.jumlah || 0), 0);
    
    // 3. Jasa (Interest) - SUM of strictly realized nominalJasa from Angsuran in this period
    // This is the primary 'Participation' metric for borrowers.
    const jasa = memberTransaksi
      .filter(t => t.jenis === "Angsuran")
      .reduce((total, t) => total + (t.nominalJasa || 0), 0);
    
    const pendapatan = jasa; 
    
    const lama_keanggotaan = this.calculateMembershipDuration(allTransaksi.filter(t => t.anggotaId === anggotaId));
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
