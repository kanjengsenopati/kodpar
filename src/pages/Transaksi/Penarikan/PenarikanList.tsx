
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllTransaksi, deleteTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
import { TransaksiTable } from "@/components/transaksi/TransaksiTable";
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

export default function PenarikanList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [penarikanList, setPenarikanList] = useState<Transaksi[]>([]);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID Penarikan", isVisible: true },
    { id: "tanggal", label: "Tanggal", isVisible: true },
    { id: "anggota", label: "Anggota", isVisible: true },
    { id: "jumlah", label: "Jumlah", isVisible: true },
    { id: "keterangan", label: "Keterangan", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
  ]);
  
  useEffect(() => {
    loadPenarikanData();
  }, []);
  
  const loadPenarikanData = () => {
    const allTransaksi = getAllTransaksi();
    const penarikanData = allTransaksi.filter(t => t.jenis === "Penarikan");
    setPenarikanList(penarikanData);
  };
  
  const handleToggleColumn = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => 
        column.id === columnId 
        ? { ...column, isVisible: !column.isVisible } 
        : column
      )
    );
  };
  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      const success = deleteTransaksi(deleteId);
      if (success) {
        toast({
          title: "Penarikan berhasil dihapus",
          description: `Penarikan dengan ID ${deleteId} telah dihapus`,
        });
        loadPenarikanData();
      } else {
        toast({
          title: "Gagal menghapus penarikan",
          description: "Terjadi kesalahan saat menghapus data penarikan",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };
  
  // Filter penarikan based on search query and filter status
  const filteredPenarikan = penarikanList.filter(penarikan => {
    const matchesSearch = 
      penarikan.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      penarikan.anggotaNama.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "semua") {
      return matchesSearch;
    }
    
    return matchesSearch && penarikan.status.toLowerCase() === filterStatus.toLowerCase();
  });
  
  return (
    <Layout pageTitle="Daftar Penarikan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Penarikan Simpanan</h1>
        <Button asChild className="gap-2">
          <Link to="/transaksi/penarikan/tambah">
            <Plus size={16} /> Tambah Penarikan
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Cari berdasarkan ID atau nama anggota..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="sukses">Sukses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="gagal">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
          </div>
          
          <div className="overflow-x-auto">
            <TransaksiTable 
              data={filteredPenarikan}
              columns={columns}
              type="penarikan"
              onDelete={handleDeleteClick}
              emptyMessage="Tidak ada data penarikan"
            />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus penarikan ini? Tindakan ini tidak dapat dibatalkan.
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
