
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getTransaksiById, updateTransaksi } from "@/services/transaksiService";
import { getAllAnggota } from "@/services/anggotaService";
import { Anggota, Transaksi } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PenarikanEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  
  const [formData, setFormData] = useState({
    anggotaId: "",
    jumlah: "",
    tanggal: "",
    keterangan: "",
    status: "Sukses" as "Sukses" | "Pending" | "Gagal"
  });

  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      if (transaksiData && transaksiData.jenis === "Penarikan") {
        setTransaksi(transaksiData);
        setFormData({
          anggotaId: transaksiData.anggotaId,
          jumlah: transaksiData.jumlah.toString(),
          tanggal: transaksiData.tanggal,
          keterangan: transaksiData.keterangan || "",
          status: transaksiData.status
        });
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: "Penarikan tidak ditemukan",
          variant: "destructive",
        });
        navigate("/transaksi/penarikan");
      }
    }
    
    const anggota = getAllAnggota();
    setAnggotaList(anggota);
    setLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaksi) return;

    const updatedData = {
      ...transaksi,
      anggotaId: formData.anggotaId,
      jumlah: parseFloat(formData.jumlah),
      tanggal: formData.tanggal,
      keterangan: formData.keterangan,
      status: formData.status,
      updatedAt: new Date().toISOString()
    };

    const success = updateTransaksi(transaksi.id, updatedData);
    
    if (success) {
      toast({
        title: "Berhasil",
        description: "Penarikan berhasil diperbarui",
      });
      navigate("/transaksi/penarikan");
    } else {
      toast({
        title: "Gagal",
        description: "Gagal memperbarui penarikan",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Edit Penarikan">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Edit Penarikan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data penarikan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Edit Penarikan">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/penarikan">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Penarikan</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Edit Penarikan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="anggotaId">Anggota</Label>
                  <Select value={formData.anggotaId} onValueChange={(value) => setFormData({...formData, anggotaId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Anggota" />
                    </SelectTrigger>
                    <SelectContent>
                      {anggotaList.map((anggota) => (
                        <SelectItem key={anggota.id} value={anggota.id}>
                          {anggota.nama} - {anggota.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jumlah">Jumlah Penarikan</Label>
                  <Input
                    id="jumlah"
                    type="number"
                    value={formData.jumlah}
                    onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "Sukses" | "Pending" | "Gagal") => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sukses">Sukses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Gagal">Gagal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  placeholder="Masukkan keterangan..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Simpan Perubahan</Button>
                <Link to="/transaksi/penarikan">
                  <Button type="button" variant="outline">Batal</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
