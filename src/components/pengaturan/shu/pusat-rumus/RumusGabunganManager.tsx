import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X, Calculator, CheckCircle, AlarmClock, Star } from "lucide-react";
import { toast } from "sonner";
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

interface RumusGabunganManagerProps {
  rumusGabungan: RumusGabungan[];
  variabelAvailable: Variable[];
  onUpdate: (rumus: RumusGabungan[]) => void;
  onSetActiveFormula: (formula: string, formulaType?: 'shu' | 'thr') => void;
}

export function RumusGabunganManager({
  rumusGabungan,
  variabelAvailable,
  onUpdate,
  onSetActiveFormula
}: RumusGabunganManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formulaError, setFormulaError] = useState<string | null>(null);
  const [newRumus, setNewRumus] = useState<{
    nama: string;
    deskripsi: string;
    formula: string;
    formulaType: 'shu' | 'thr' | 'general';
  }>({
    nama: "",
    deskripsi: "",
    formula: "",
    formulaType: "general"
  });
  
  // Convert variables array to record for evaluation
  const variablesRecord = variabelAvailable.reduce((acc, v) => {
    acc[v.id] = v.value;
    return acc;
  }, {} as Record<string, number>);

  const handleAdd = () => {
    if (!newRumus.nama.trim()) {
      toast.error("Nama rumus harus diisi");
      return;
    }

    if (!newRumus.formula.trim()) {
      toast.error("Formula tidak boleh kosong");
      return;
    }
    
    // Validate formula
    try {
      const validation = validateFormula(newRumus.formula, variablesRecord);
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

    // Generate ID based on name
    const id = `rumus_${newRumus.nama.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    // Check for duplicate names
    if (rumusGabungan.some(r => r.nama.toLowerCase() === newRumus.nama.toLowerCase())) {
      toast.error("Rumus dengan nama tersebut sudah ada");
      return;
    }

    const rumusBaru: RumusGabungan = {
      id,
      nama: newRumus.nama,
      deskripsi: newRumus.deskripsi,
      formula: newRumus.formula,
      formulaType: newRumus.formulaType,
      isActive: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    onUpdate([...rumusGabungan, rumusBaru]);
    resetForm();
    setIsAdding(false);
    toast.success("Rumus gabungan berhasil ditambahkan");
  };

  const handleEdit = (rumus: RumusGabungan) => {
    setEditingId(rumus.id);
    setNewRumus({
      nama: rumus.nama,
      deskripsi: rumus.deskripsi,
      formula: rumus.formula,
      formulaType: rumus.formulaType || 'general'
    });
  };

  const handleSaveEdit = () => {
    if (!newRumus.nama.trim()) {
      toast.error("Nama rumus harus diisi");
      return;
    }

    if (!newRumus.formula.trim()) {
      toast.error("Formula tidak boleh kosong");
      return;
    }
    
    // Validate formula
    try {
      const validation = validateFormula(newRumus.formula, variablesRecord);
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

    // Check for duplicate names (except for the current edited item)
    if (rumusGabungan.some(r => r.id !== editingId && r.nama.toLowerCase() === newRumus.nama.toLowerCase())) {
      toast.error("Rumus dengan nama tersebut sudah ada");
      return;
    }

    const updatedRumus = rumusGabungan.map(r => 
      r.id === editingId 
        ? { 
            ...r, 
            nama: newRumus.nama,
            deskripsi: newRumus.deskripsi,
            formula: newRumus.formula,
            formulaType: newRumus.formulaType,
            lastModified: new Date().toISOString()
          }
        : r
    );

    onUpdate(updatedRumus);
    resetForm();
    setEditingId(null);
    toast.success("Rumus gabungan berhasil diperbarui");
  };

  const handleDelete = (id: string) => {
    onUpdate(rumusGabungan.filter(r => r.id !== id));
    toast.success("Rumus gabungan berhasil dihapus");
  };

  const handleSetActive = (rumus: RumusGabungan) => {
    // Update active status in the list
    const updatedRumus = rumusGabungan.map(r => ({
      ...r,
      isActive: r.id === rumus.id
    }));
    
    onUpdate(updatedRumus);
    
    // Call the callback to set the formula in the main editor
    onSetActiveFormula(rumus.formula, rumus.formulaType === 'general' ? 'shu' : rumus.formulaType);
    toast.success(`Formula "${rumus.nama}" telah diaktifkan sebagai rumus ${rumus.formulaType === 'shu' ? 'SHU' : rumus.formulaType === 'thr' ? 'THR' : 'umum'}`);
  };

  const resetForm = () => {
    setNewRumus({
      nama: "",
      deskripsi: "",
      formula: "",
      formulaType: "general"
    });
    setFormulaError(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleInsertVariable = (variableId: string) => {
    setNewRumus(prev => ({
      ...prev,
      formula: prev.formula + variableId
    }));
  };

  const handleInsertOperator = (operator: string) => {
    setNewRumus(prev => ({
      ...prev,
      formula: prev.formula + ` ${operator} `
    }));
  };

  const getFormulaTypeIcon = (type: 'shu' | 'thr' | 'general') => {
    switch(type) {
      case 'shu':
        return <Calculator className="h-4 w-4" />;
      case 'thr':
        return <Star className="h-4 w-4" />;
      default:
        return <AlarmClock className="h-4 w-4" />;
    }
  };

  const getFormulaTypeLabel = (type: 'shu' | 'thr' | 'general') => {
    switch(type) {
      case 'shu':
        return "SHU";
      case 'thr':
        return "THR";
      default:
        return "Umum";
    }
  };

  const getFormulaTypeColor = (type: 'shu' | 'thr' | 'general') => {
    switch(type) {
      case 'shu':
        return "bg-blue-100 text-blue-800";
      case 'thr':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Rumus Gabungan</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={Boolean(isAdding) || Boolean(editingId)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Rumus
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Form untuk menambah atau edit */}
          {(isAdding || editingId) && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama">Nama Rumus</Label>
                      <Input
                        id="nama"
                        value={newRumus.nama}
                        onChange={(e) => setNewRumus(prev => ({ ...prev, nama: e.target.value }))}
                        placeholder="Masukkan nama rumus"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="formulaType">Jenis Rumus</Label>
                      <Select 
                        value={newRumus.formulaType} 
                        onValueChange={(value: 'shu' | 'thr' | 'general') => 
                          setNewRumus(prev => ({ ...prev, formulaType: value }))
                        }
                      >
                        <SelectTrigger id="formulaType">
                          <SelectValue placeholder="Pilih jenis rumus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shu">SHU (Sisa Hasil Usaha)</SelectItem>
                          <SelectItem value="thr">THR (Tunjangan Hari Raya)</SelectItem>
                          <SelectItem value="general">Rumus Umum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi Rumus</Label>
                    <Textarea
                      id="deskripsi"
                      value={newRumus.deskripsi}
                      onChange={(e) => setNewRumus(prev => ({ ...prev, deskripsi: e.target.value }))}
                      placeholder="Deskripsi singkat tentang rumus ini"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="formula">Formula</Label>
                    <Textarea
                      id="formula"
                      value={newRumus.formula}
                      onChange={(e) => {
                        setNewRumus(prev => ({ ...prev, formula: e.target.value }));
                        setFormulaError(null);
                      }}
                      placeholder="Masukkan formula perhitungan"
                      rows={3}
                      className={formulaError ? "border-red-500" : ""}
                    />
                    {formulaError && (
                      <p className="text-red-500 text-sm mt-1">{formulaError}</p>
                    )}
                  </div>
                  
                  {/* Variabel yang tersedia */}
                  <div>
                    <Label className="mb-2 block">Variabel Tersedia</Label>
                    <div className="flex flex-wrap gap-1 p-2 border rounded-md max-h-36 overflow-y-auto">
                      {variabelAvailable.map(variabel => (
                        <Badge
                          key={variabel.id}
                          className="cursor-pointer hover:bg-muted"
                          variant="outline"
                          onClick={() => handleInsertVariable(variabel.id)}
                        >
                          {variabel.nama}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Operator yang tersedia */}
                  <div>
                    <Label className="mb-2 block">Operator</Label>
                    <div className="flex flex-wrap gap-2">
                      {["+", "-", "*", "/", "(", ")"].map(operator => (
                        <Button
                          key={operator}
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertOperator(operator)}
                          className="h-8 w-8 p-0"
                        >
                          {operator}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={editingId ? handleSaveEdit : handleAdd}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Simpan Perubahan' : 'Tambah Rumus'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daftar rumus gabungan */}
          <div className="grid gap-3">
            {rumusGabungan.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada rumus gabungan yang dibuat</p>
                <p className="text-sm">Klik "Tambah Rumus" untuk membuat rumus baru</p>
              </div>
            ) : (
              rumusGabungan.map(rumus => (
                <div key={rumus.id} className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{rumus.nama}</h3>
                      <Badge className={getFormulaTypeColor(rumus.formulaType || 'general')}>
                        {getFormulaTypeIcon(rumus.formulaType || 'general')}
                        <span className="ml-1">{getFormulaTypeLabel(rumus.formulaType || 'general')}</span>
                      </Badge>
                      {rumus.isActive && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktif
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(rumus)}
                        disabled={Boolean(isAdding) || Boolean(editingId)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(rumus.id)}
                        disabled={Boolean(isAdding) || Boolean(editingId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {rumus.deskripsi && (
                    <p className="text-sm text-muted-foreground mb-2">{rumus.deskripsi}</p>
                  )}
                  
                  <div className="font-mono text-sm p-2 bg-muted rounded mt-1 mb-3 overflow-x-auto">
                    {rumus.formula}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-muted-foreground">
                      Terakhir diperbarui: {new Date(rumus.lastModified).toLocaleString('id-ID')}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={rumus.isActive ? "default" : "outline"}
                      onClick={() => handleSetActive(rumus)}
                      disabled={Boolean(isAdding) || Boolean(editingId)}
                      className={rumus.isActive ? "bg-green-600" : ""}
                    >
                      {rumus.isActive ? 'Rumus Aktif' : 'Gunakan Rumus Ini'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
