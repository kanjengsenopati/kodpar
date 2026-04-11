
import { calculateSHU } from "@/services/transaksi/financialOperations/shuOperations";
import { getAnggotaList } from "@/services/anggotaService";
import { getAllTransaksi } from "@/services/transaksi/transaksiCore";
import { toast } from "sonner";

// Helper function to calculate SHU for sample members
export async function calculateSHUForSamples() {
  try {
    // Get actual anggota IDs from anggotaList
    const anggotaList = await getAnggotaList();
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
    const results = [];
    for (const id of anggotaIds) {
      const anggota = anggotaList.find(a => a.id === id);
      const shuAmount = await calculateSHU(id);
      results.push({
        id,
        name: anggota ? anggota.nama : `Anggota ${id}`,
        shu: shuAmount
      });
    }
    return results;
  } catch (error) {
    console.error('Error calculating SHU samples:', error);
    toast.error('Gagal menghitung sampel SHU');
    return []; // Return empty array on error
  }
}

// Helper function to test if the SHU formula produces valid results
export async function testSHUFormula(formula: string): Promise<boolean> {
  try {
    const anggotaList = await getAnggotaList();
    if (anggotaList.length === 0) return true;
    
    const sampleAnggotaId = anggotaList[0].id;
    const { getPengaturan, savePengaturan } = await import('@/services/pengaturanService');
    const currentSettings = getPengaturan();
    const originalFormula = currentSettings.shu?.formula;
    
    const testSettings = {
      ...currentSettings,
      shu: { ...(currentSettings.shu || {}), formula }
    };
    
    try {
      savePengaturan(testSettings);
      await calculateSHU(sampleAnggotaId);
      
      if (originalFormula) {
        savePengaturan({
          ...currentSettings,
          shu: { ...(currentSettings.shu || {}), formula: originalFormula }
        });
      }
      return true;
    } catch (e) {
      if (originalFormula) {
        savePengaturan({
          ...currentSettings,
          shu: { ...(currentSettings.shu || {}), formula: originalFormula }
        });
      }
      return false;
    }
  } catch (error) {
    console.error('Error testing SHU formula:', error);
    return false;
  }
}

// Helper function to calculate total savings by type
export async function calculateTotalSavings(
  type: 'simpanan_wajib' | 'simpanan_pokok' | 'simpanan_khusus' | 'all' = 'all'
): Promise<number> {
  try {
    const transaksiList = await getAllTransaksi();
    const suksesSimpanan = transaksiList.filter(t => t.jenis === "Simpan" && t.status === "Sukses");
    
    if (suksesSimpanan.length === 0) {
      return 0; // Remove hardcoded fallbacks
    }
    
    if (type === 'simpanan_wajib') {
      return suksesSimpanan
        .filter(t => t.kategori === "Simpanan Wajib")
        .reduce((sum, t) => sum + (t.jumlah || 0), 0);
    } else if (type === 'simpanan_pokok') {
      return suksesSimpanan
        .filter(t => t.kategori === "Simpanan Pokok")
        .reduce((sum, t) => sum + (t.jumlah || 0), 0);
    } else if (type === 'simpanan_khusus') {
      return suksesSimpanan
        .filter(t => t.kategori === "Simpanan Sukarela" || t.kategori === "Simpanan Khusus")
        .reduce((sum, t) => sum + (t.jumlah || 0), 0);
    }
    
    return suksesSimpanan.reduce((sum, t) => sum + (t.jumlah || 0), 0);
  } catch (error) {
    console.error(`Error calculating ${type} total:`, error);
    return 0;
  }
}




