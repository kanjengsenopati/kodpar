
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Kategori {
  id: string;
  nama: string;
  deskripsi: string;
  jumlahProduk: number;
  status: "aktif" | "nonaktif";
  createdAt: string;
}

const sampleKategori: Kategori[] = [
  {
    id: "1",
    nama: "Makanan Ringan",
    deskripsi: "Kategori untuk snack dan makanan ringan",
    jumlahProduk: 15,
    status: "aktif",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    nama: "Minuman",
    deskripsi: "Kategori untuk berbagai jenis minuman",
    jumlahProduk: 8,
    status: "aktif",
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    nama: "Alat Tulis",
    deskripsi: "Kategori untuk keperluan alat tulis kantor",
    jumlahProduk: 12,
    status: "aktif", 
    createdAt: "2024-02-01"
  }
];

export default function KategoriBarang() {
  const { toast } = useToast();
  const [kategoriList, setKategoriList] = useState<Kategori[]>(sampleKategori);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredKategori = kategoriList.filter(kategori =>
    kategori.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kategori.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.nama.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori wajib diisi",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Update existing kategori
      setKategoriList(prev => prev.map(kategori => 
        kategori.id === editingId 
          ? { ...kategori, nama: formData.nama, deskripsi: formData.deskripsi }
          : kategori
      ));
      toast({
        title: "Berhasil",
        description: "Kategori berhasil diperbarui"
      });
    } else {
      // Add new kategori
      const newKategori: Kategori = {
        id: Date.now().toString(),
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        jumlahProduk: 0,
        status: "aktif",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setKategoriList(prev => [...prev, newKategori]);
      toast({
        title: "Berhasil",
        description: "Kategori berhasil ditambahkan"
      });
    }

    // Reset form
    setFormData({ nama: "", deskripsi: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (kategori: Kategori) => {
    setFormData({
      nama: kategori.nama,
      deskripsi: kategori.deskripsi
    });
    setEditingId(kategori.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setKategoriList(prev => prev.filter(kategori => kategori.id !== id));
    toast({
      title: "Berhasil",
      description: "Kategori berhasil dihapus"
    });
  };

  const resetForm = () => {
    setFormData({ nama: "", deskripsi: "" });
    setEditingId(null);
  };

  return (
    <Layout pageTitle="Kategori Barang">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Kategori Barang</h1>
            <p className="text-muted-foreground">Kelola kategori produk untuk KPRI Mart</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Kategori *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    placeholder="Masukkan nama kategori"
                  />
                </div>
                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                    placeholder="Masukkan deskripsi kategori"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingId ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKategori.map((kategori) => (
            <Card key={kategori.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{kategori.nama}</CardTitle>
                  </div>
                  <Badge variant={kategori.status === "aktif" ? "default" : "secondary"}>
                    {kategori.status}
                  </Badge>
                </div>
                <CardDescription>{kategori.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jumlah Produk:</span>
                    <span className="font-medium">{kategori.jumlahProduk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dibuat:</span>
                    <span>{new Date(kategori.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(kategori)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(kategori.id)}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredKategori.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {searchQuery ? "Kategori tidak ditemukan" : "Belum ada kategori"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Coba ubah kata kunci pencarian" : "Tambah kategori pertama untuk memulai"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
