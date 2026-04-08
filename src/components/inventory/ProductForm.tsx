
import React, { useState } from "react";
import { ProdukItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductFormProps {
  initialData?: Partial<ProdukItem>;
  isEditing: boolean;
  onSubmit: (data: Omit<ProdukItem, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Omit<ProdukItem, "id" | "createdAt">>({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    kategori: initialData?.kategori || "",
    hargaBeli: initialData?.hargaBeli || 0,
    hargaJual: initialData?.hargaJual || 0,
    stok: initialData?.stok || 0,
    satuan: initialData?.satuan || "pcs",
    deskripsi: initialData?.deskripsi || "",
    gambar: initialData?.gambar || ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(formData.gambar || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "hargaBeli" || name === "hargaJual" || name === "stok"
        ? Number(value)
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    setIsUploading(true);
    
    // File validation
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Ukuran file terlalu besar",
        description: "Ukuran gambar maksimum 2MB",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    if (!file.type.match('image.*')) {
      toast({
        title: "Format file tidak didukung",
        description: "File harus berupa gambar (JPG, PNG, GIF)",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setImagePreview(imageDataUrl);
      setFormData(prev => ({
        ...prev,
        gambar: imageDataUrl
      }));
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Gagal memuat gambar",
        description: "Terjadi kesalahan saat memuat gambar",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      gambar: ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Perbarui informasi produk yang sudah ada"
              : "Isi informasi untuk menambahkan produk baru ke inventori"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kode">Kode Produk</Label>
                  <Input
                    id="kode"
                    name="kode"
                    value={formData.kode}
                    onChange={handleChange}
                    placeholder="Masukkan kode produk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Produk</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Input
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    placeholder="Masukkan kategori"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="satuan">Satuan</Label>
                  <Input
                    id="satuan"
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleChange}
                    placeholder="Masukkan satuan (pcs, kg, dll)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="hargaBeli">Harga Beli (Rp)</Label>
                  <Input
                    id="hargaBeli"
                    name="hargaBeli"
                    type="number"
                    value={formData.hargaBeli}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hargaJual">Harga Jual (Rp)</Label>
                  <Input
                    id="hargaJual"
                    name="hargaJual"
                    type="number"
                    value={formData.hargaJual}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stok">Stok</Label>
                  <Input
                    id="stok"
                    name="stok"
                    type="number"
                    value={formData.stok}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="border rounded-md p-4 space-y-4">
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center border border-dashed border-gray-300 rounded-md overflow-hidden">
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Image className="h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {isUploading ? "Memuat..." : "Belum ada gambar"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ukuran maksimum: 2MB. Format: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi produk"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Perbarui Produk"
              : "Tambah Produk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
