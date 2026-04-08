
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit3, Save, X, Calculator } from "lucide-react";
import { toast } from "sonner";

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

interface JenisVariabel {
  id: string;
  nama: string;
  color: string;
}

interface VariabelCustomManagerProps {
  variabelCustom: VariabelCustom[];
  jenisVariabel: JenisVariabel[];
  onUpdate: (variabel: VariabelCustom[]) => void;
  onUseVariable: (variableId: string) => void;
}

const valueTypeOptions = [
  { value: "number", label: "Angka", unit: "" },
  { value: "percentage", label: "Persentase", unit: "%" },
  { value: "currency", label: "Mata Uang", unit: "Rp" }
];

export function VariabelCustomManager({ 
  variabelCustom, 
  jenisVariabel, 
  onUpdate, 
  onUseVariable 
}: VariabelCustomManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVariabel, setNewVariabel] = useState<{
    nama: string;
    deskripsi: string;
    jenisId: string;
    valueType: "number" | "percentage" | "currency";
    value: number;
    unit: string;
    formula: string;
  }>({
    nama: "",
    deskripsi: "",
    jenisId: "",
    valueType: "number",
    value: 0,
    unit: "",
    formula: ""
  });

  const formatValue = (value: number, type: string, unit?: string) => {
    if (type === "currency") {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    }
    
    if (type === "percentage") {
      return `${value}%`;
    }
    
    return unit ? `${value} ${unit}` : value.toString();
  };

  const handleAdd = () => {
    if (!newVariabel.nama.trim()) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    if (!newVariabel.jenisId) {
      toast.error("Jenis variabel harus dipilih");
      return;
    }

    // Check if selected jenis exists
    const selectedJenis = jenisVariabel.find(j => j.id === newVariabel.jenisId);
    if (!selectedJenis) {
      toast.error("Jenis variabel yang dipilih tidak valid. Silakan buat jenis variabel terlebih dahulu di tab Jenis Variabel.");
      return;
    }

    const id = newVariabel.nama.toLowerCase().replace(/\s+/g, '_');
    
    if (variabelCustom.some(v => v.id === id)) {
      toast.error("Variabel dengan nama tersebut sudah ada");
      return;
    }

    const variabelBaru: VariabelCustom = {
      id,
      nama: newVariabel.nama,
      deskripsi: newVariabel.deskripsi,
      jenisId: newVariabel.jenisId,
      valueType: newVariabel.valueType,
      value: newVariabel.value,
      unit: newVariabel.unit,
      formula: newVariabel.formula,
      isEditable: true
    };

    onUpdate([...variabelCustom, variabelBaru]);
    resetForm();
    setIsAdding(false);
    toast.success("Variabel custom berhasil ditambahkan");
  };

  const handleEdit = (variabel: VariabelCustom) => {
    setEditingId(variabel.id);
    setNewVariabel({
      nama: variabel.nama,
      deskripsi: variabel.deskripsi,
      jenisId: variabel.jenisId,
      valueType: variabel.valueType,
      value: variabel.value,
      unit: variabel.unit || "",
      formula: variabel.formula || ""
    });
  };

  const handleSaveEdit = () => {
    if (!newVariabel.nama.trim()) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    if (!newVariabel.jenisId) {
      toast.error("Jenis variabel harus dipilih");
      return;
    }

    // Check if selected jenis exists
    const selectedJenis = jenisVariabel.find(j => j.id === newVariabel.jenisId);
    if (!selectedJenis) {
      toast.error("Jenis variabel yang dipilih tidak valid. Silakan pilih jenis variabel yang tersedia.");
      return;
    }

    const updatedVariabel = variabelCustom.map(v => 
      v.id === editingId 
        ? { 
            ...v, 
            nama: newVariabel.nama,
            deskripsi: newVariabel.deskripsi,
            jenisId: newVariabel.jenisId,
            valueType: newVariabel.valueType,
            value: newVariabel.value,
            unit: newVariabel.unit,
            formula: newVariabel.formula
          }
        : v
    );

    onUpdate(updatedVariabel);
    resetForm();
    setEditingId(null);
    toast.success("Variabel custom berhasil diperbarui");
  };

  const handleDelete = (id: string) => {
    onUpdate(variabelCustom.filter(v => v.id !== id));
    toast.success("Variabel custom berhasil dihapus");
  };

  const handleValueChange = (id: string, newValue: number) => {
    const updatedVariabel = variabelCustom.map(v => 
      v.id === id ? { ...v, value: newValue } : v
    );
    onUpdate(updatedVariabel);
  };

  const resetForm = () => {
    setNewVariabel({
      nama: "",
      deskripsi: "",
      jenisId: "",
      valueType: "number",
      value: 0,
      unit: "",
      formula: ""
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const getJenis = (jenisId: string) => {
    return jenisVariabel.find(j => j.id === jenisId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Variabel Custom</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding || Boolean(editingId)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Variabel
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Show message if no jenis variabel available */}
          {jenisVariabel.length === 0 && (isAdding || editingId) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="text-yellow-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Belum ada jenis variabel yang tersedia. Silakan buat jenis variabel terlebih dahulu di tab "Jenis Variabel".
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form untuk menambah atau edit */}
          {(isAdding || editingId) && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nama">Nama Variabel</Label>
                    <Input
                      id="nama"
                      value={newVariabel.nama}
                      onChange={(e) => setNewVariabel(prev => ({ ...prev, nama: e.target.value }))}
                      placeholder="Contoh: bonus_tahunan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jenis">Jenis Variabel</Label>
                    <Select 
                      value={newVariabel.jenisId} 
                      onValueChange={(value) => setNewVariabel(prev => ({ ...prev, jenisId: value }))}
                      disabled={jenisVariabel.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          jenisVariabel.length === 0 
                            ? "Tidak ada jenis variabel tersedia" 
                            : "Pilih jenis variabel"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {jenisVariabel.map(jenis => (
                          <SelectItem key={jenis.id} value={jenis.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${jenis.color.split(' ')[0]}`} />
                              {jenis.nama}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="valueType">Tipe Value</Label>
                    <Select value={newVariabel.valueType} onValueChange={(value: "number" | "percentage" | "currency") => setNewVariabel(prev => ({ ...prev, valueType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {valueTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="value">Nilai</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newVariabel.value}
                      onChange={(e) => setNewVariabel(prev => ({ ...prev, value: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={newVariabel.deskripsi}
                      onChange={(e) => setNewVariabel(prev => ({ ...prev, deskripsi: e.target.value }))}
                      placeholder="Deskripsi variabel"
                      rows={2}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="unit">Unit (Opsional)</Label>
                    <Input
                      id="unit"
                      value={newVariabel.unit}
                      onChange={(e) => setNewVariabel(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="Contoh: bulan, kali, tahun"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    size="sm" 
                    onClick={editingId ? handleSaveEdit : handleAdd}
                    disabled={jenisVariabel.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Simpan' : 'Tambah'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daftar variabel custom */}
          <div className="grid gap-3">
            {variabelCustom.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada variabel custom yang dibuat</p>
                <p className="text-sm">Klik "Tambah Variabel" untuk membuat variabel baru</p>
              </div>
            ) : (
              variabelCustom.map(variabel => {
                const jenis = getJenis(variabel.jenisId);
                return (
                  <div key={variabel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      {jenis ? (
                        <Badge className={jenis.color}>{jenis.nama}</Badge>
                      ) : (
                        <Badge variant="destructive">Jenis Tidak Ditemukan</Badge>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{variabel.nama}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUseVariable(variabel.id)}
                            className="h-6 px-2 text-xs"
                          >
                            Gunakan
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{variabel.deskripsi}</p>
                        {!jenis && (
                          <p className="text-xs text-red-600 mt-1">
                            Jenis variabel "{variabel.jenisId}" tidak ditemukan. Silakan edit atau hapus variabel ini.
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="font-mono text-lg font-semibold">
                          {formatValue(variabel.value, variabel.valueType, variabel.unit)}
                        </p>
                        <Input
                          type="number"
                          value={variabel.value}
                          onChange={(e) => handleValueChange(variabel.id, Number(e.target.value))}
                          className="w-24 h-7 text-sm mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(variabel)}
                        disabled={isAdding || Boolean(editingId)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(variabel.id)}
                        disabled={isAdding || Boolean(editingId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
