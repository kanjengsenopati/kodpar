
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

interface JenisVariabel {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: "simpanan" | "pinjaman" | "keuangan" | "waktu" | "custom";
  color: string;
}

interface JenisVariabelManagerProps {
  jenisVariabel: JenisVariabel[];
  onUpdate: (jenisVariabel: JenisVariabel[]) => void;
}

const defaultJenisVariabel: JenisVariabel[] = [
  {
    id: "simpanan",
    nama: "Simpanan",
    deskripsi: "Variabel terkait simpanan anggota",
    kategori: "simpanan",
    color: "bg-green-100 text-green-800"
  },
  {
    id: "pinjaman", 
    nama: "Pinjaman",
    deskripsi: "Variabel terkait pinjaman anggota",
    kategori: "pinjaman",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "keuangan",
    nama: "Keuangan",
    deskripsi: "Variabel terkait transaksi keuangan",
    kategori: "keuangan", 
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: "waktu",
    nama: "Waktu",
    deskripsi: "Variabel terkait durasi dan periode",
    kategori: "waktu",
    color: "bg-orange-100 text-orange-800"
  }
];

const colorOptions = [
  "bg-red-100 text-red-800",
  "bg-yellow-100 text-yellow-800", 
  "bg-indigo-100 text-indigo-800",
  "bg-pink-100 text-pink-800",
  "bg-gray-100 text-gray-800"
];

export function JenisVariabelManager({ jenisVariabel, onUpdate }: JenisVariabelManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newJenis, setNewJenis] = useState({
    nama: "",
    deskripsi: "",
    color: colorOptions[0]
  });

  // Initialize with default if empty
  const currentJenis = jenisVariabel.length > 0 ? jenisVariabel : defaultJenisVariabel;

  const handleAdd = () => {
    if (!newJenis.nama.trim()) {
      toast.error("Nama jenis variabel harus diisi");
      return;
    }

    const id = newJenis.nama.toLowerCase().replace(/\s+/g, '_');
    
    if (currentJenis.some(j => j.id === id)) {
      toast.error("Jenis variabel dengan nama tersebut sudah ada");
      return;
    }

    const jenisVariabelBaru: JenisVariabel = {
      id,
      nama: newJenis.nama,
      deskripsi: newJenis.deskripsi,
      kategori: "custom",
      color: newJenis.color
    };

    onUpdate([...currentJenis, jenisVariabelBaru]);
    setNewJenis({ nama: "", deskripsi: "", color: colorOptions[0] });
    setIsAdding(false);
    toast.success("Jenis variabel berhasil ditambahkan");
  };

  const handleEdit = (jenis: JenisVariabel) => {
    setEditingId(jenis.id);
    setNewJenis({
      nama: jenis.nama,
      deskripsi: jenis.deskripsi,
      color: jenis.color
    });
  };

  const handleSaveEdit = () => {
    if (!newJenis.nama.trim()) {
      toast.error("Nama jenis variabel harus diisi");
      return;
    }

    const updatedJenis = currentJenis.map(j => 
      j.id === editingId 
        ? { ...j, nama: newJenis.nama, deskripsi: newJenis.deskripsi, color: newJenis.color }
        : j
    );

    onUpdate(updatedJenis);
    setEditingId(null);
    setNewJenis({ nama: "", deskripsi: "", color: colorOptions[0] });
    toast.success("Jenis variabel berhasil diperbarui");
  };

  const handleDelete = (id: string) => {
    const jenis = currentJenis.find(j => j.id === id);
    if (jenis?.kategori !== "custom") {
      toast.error("Tidak dapat menghapus jenis variabel default");
      return;
    }

    onUpdate(currentJenis.filter(j => j.id !== id));
    toast.success("Jenis variabel berhasil dihapus");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewJenis({ nama: "", deskripsi: "", color: colorOptions[0] });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Jenis Variabel</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding || Boolean(editingId)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jenis
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Form untuk menambah atau edit */}
          {(isAdding || editingId) && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="nama">Nama Jenis Variabel</Label>
                    <Input
                      id="nama"
                      value={newJenis.nama}
                      onChange={(e) => setNewJenis(prev => ({ ...prev, nama: e.target.value }))}
                      placeholder="Masukkan nama jenis variabel"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={newJenis.deskripsi}
                      onChange={(e) => setNewJenis(prev => ({ ...prev, deskripsi: e.target.value }))}
                      placeholder="Deskripsi jenis variabel"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label>Warna Badge</Label>
                    <div className="flex gap-2 mt-1">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewJenis(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded border-2 ${color} ${
                            newJenis.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
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
              </CardContent>
            </Card>
          )}

          {/* Daftar jenis variabel */}
          <div className="grid gap-3">
            {currentJenis.map(jenis => (
              <div key={jenis.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={jenis.color}>{jenis.nama}</Badge>
                  <div>
                    <p className="font-medium">{jenis.nama}</p>
                    <p className="text-sm text-muted-foreground">{jenis.deskripsi}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(jenis)}
                    disabled={isAdding || Boolean(editingId)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  {jenis.kategori === "custom" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(jenis.id)}
                      disabled={isAdding || Boolean(editingId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
