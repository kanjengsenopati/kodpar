
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { getAllTransaksi, deleteTransaksi } from "@/services/transaksiService";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import { Transaksi } from "@/types";
import { ExpandableTransaksiRow } from "@/components/transaksi/ExpandableTransaksiRow";

export default function SimpanList() {
  const { toast } = useToast();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [filteredList, setFilteredList] = useState<Transaksi[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSimpananData();
  }, []);

  useEffect(() => {
    filterData();
  }, [transaksiList, searchTerm]);

  const loadSimpananData = () => {
    const allTransaksi = getAllTransaksi();
    const simpananTransaksi = allTransaksi.filter(t => t.jenis === "Simpan");
    setTransaksiList(simpananTransaksi);
  };

  const filterData = () => {
    let filtered = transaksiList;
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.anggotaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.kategori && t.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredList(filtered);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      const success = deleteTransaksi(id);
      if (success) {
        toast({ title: "Transaksi berhasil dihapus", description: "Data simpanan telah dihapus dari sistem" });
        loadSimpananData();
      } else {
        toast({ title: "Gagal menghapus transaksi", description: "Terjadi kesalahan saat menghapus data", variant: "destructive" });
      }
    }
  };

  const headers = ["ID Transaksi", "Tanggal", "Nama Anggota", "Kategori", "Jumlah", "Status", "Aksi"];

  return (
    <Layout pageTitle="Daftar Simpanan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Transaksi Simpanan</h1>
        <Button asChild>
          <Link to="/transaksi/simpan/tambah">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Simpanan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Simpanan</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama anggota, ID transaksi, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  {headers.map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} className="text-center py-10">
                      {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data simpanan"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredList.map((transaksi) => (
                    <ExpandableTransaksiRow
                      key={transaksi.id}
                      transaksi={transaksi}
                      type="simpan"
                      onDelete={handleDelete}
                      colSpan={headers.length}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
