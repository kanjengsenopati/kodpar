
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { FormulaBar } from "../formula/FormulaBar";

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

interface BuiltInVariable {
  id: string;
  label: string;
  description: string;
  value: number;
}

interface VariabelCustomCRUDProps {
  variabelCustom: VariabelCustom[];
  jenisVariabel: JenisVariabel[];
  builtInVariables: BuiltInVariable[];
  onUpdate: (variabel: VariabelCustom[]) => void;
  onUseVariable: (variableId: string) => void;
}

const valueTypeOptions = [
  { value: "number", label: "Angka" },
  { value: "percentage", label: "Persentase" },
  { value: "currency", label: "Mata Uang" }
];

export function VariabelCustomCRUD({
  variabelCustom,
  jenisVariabel,
  builtInVariables,
  onUpdate,
  onUseVariable
}: VariabelCustomCRUDProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
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

  const handleAdd = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    if (!formData.jenisId) {
      toast.error("Jenis variabel harus dipilih");
      return;
    }

    const id = formData.nama.toLowerCase().replace(/\s+/g, '_');
    
    if (variabelCustom.some(v => v.id === id)) {
      toast.error("Variabel dengan nama tersebut sudah ada");
      return;
    }

    const newVariabel: VariabelCustom = {
      id,
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      jenisId: formData.jenisId,
      valueType: formData.valueType,
      value: formData.value,
      unit: formData.unit,
      formula: formData.formula,
      isEditable: true
    };

    onUpdate([...variabelCustom, newVariabel]);
    resetForm();
    setIsAdding(false);
    toast.success("Variabel custom berhasil ditambahkan");
  };

  const handleEdit = (variabel: VariabelCustom) => {
    setEditingId(variabel.id);
    setFormData({
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
    if (!formData.nama.trim()) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    const updatedVariabel = variabelCustom.map(v => 
      v.id === editingId 
        ? { 
            ...v, 
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            jenisId: formData.jenisId,
            valueType: formData.valueType,
            value: formData.value,
            unit: formData.unit,
            formula: formData.formula
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

  const resetForm = () => {
    setFormData({
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

  const handleDragStart = (e: React.DragEvent, variableId: string) => {
    e.dataTransfer.setData('text/plain', variableId);
  };

  const allVariables = [
    ...builtInVariables.map(v => ({ id: v.id, nama: v.label, type: 'builtin' })),
    ...variabelCustom.map(v => ({ id: v.id, nama: v.nama, type: 'custom' }))
  ];

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
        Tambah Variabel Custom
      </Button>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                placeholder="Nama variabel"
              />
            </div>
            
            <div>
              <Label htmlFor="jenis">Jenis</Label>
              <Select value={formData.jenisId} onValueChange={(value) => setFormData(prev => ({ ...prev, jenisId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {jenisVariabel.map(jenis => (
                    <SelectItem key={jenis.id} value={jenis.id}>
                      {jenis.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="valueType">Tipe Value</Label>
              <Select value={formData.valueType} onValueChange={(value: "number" | "percentage" | "currency") => setFormData(prev => ({ ...prev, valueType: value }))}>
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
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              placeholder="Deskripsi variabel"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="formula">Formula (Opsional)</Label>
            <FormulaBar
              value={formData.formula}
              onChange={(value) => setFormData(prev => ({ ...prev, formula: value }))}
              className="mt-1"
            />
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

      {/* Variables List */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Variabel Tersedia (Drag & Drop ke Formula)</Label>
        
        {/* Built-in Variables */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Built-in Variables:</p>
          {builtInVariables.map(variable => (
            <div
              key={variable.id}
              draggable
              onDragStart={(e) => handleDragStart(e, variable.id)}
              className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted/50"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">{variable.label}</Badge>
              <span className="text-sm text-muted-foreground">{variable.description}</span>
            </div>
          ))}
        </div>

        {/* Custom Variables */}
        {variabelCustom.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Custom Variables:</p>
            {variabelCustom.map(variabel => (
              <div key={variabel.id} className="flex items-center justify-between p-2 border rounded">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, variabel.id)}
                  className="flex items-center gap-2 flex-1 cursor-move"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{variabel.nama}</Badge>
                  <span className="text-sm text-muted-foreground">{variabel.deskripsi}</span>
                </div>
                
                <div className="flex gap-1">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
