import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

interface JenisVariabel {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom";
  color: string;
}

interface JenisVariabelCRUDProps {
  jenisVariabel: JenisVariabel[];
  onUpdate: (jenis: JenisVariabel[]) => void;
}

const kategoriOptions = [
  { value: "simpanan", label: "Simpanan" },
  { value: "pinjaman", label: "Pinjaman" },
  { value: "keuangan", label: "Keuangan" },
  { value: "waktu", label: "Waktu" },
  { value: "custom", label: "Custom" }
];

const colorOptions = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-red-100 text-red-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-orange-100 text-orange-800"
];

export function JenisVariabelCRUD({ jenisVariabel, onUpdate }: JenisVariabelCRUDProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    nama: string;
    deskripsi: string;
    kategori: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom";
    color: string;
  }>({
    nama: "",
    deskripsi: "",
    kategori: "custom",
    color: colorOptions[0]
  });

  const handleAdd = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama jenis variabel harus diisi");
      return;
    }

    const id = formData.nama.toLowerCase().replace(/\s+/g, '_');
    
    if (jenisVariabel.some(j => j.id === id)) {
      toast.error("Jenis variabel dengan nama tersebut sudah ada");
      return;
    }

    const newJenis: JenisVariabel = {
      id,
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      kategori: formData.kategori,
      color: formData.color
    };

    onUpdate([...jenisVariabel, newJenis]);
    resetForm();
    setIsAdding(false);
    toast.success("Jenis variabel berhasil ditambahkan");
  };

  const handleEdit = (jenis: JenisVariabel) => {
    setEditingId(jenis.id);
    setFormData({
      nama: jenis.nama,
      deskripsi: jenis.deskripsi,
      kategori: jenis.kategori,
      color: jenis.color
    });
  };

  const handleSaveEdit = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama jenis variabel harus diisi");
      return;
    }

    const updatedJenis = jenisVariabel.map(j => 
      j.id === editingId 
        ? { 
            ...j, 
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            kategori: formData.kategori,
            color: formData.color
          }
        : j
    );

    onUpdate(updatedJenis);
    resetForm();
    setEditingId(null);
    toast.success("Jenis variabel berhasil diperbarui");
  };

  const handleDelete = (id: string) => {
    onUpdate(jenisVariabel.filter(j => j.id !== id));
    toast.success("Jenis variabel berhasil dihapus");
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      kategori: "custom",
      color: colorOptions[0]
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
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
        Tambah Jenis Variabel
      </Button>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
              placeholder="Nama jenis variabel"
            />
          </div>
          
          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Select value={formData.kategori} onValueChange={(value: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom") => setFormData(prev => ({ ...prev, kategori: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="color">Warna</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(color => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${color.split(' ')[0]}`} />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              placeholder="Deskripsi jenis variabel"
              rows={2}
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

      {/* List */}
      <div className="space-y-2">
        {jenisVariabel.map(jenis => (
          <div key={jenis.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Badge className={jenis.color}>{jenis.nama}</Badge>
              <div>
                <p className="text-sm font-medium">{jenis.deskripsi}</p>
                <p className="text-xs text-muted-foreground">{jenis.kategori}</p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEdit(jenis)}
                disabled={isAdding || Boolean(editingId)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(jenis.id)}
                disabled={isAdding || Boolean(editingId)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
