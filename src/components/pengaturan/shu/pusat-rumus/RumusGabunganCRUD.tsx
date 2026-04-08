
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { FormulaBar } from "../formula/FormulaBar";
import { validateFormula } from "@/services/keuangan/formulaEvaluatorService";

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

interface Variable {
  id: string;
  nama: string;
  deskripsi: string;
  jenisId: string;
  value: number;
}

interface RumusGabunganCRUDProps {
  rumusGabungan: RumusGabungan[];
  allRumusGabungan: RumusGabungan[];
  variabelAvailable: Variable[];
  formulaType: 'shu' | 'thr' | 'general';
  onUpdate: (rumus: RumusGabungan[]) => void;
  onSetActiveFormula: (formula: string, formulaType?: 'shu' | 'thr') => void;
}

export function RumusGabunganCRUD({
  rumusGabungan,
  allRumusGabungan,
  variabelAvailable,
  formulaType,
  onUpdate,
  onSetActiveFormula
}: RumusGabunganCRUDProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formulaError, setFormulaError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    formula: ""
  });

  // Convert variables to record for validation
  const variablesRecord = variabelAvailable.reduce((acc, v) => {
    acc[v.id] = v.value;
    return acc;
  }, {} as Record<string, number>);

  const handleAdd = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama rumus harus diisi");
      return;
    }

    if (!formData.formula.trim()) {
      toast.error("Formula tidak boleh kosong");
      return;
    }

    // Validate formula
    try {
      const validation = validateFormula(formData.formula, variablesRecord);
      if (!validation.isValid) {
        setFormulaError(validation.error || "Formula tidak valid");
        toast.error(`Formula tidak valid: ${validation.error}`);
        return;
      }
      setFormulaError(null);
    } catch (error) {
      setFormulaError("Error validasi formula");
      toast.error("Error validasi formula");
      return;
    }

    const id = `rumus_${formData.nama.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    const newRumus: RumusGabungan = {
      id,
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      formula: formData.formula,
      formulaType,
      isActive: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedAll = [...allRumusGabungan, newRumus];
    onUpdate(updatedAll);
    resetForm();
    setIsAdding(false);
    toast.success("Rumus berhasil ditambahkan");
  };

  const handleEdit = (rumus: RumusGabungan) => {
    setEditingId(rumus.id);
    setFormData({
      nama: rumus.nama,
      deskripsi: rumus.deskripsi,
      formula: rumus.formula
    });
  };

  const handleSaveEdit = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama rumus harus diisi");
      return;
    }

    if (!formData.formula.trim()) {
      toast.error("Formula tidak boleh kosong");
      return;
    }

    // Validate formula
    try {
      const validation = validateFormula(formData.formula, variablesRecord);
      if (!validation.isValid) {
        setFormulaError(validation.error || "Formula tidak valid");
        toast.error(`Formula tidak valid: ${validation.error}`);
        return;
      }
      setFormulaError(null);
    } catch (error) {
      setFormulaError("Error validasi formula");
      toast.error("Error validasi formula");
      return;
    }

    const updatedAll = allRumusGabungan.map(r => 
      r.id === editingId 
        ? { 
            ...r, 
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            formula: formData.formula,
            lastModified: new Date().toISOString()
          }
        : r
    );

    onUpdate(updatedAll);
    resetForm();
    setEditingId(null);
    toast.success("Rumus berhasil diperbarui");
  };

  const handleDelete = (id: string) => {
    const updatedAll = allRumusGabungan.filter(r => r.id !== id);
    onUpdate(updatedAll);
    toast.success("Rumus berhasil dihapus");
  };

  const handleSetActive = (rumus: RumusGabungan) => {
    const updatedAll = allRumusGabungan.map(r => ({
      ...r,
      isActive: r.id === rumus.id && r.formulaType === formulaType
    }));
    
    onUpdate(updatedAll);
    onSetActiveFormula(rumus.formula, rumus.formulaType === 'general' ? 'shu' : rumus.formulaType);
    toast.success(`Formula "${rumus.nama}" telah diaktifkan`);
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      formula: ""
    });
    setFormulaError(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleFormulaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const variableId = e.dataTransfer.getData('text/plain');
    setFormData(prev => ({
      ...prev,
      formula: prev.formula + variableId
    }));
  };

  const handleFormulaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsAdding(true)}
        disabled={isAdding || Boolean(editingId)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah Rumus {formulaType.toUpperCase()}
      </Button>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label htmlFor="nama">Nama Rumus</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
              placeholder="Nama rumus"
            />
          </div>
          
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              placeholder="Deskripsi rumus"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="formula">Formula (Drop variabel di sini)</Label>
            <div
              onDrop={handleFormulaDrop}
              onDragOver={handleFormulaDragOver}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-1"
            >
              <FormulaBar
                value={formData.formula}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, formula: value }));
                  setFormulaError(null);
                }}
                variables={variablesRecord}
                error={formulaError}
                isValid={!formulaError}
              />
            </div>
            {formulaError && (
              <p className="text-red-500 text-sm mt-1">{formulaError}</p>
            )}
          </div>

          {/* Operators */}
          <div>
            <Label className="text-sm">Operator</Label>
            <div className="flex gap-2 mt-1">
              {["+", "-", "*", "/", "(", ")"].map(operator => (
                <Button
                  key={operator}
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, formula: prev.formula + ` ${operator} ` }))}
                  className="h-8 w-8 p-0"
                >
                  {operator}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" onClick={editingId ? handleSaveEdit : handleAdd}>
              <Save className="h-4 w-4 mr-2" />
              {editingId ? 'Simpan' : 'Tambah'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {rumusGabungan.map(rumus => (
          <div key={rumus.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{rumus.nama}</h4>
                {rumus.isActive && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(rumus)}
                  disabled={isAdding || Boolean(editingId)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(rumus.id)}
                  disabled={isAdding || Boolean(editingId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {rumus.deskripsi && (
              <p className="text-sm text-muted-foreground mb-2">{rumus.deskripsi}</p>
            )}
            
            <div className="font-mono text-sm p-2 bg-muted rounded mb-2">
              {rumus.formula}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {new Date(rumus.lastModified).toLocaleString('id-ID')}
              </span>
              
              <Button 
                size="sm" 
                variant={rumus.isActive ? "default" : "outline"}
                onClick={() => handleSetActive(rumus)}
                disabled={isAdding || Boolean(editingId)}
              >
                {rumus.isActive ? 'Aktif' : 'Gunakan'}
              </Button>
            </div>
          </div>
        ))}
        
        {rumusGabungan.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Belum ada rumus {formulaType.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
