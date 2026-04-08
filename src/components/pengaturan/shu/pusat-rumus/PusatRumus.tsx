
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariabelDasarColumn } from "./VariabelDasarColumn";
import { VariabelGabunganColumn } from "./VariabelGabunganColumn";
import { useSHUVariables } from "../hooks/useSHUVariables";

interface JenisVariabel {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom";
  color: string;
}

interface VariabelCustom {
  id: string;
  nama: string;
  deskripsi: string;
  jenisId: string;
  valueType: "number" | "percentage" | "currency";
  value: number;
  unit?: string;
  formula?: string;
  isEditable: boolean;
}

interface RumusGabungan {
  id: string;
  nama: string;
  deskripsi: string;
  formula: string;
  formulaType: 'shu' | 'thr' | 'general';
  isActive: boolean;
  createdAt: string;
  lastModified: string;
}

interface PusatRumusProps {
  onUpdateMainFormula: (formula: string, formulaType?: 'shu' | 'thr') => void;
  onUseVariable: (variableId: string, formulaType?: 'shu' | 'thr') => void;
}

export function PusatRumus({ onUpdateMainFormula, onUseVariable }: PusatRumusProps) {
  // State untuk jenis variabel
  const [jenisVariabel, setJenisVariabel] = useState<JenisVariabel[]>([]);
  
  // State untuk variabel custom
  const [variabelCustom, setVariabelCustom] = useState<VariabelCustom[]>([]);
  
  // State untuk rumus gabungan
  const [rumusGabungan, setRumusGabungan] = useState<RumusGabungan[]>([]);
  
  // Get built-in SHU variables
  const builtInVariables = useSHUVariables();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJenisVariabel = localStorage.getItem('pusat_rumus_jenis_variabel');
    const savedVariabelCustom = localStorage.getItem('pusat_rumus_variabel_custom');
    const savedRumusGabungan = localStorage.getItem('pusat_rumus_rumus_gabungan');

    if (savedJenisVariabel) {
      setJenisVariabel(JSON.parse(savedJenisVariabel));
    }
    
    if (savedVariabelCustom) {
      setVariabelCustom(JSON.parse(savedVariabelCustom));
    }
    
    if (savedRumusGabungan) {
      setRumusGabungan(JSON.parse(savedRumusGabungan));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('pusat_rumus_jenis_variabel', JSON.stringify(jenisVariabel));
  }, [jenisVariabel]);

  useEffect(() => {
    localStorage.setItem('pusat_rumus_variabel_custom', JSON.stringify(variabelCustom));
  }, [variabelCustom]);

  useEffect(() => {
    localStorage.setItem('pusat_rumus_rumus_gabungan', JSON.stringify(rumusGabungan));
  }, [rumusGabungan]);

  // Combine all available variables for rumus gabungan
  const getAllAvailableVariables = () => {
    const allVariables = [
      // Built-in variables
      ...builtInVariables.map(v => ({
        id: v.id,
        nama: v.label,
        deskripsi: v.description,
        jenisId: "builtin",
        value: v.value
      })),
      // Custom variables
      ...variabelCustom.map(v => ({
        id: v.id,
        nama: v.nama,
        deskripsi: v.deskripsi,
        jenisId: v.jenisId,
        value: v.value
      }))
    ];
    
    return allVariables;
  };

  const handleSetActiveFormula = (formula: string, formulaType: 'shu' | 'thr' = 'shu') => {
    onUpdateMainFormula(formula, formulaType);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold mb-2">Pusat Rumus Umum</h2>
        <p className="text-muted-foreground">
          Kelola variabel dasar dan buat rumus gabungan untuk perhitungan THR dan SHU anggota
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Variabel Dasar */}
        <VariabelDasarColumn
          jenisVariabel={jenisVariabel}
          variabelCustom={variabelCustom}
          builtInVariables={builtInVariables}
          onJenisVariabelUpdate={setJenisVariabel}
          onVariabelCustomUpdate={setVariabelCustom}
          onUseVariable={onUseVariable}
        />

        {/* Column 2: Variabel Gabungan */}
        <VariabelGabunganColumn
          rumusGabungan={rumusGabungan}
          variabelAvailable={getAllAvailableVariables()}
          onUpdate={setRumusGabungan}
          onSetActiveFormula={handleSetActiveFormula}
        />
      </div>
    </div>
  );
}
