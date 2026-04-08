
import { calculateSHU, resetAllSHUValues, refreshAllSHUCalculations } from './shuOperations';
import { getCurrentSHUFormula } from './shuOperations';
import { calculateSHUDistribution } from './distributionOperations';
import { toast } from 'sonner';
import { getPengaturan, savePengaturan } from '../../pengaturanService';
import { calculateSHUForSamples, testSHUFormula } from '@/utils/shuUtils';

/**
 * Service for managing SHU calculations and formula
 */
export class SHUManager {
  /**
   * Get the current SHU formula from settings
   */
  static getCurrentFormula(): string {
    return getCurrentSHUFormula();
  }

  /**
   * Save a new SHU formula and trigger recalculations
   * 
   * @param formula - The new formula to save
   * @returns True if saved successfully, false otherwise
   */
  static saveFormula(formula: string): boolean {
    if (!formula.trim()) {
      toast.error("Formula tidak boleh kosong");
      return false;
    }

    try {
      // Test the formula first
      if (!testSHUFormula(formula)) {
        toast.error("Formula tidak valid atau menghasilkan error");
        return false;
      }

      // Get current settings
      const settings = getPengaturan();
      
      // Update formula in settings
      const updatedSettings = {
        ...settings,
        shu: {
          ...(settings.shu || {}),
          formula: formula
        }
      };
      
      // Save to storage
      savePengaturan(updatedSettings);
      
      // Mark formula as updated
      localStorage.setItem('shu_formula_updated', Date.now().toString());
      
      // Dispatch event for immediate update
      const formulaChangeEvent = new CustomEvent('shu-formula-changed', {
        detail: { formula, timestamp: Date.now() }
      });
      window.dispatchEvent(formulaChangeEvent);
      
      // Calculate some samples to verify formula works
      calculateSHUForSamples();
      
      toast.success("Formula SHU berhasil disimpan dan diterapkan");
      return true;
    } catch (error) {
      console.error("Error saving formula:", error);
      toast.error("Gagal menyimpan formula SHU");
      return false;
    }
  }

  /**
   * Calculate SHU for a specific member
   * 
   * @param anggotaId - The member ID
   * @returns The calculated SHU value
   */
  static calculateForMember(anggotaId: string | number): number {
    return calculateSHU(anggotaId);
  }

  /**
   * Reset all SHU values and recalculate
   * 
   * @returns Number of members affected
   */
  static resetAllValues(): number {
    const count = resetAllSHUValues();
    toast.success(`${count} nilai SHU anggota berhasil direset dan dihitung ulang`);
    return count;
  }

  /**
   * Refresh SHU calculations for all members
   */
  static refreshCalculations(): void {
    refreshAllSHUCalculations();
    toast.success("Kalkulasi SHU diperbarui untuk semua anggota");
  }

  /**
   * Get SHU distribution based on total SHU
   * 
   * @param totalSHU - Total SHU to distribute
   * @returns Distribution object
   */
  static getDistribution(totalSHU: number) {
    return calculateSHUDistribution(totalSHU);
  }
}
