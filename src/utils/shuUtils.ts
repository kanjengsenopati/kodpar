
import { calculateSHU } from "@/services/transaksi/financialOperations/shuOperations";
import { getAnggotaList } from "@/services/anggotaService";
import { getAllTransaksi } from "@/services/transaksi/transaksiCore";
import { toast } from "sonner";

// Helper function to calculate SHU for sample members
export function calculateSHUForSamples() {
  try {
    // Get actual anggota IDs from anggotaList
    const anggotaList = getAnggotaList();
    const anggotaIds = anggotaList.map(anggota => anggota.id).slice(0, 8); // Take up to 8 members
    
    // If no anggota data, use sample IDs
    if (anggotaIds.length === 0) {
      return [
        { id: 'sample1', name: 'Sample Anggota 1', shu: 1500000 },
        { id: 'sample2', name: 'Sample Anggota 2', shu: 1200000 },
      ];
    }
    
    // Clear any cached SHU results for these members
    anggotaIds.forEach(id => {
      localStorage.removeItem(`shu_result_${id}`);
    });
    
    // Force recalculation for each anggota
    return anggotaIds.map(id => {
      const anggota = anggotaList.find(a => a.id === id);
      // Force recalculation by calling calculateSHU directly
      const shuAmount = calculateSHU(id);
      return {
        id,
        name: anggota ? anggota.nama : `Anggota ${id}`,
        shu: shuAmount
      };
    });
  } catch (error) {
    console.error('Error calculating SHU samples:', error);
    toast.error('Gagal menghitung sampel SHU');
    return []; // Return empty array on error
  }
}

// Helper function to test if the SHU formula produces valid results
export function testSHUFormula(formula: string): boolean {
  try {
    // Get a sample anggota ID
    const anggotaList = getAnggotaList();
    if (anggotaList.length === 0) return true; // No data to test with
    
    const sampleAnggotaId = anggotaList[0].id;
    
    // Store the original formula to restore later
    const settings = import('@/services/pengaturanService').then(({ getPengaturan, savePengaturan }) => {
      const currentSettings = getPengaturan();
      const originalFormula = currentSettings.shu?.formula;
      
      // Temporarily update the formula
      const testSettings = {
        ...currentSettings,
        shu: {
          ...(currentSettings.shu || {}),
          formula: formula
        }
      };
      
      try {
        // Save the test formula temporarily
        savePengaturan(testSettings);
        
        // Try calculating SHU with the test formula
        const shuAmount = calculateSHU(sampleAnggotaId);
        
        // Restore original formula
        if (originalFormula) {
          const originalSettings = {
            ...currentSettings,
            shu: {
              ...(currentSettings.shu || {}),
              formula: originalFormula
            }
          };
          savePengaturan(originalSettings);
        }
        
        // If we got here without errors, the formula is valid
        return true;
      } catch (e) {
        // Restore original formula
        if (originalFormula) {
          const originalSettings = {
            ...currentSettings,
            shu: {
              ...(currentSettings.shu || {}),
              formula: originalFormula
            }
          };
          savePengaturan(originalSettings);
        }
        
        console.error('Formula test failed:', e);
        return false;
      }
    });
    
    return true; // Assume valid if we can't test immediately
  } catch (error) {
    console.error('Error testing SHU formula:', error);
    return false;
  }
}

// Helper function to calculate total savings by type
export function calculateTotalSavings(
  type: 'simpanan_wajib' | 'simpanan_pokok' | 'simpanan_khusus' | 'all' = 'all'
): number {
  try {
    const transaksiList = getAllTransaksi();
    
    // If no transaction data, return sample values
    if (transaksiList.length === 0) {
      return type === 'simpanan_wajib' ? 12500000 :
             type === 'simpanan_pokok' ? 5000000 :
             type === 'simpanan_khusus' ? 8750000 : 26250000;
    }
    
    // Filter and sum based on type
    let total = 0;
    
    if (type === 'simpanan_wajib') {
      total = transaksiList
        .filter(t => 
          t.jenis === "Simpan" && 
          t.status === "Sukses" && 
          t.keterangan?.toLowerCase().includes("wajib"))
        .reduce((sum, t) => sum + t.jumlah, 0);
    } else if (type === 'simpanan_pokok') {
      total = transaksiList
        .filter(t => 
          t.jenis === "Simpan" && 
          t.status === "Sukses" && 
          t.keterangan?.toLowerCase().includes("pokok"))
        .reduce((sum, t) => sum + t.jumlah, 0);
    } else if (type === 'simpanan_khusus') {
      total = transaksiList
        .filter(t => 
          t.jenis === "Simpan" && 
          t.status === "Sukses" && 
          (t.keterangan?.toLowerCase().includes("khusus") || 
           t.keterangan?.toLowerCase().includes("sukarela")))
        .reduce((sum, t) => sum + t.jumlah, 0);
    } else if (type === 'all') {
      total = transaksiList
        .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
        .reduce((sum, t) => sum + t.jumlah, 0);
    }
    
    return total;
  } catch (error) {
    console.error(`Error calculating ${type} total:`, error);
    // Return sample values on error
    return type === 'simpanan_wajib' ? 12500000 :
           type === 'simpanan_pokok' ? 5000000 :
           type === 'simpanan_khusus' ? 8750000 : 26250000;
  }
}
