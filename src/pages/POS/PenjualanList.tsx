
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { Penjualan } from "@/types";
import { getAllPenjualan, deletePenjualan } from "@/services/penjualan";
import { getKasirById } from "@/services/kasirService";

// Import refactored components
import { PenjualanSearchFilter } from "@/components/penjualan/PenjualanSearchFilter";
import { PenjualanTable } from "@/components/penjualan/PenjualanTable";
import { DeleteConfirmDialog } from "@/components/penjualan/DeleteConfirmDialog";

export default function PenjualanList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "sukses" | "dibatalkan">("all");
  const [penjualanToDelete, setPenjualanToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  useEffect(() => {
    // Load sales from local storage
    refreshPenjualanList();
  }, []);
  
  const refreshPenjualanList = () => {
    const loadedPenjualan = getAllPenjualan();
    setPenjualanList(loadedPenjualan);
  };
  
  const handleDeleteClick = (id: string) => {
    setPenjualanToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (penjualanToDelete) {
      const success = deletePenjualan(penjualanToDelete);
      
      if (success) {
        toast({
          title: "Transaksi berhasil dihapus",
          description: "Data transaksi telah dihapus dari sistem",
        });
        
        // Refresh the list
        refreshPenjualanList();
      } else {
        toast({
          title: "Gagal menghapus transaksi",
          description: "Terjadi kesalahan saat menghapus data transaksi",
          variant: "destructive",
        });
      }
      
      setIsConfirmOpen(false);
      setPenjualanToDelete(null);
    }
  };
  
  const getKasirName = (kasirId: string): string => {
    const kasir = getKasirById(kasirId);
    return kasir ? kasir.nama : "-";
  };
  
  const filteredPenjualan = penjualanList.filter(penjualan => {
    const matchesSearch = penjualan.nomorTransaksi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || penjualan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Layout pageTitle="Daftar Transaksi Penjualan">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Daftar Transaksi Penjualan</h1>
        <Link to="/pos/penjualan">
          <Button className="gap-2">
            <Plus size={16} /> Transaksi Baru
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <PenjualanSearchFilter
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onFilterChange={setFilterStatus}
          />
          
          <PenjualanTable
            penjualanList={filteredPenjualan}
            getKasirName={getKasirName}
            onViewDetail={(id) => navigate(`/pos/penjualan/${id}`)}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>
      
      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
}
