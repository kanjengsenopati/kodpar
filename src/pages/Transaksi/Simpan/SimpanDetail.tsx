
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { getTransaksiById, deleteTransaksi } from '@/services/transaksiService';
import { Transaksi } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function SimpanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadedTransaksi = getTransaksiById(id);
      if (loadedTransaksi && loadedTransaksi.jenis === "Simpan") {
        setTransaksi(loadedTransaksi);
      } else {
        toast({
          title: "Transaksi tidak ditemukan",
          description: "Data simpanan tidak ditemukan",
          variant: "destructive"
        });
        navigate("/transaksi/simpan");
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleDelete = () => {
    if (transaksi && window.confirm("Apakah Anda yakin ingin menghapus simpanan ini?")) {
      const success = deleteTransaksi(transaksi.id);
      if (success) {
        toast({
          title: "Simpanan berhasil dihapus",
          description: "Data simpanan telah berhasil dihapus"
        });
        navigate("/transaksi/simpan");
      } else {
        toast({
          title: "Gagal menghapus simpanan",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data simpanan...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Simpanan Tidak Ditemukan">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Simpanan Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">Data simpanan yang Anda cari tidak ditemukan.</p>
          <Link to="/transaksi/simpan">
            <Button>Kembali ke Daftar Simpanan</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Simpanan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/simpan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Simpanan</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Simpanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID Transaksi</label>
                <p className="text-lg font-semibold">{transaksi.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                <p className="text-lg">{formatDate(transaksi.tanggal)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama Anggota</label>
                <p className="text-lg">{transaksi.anggotaNama}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID Anggota</label>
                <p className="text-lg">{transaksi.anggotaId}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kategori Simpanan</label>
                <p className="text-lg">{transaksi.kategori || "Simpanan"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jumlah</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(transaksi.jumlah)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Gagal" ? "bg-red-100 text-red-800" : 
                  "bg-amber-100 text-amber-800"
                }`}>
                  {transaksi.status}
                </span>
              </div>
              
              {transaksi.keterangan && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Keterangan</label>
                  <p className="text-lg">{transaksi.keterangan}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link to={`/transaksi/simpan/${transaksi.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit size={16} />
              Edit Simpanan
            </Button>
          </Link>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Hapus Simpanan
          </Button>
        </div>
      </div>
    </Layout>
  );
}
