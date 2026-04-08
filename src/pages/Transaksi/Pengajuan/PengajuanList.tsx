
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getPengajuanList, deletePengajuan } from "@/services/pengajuanService";
import { Pengajuan } from "@/types";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
import { PengajuanTable } from "@/components/transaksi/PengajuanTable";
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

export default function PengajuanList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState([
    { id: "id", label: "ID Pengajuan", isVisible: true },
    { id: "tanggal", label: "Tanggal", isVisible: true },
    { id: "anggota", label: "Anggota", isVisible: true },
    { id: "jenis", label: "Jenis", isVisible: true },
    { id: "jumlah", label: "Jumlah", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "keterangan", label: "Keterangan", isVisible: true },
  ]);
  
  useEffect(() => {
    loadPengajuanData();
  }, []);
  
  const loadPengajuanData = () => {
    console.log("Loading pengajuan data...");
    const data = getPengajuanList();
    console.log("Loaded pengajuan data:", data);
    setPengajuanList(data);
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
  
  // Confirm delete dialog
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      console.log("Deleting pengajuan:", deleteId);
      const success = deletePengajuan(deleteId);
      if (success) {
        toast({
          title: "Pengajuan berhasil dihapus",
          description: `Pengajuan dengan ID ${deleteId} telah dihapus`,
        });
        loadPengajuanData(); // Reload data after deletion
      } else {
        toast({
          title: "Gagal menghapus pengajuan",
          description: "Terjadi kesalahan saat menghapus data pengajuan",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };
  
  // Filter pengajuan based on search query and filter status
  const filteredPengajuan = pengajuanList.filter(pengajuan => {
    const matchesSearch = 
      pengajuan.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pengajuan.anggotaNama.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "semua") {
      return matchesSearch;
    }
    
    return matchesSearch && pengajuan.status.toLowerCase() === filterStatus.toLowerCase();
  });
  
  console.log("Filtered pengajuan:", filteredPengajuan);
  
  return (
    <Layout pageTitle="Daftar Pengajuan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Pengajuan</h1>
        <Button asChild className="gap-2">
          <Link to="/transaksi/pengajuan/tambah">
            <Plus size={16} /> Tambah Pengajuan
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
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="menunggu">Menunggu</SelectItem>
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
          </div>
          
          <div className="overflow-x-auto">
            <PengajuanTable 
              pengajuan={filteredPengajuan}
              onDelete={handleDeleteClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.
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
