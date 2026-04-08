
import { Pengaturan } from "@/types";
import { PusatRumus } from "./shu/pusat-rumus/PusatRumus";

interface SHUSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function SHUSettings({ settings, setSettings }: SHUSettingsProps) {
  // Handle main formula update from Pusat Rumus
  const handleUpdateMainFormula = (formula: string, formulaType: 'shu' | 'thr' = 'shu') => {
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        [formulaType === 'shu' ? 'formula' : 'thrFormula']: formula
      }
    });
  };

  // Handle variable insertion
  const handleUseVariable = (variableId: string, formulaType: 'shu' | 'thr' = 'shu') => {
    // This function can be used by PusatRumus to insert variables into formulas
    console.log(`Using variable ${variableId} for ${formulaType} formula`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold mb-2">Pusat Formula</h2>
        <p className="text-muted-foreground">
          Kelola jenis variabel, buat variabel custom, dan susun rumus untuk perhitungan THR (Tunjangan Hari Raya) dan SHU (Sisa Hasil Usaha) anggota
        </p>
      </div>
      
      <PusatRumus 
        onUpdateMainFormula={handleUpdateMainFormula}
        onUseVariable={handleUseVariable}
      />
    </div>
  );
}
