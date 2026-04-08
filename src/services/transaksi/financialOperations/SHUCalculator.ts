
import { getAllTransaksi } from "../transaksiCore";
import { getPengaturan } from "../../pengaturanService";
import { evaluateFormulaWithVariables } from "../../keuangan/formulaEvaluatorService";

/**
 * SHU Calculator Service
 * Responsible for calculating Sisa Hasil Usaha (SHU) for members
 */
export class SHUCalculator {
  /**
   * Calculate SHU (Sisa Hasil Usaha) for an anggota using the formula from settings
   * 
   * @param anggotaId The anggota ID as a string or number
   * @returns The SHU amount
   */
  static calculate(anggotaId: string | number): number {
    // Convert anggotaId to string if it's a number
    const idAsString = String(anggotaId);
    
    // Always fetch fresh settings to ensure latest formula is used
    const settings = getPengaturan();
    const minValue = Number(settings.shu?.minValue || 0);
    const maxValue = Number(settings.shu?.maxValue || Infinity);
    
    // Get the formula from settings or use default
    const formula = settings.shu?.formula || 
      "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02";
    
    console.log(`Using formula for SHU calculation: ${formula}`);
    
    // Check if we should force recalculation due to formula update
    const formulaUpdated = localStorage.getItem('shu_formula_updated');
    if (formulaUpdated) {
      // Clear cache if formula was updated in the last minute
      const updateTime = parseInt(formulaUpdated);
      const currentTime = Date.now();
      if (currentTime - updateTime < 60000) { // within the last minute
        localStorage.removeItem(`shu_result_${idAsString}`);
        console.log("Forcing recalculation due to recent formula update");
      }
    }
    
    // Prepare variables for formula evaluation
    const variables = this.prepareVariables(idAsString);
    
    try {
      console.log(`Calculating SHU for anggota ${idAsString} with formula: ${formula}`);
      console.log("Variables:", variables);
      
      // Evaluate the formula with the updated formula string and variables
      const result = evaluateFormulaWithVariables(formula, variables);
      
      if (result === null) {
        console.error("Error calculating SHU with formula:", formula);
        // Fallback to simple calculation
        const fallbackResult = Math.round(variables.totalSimpanan * 0.05);
        console.log(`Falling back to default calculation: ${fallbackResult}`);
        return Math.max(minValue, Math.min(maxValue, fallbackResult));
      }
      
      // Apply min/max constraints and round to nearest integer
      const finalResult = Math.max(minValue, Math.min(maxValue, Math.round(result)));
      console.log(`SHU calculation result: ${finalResult}`);
      
      // Store the result temporarily in localStorage for debugging purposes
      localStorage.setItem(`shu_result_${idAsString}`, finalResult.toString());
      
      return finalResult;
    } catch (error) {
      console.error("Error calculating SHU:", error);
      // If calculation fails, fallback to simple formula
      return Math.max(minValue, Math.min(maxValue, Math.round(variables.totalSimpanan * 0.05)));
    }
  }
  
  /**
   * Prepare all variables needed for SHU calculation
   * 
   * @param anggotaId The anggota ID as a string
   * @returns Record of variable names and their values
   */
  private static prepareVariables(anggotaId: string): Record<string, number> {
    // Get all transactions for this member
    const allTransaksi = getAllTransaksi();
    const memberTransaksi = allTransaksi.filter(t => t.anggotaId === anggotaId);
    
    // Calculate simpanan-related variables
    const totalSimpanan = this.calculateTotalSimpanan(anggotaId);
    const simpanan_khusus = totalSimpanan * 0.4; // 40% of total simpanan as simpanan khusus
    const simpanan_wajib = totalSimpanan * 0.6;  // 60% of total simpanan as simpanan wajib
    const simpanan_pokok = totalSimpanan * 0.2;  // 20% of total simpanan as simpanan pokok
    
    // Calculate loan-related variables
    const loans = memberTransaksi.filter(t => t.jenis === "Pinjam");
    const totalPinjaman = loans.reduce((total, loan) => total + loan.jumlah, 0);
    
    // Calculate jasa - sum of interest payments from loan transactions
    let jasa = this.calculateJasa(loans);
    
    // Derive additional values
    const pendapatan = jasa * 0.2;  // 20% of jasa as pendapatan (estimation)
    const lama_keanggotaan = this.calculateMembershipDuration(memberTransaksi);
    const transaksi_amount = memberTransaksi.reduce((total, t) => total + t.jumlah, 0);
    const angsuran_total = memberTransaksi
      .filter(t => t.jenis === "Angsuran")
      .reduce((total, t) => total + t.jumlah, 0);
    
    // Prepare variables for formula evaluation
    const variables: Record<string, number> = {
      simpanan_pokok,
      simpanan_wajib,
      simpanan_khusus,
      totalSimpanan,
      jasa,
      pendapatan,
      pinjaman: totalPinjaman,
      lama_keanggotaan,
      transaksi_amount,
      angsuran: angsuran_total
    };
    
    // Add custom variables from settings if they exist
    const settings = getPengaturan();
    const customVariables = settings.shu?.customVariables || [];
    customVariables.forEach(variable => {
      variables[variable.id] = variable.value;
    });
    
    return variables;
  }
  
  /**
   * Calculate total simpanan for an anggota
   */
  private static calculateTotalSimpanan(anggotaId: string): number {
    const transaksiList = getAllTransaksi();
    
    // Sum up all simpanan transactions
    return transaksiList
      .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses")
      .reduce((total, t) => total + t.jumlah, 0);
  }
  
  /**
   * Calculate jasa (interest) for loans
   */
  private static calculateJasa(loans: any[]): number {
    let jasa = 0;
    
    // For each loan, calculate interest portion that contributes to jasa
    loans.forEach(loan => {
      // Parse keterangan for loan details
      const bungaMatch = loan.keterangan?.match(/bunga (\d+(?:\.\d+)?)%/);
      const tenorMatch = loan.keterangan?.match(/Pinjaman (\d+) bulan/);
      
      if (bungaMatch && tenorMatch) {
        const bunga = parseFloat(bungaMatch[1]);
        const tenor = parseInt(tenorMatch[1]);
        
        // Calculate interest portion based on flat rate
        const interestRate = bunga / 100;
        const interestPortion = loan.jumlah * interestRate * tenor;
        
        jasa += interestPortion;
      } else {
        // If details can't be parsed, use a default calculation (15% of loan amount)
        jasa += loan.jumlah * 0.15;
      }
    });
    
    return jasa;
  }
  
  /**
   * Calculate membership duration based on first transaction date
   */
  private static calculateMembershipDuration(transactions: any[]): number {
    if (transactions.length === 0) return 1; // Default to 1 year if no transactions
    
    // Sort transactions by createdAt date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const firstTransactionDate = new Date(sortedTransactions[0].createdAt);
    const currentDate = new Date();
    
    // Calculate years difference (approximate)
    const yearsDiff = (currentDate.getTime() - firstTransactionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    return Math.max(1, Math.round(yearsDiff)); // Minimum 1 year
  }
}
