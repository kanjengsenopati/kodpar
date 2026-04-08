import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllTransaksi, deleteTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";
import { ExpandableTransaksiRow } from "@/components/transaksi/ExpandableTransaksiRow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PinjamList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setTransaksiList(getAllTransaksi().filter(t => t.jenis === "Pinjam"));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      const success = deleteTransaksi(deleteId);
      if (success) {
        toast({ title: "Transaksi pinjaman berhasil dihapus", description: `Transaksi dengan ID ${deleteId} telah dihapus` });
        loadData();
      } else {
        toast({ title: "Gagal menghapus transaksi", description: "Terjadi kesalahan", variant: "destructive" });
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const filteredTransaksi = transaksiList.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.anggotaNama || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.kategori || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headers = ["ID Transaksi", "Tanggal", "Anggota", "Kategori", "Jumlah", "Status", "Aksi"];

  return (
    <Layout pageTitle="Daftar Pinjaman">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Transaksi Pinjaman</h1>
        <Button asChild className="gap-2">
          <Link to="/transaksi/pinjam/tambah">
            <Plus size={16} /> Tambah Pinjaman
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Cari berdasarkan ID, nama anggota, atau kategori..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

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
                {filteredTransaksi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} className="text-center py-10">
                      Tidak ada data pinjaman yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransaksi.map((transaksi) => (
                    <ExpandableTransaksiRow
                      key={transaksi.id}
                      transaksi={transaksi}
                      type="pinjam"
                      onDelete={handleDeleteClick}
                      colSpan={headers.length}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi pinjaman ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
