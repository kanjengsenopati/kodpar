import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileUp,
  FileDown,
  FileText,
  BarChart,
  Search,
  RefreshCw
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PemasukanPengeluaran } from "@/types";
import { 
  getPemasukanPengeluaranByJenis,
  deletePemasukanPengeluaran 
} from "@/services/keuanganService";
import { useKeuanganTransaksiSync } from "@/hooks/useKeuanganSync";
import TransaksiTable from "@/components/keuangan/TransaksiTable";
import TransaksiForm from "@/components/keuangan/TransaksiForm";
import { DeleteConfirmDialog } from "@/components/keuangan/DeleteConfirmDialog";
import { TransaksiDetailDialog } from "@/components/keuangan/TransaksiDetailDialog";

export default function TransaksiList() {
  const navigate = useNavigate();
  const { data: allTransactions, isLoading: dataLoading, syncAfterOperation } = useKeuanganTransaksiSync();
  const [filteredTransactions, setFilteredTransactions] = useState<PemasukanPengeluaran[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PemasukanPengeluaran | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter transactions when data changes, tab changes, or search query updates
  useEffect(() => {
    filterTransactions();
  }, [allTransactions, activeTab, searchQuery]);
  
  // Filter transactions based on active tab and search query
  const filterTransactions = () => {
    let filtered = [...allTransactions];
    
    // Filter by transaction type
    if (activeTab === "pemasukan") {
      filtered = filtered.filter(t => t.jenis === "Pemasukan");
    } else if (activeTab === "pengeluaran") {
      filtered = filtered.filter(t => t.jenis === "Pengeluaran");
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.kategori.toLowerCase().includes(query) ||
        (t.keterangan && t.keterangan.toLowerCase().includes(query))
      );
    }
    
    setFilteredTransactions(filtered);
  };
  
  // Handle transaction view
  const handleViewTransaction = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };
  
  // Handle transaction edit
  const handleEditTransaction = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };
  
  // Handle transaction delete
  const handleDeletePrompt = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsDeleteOpen(true);
  };
  
  // Enhanced delete with accounting sync
  const confirmDelete = async () => {
    if (selectedTransaction) {
      try {
        const success = deletePemasukanPengeluaran(selectedTransaction.id);
        if (success) {
          toast.success("Transaksi berhasil dihapus");
          
          // Enhanced sync: notify accounting system
          console.log('Triggering accounting sync after deletion...');
          syncAfterOperation();
          window.dispatchEvent(new CustomEvent('accounting-sync-updated', {
            detail: { 
              action: 'delete',
              transactionId: selectedTransaction.id,
              transactionType: selectedTransaction.jenis,
              timestamp: Date.now()
            }
          }));
          
          setIsDeleteOpen(false);
        } else {
          toast.error("Gagal menghapus transaksi");
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Gagal menghapus transaksi");
      }
    }
  };
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Enhanced form success handler with accounting sync
  const handleFormSuccess = () => {
    console.log('Form success, triggering enhanced sync...');
    syncAfterOperation(); // This already triggers accounting sync via the hook
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };
  
  // Close form handler
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };
  
  return (
    <Layout pageTitle="Transaksi Keuangan">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaksi Keuangan</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Kelola pemasukan dan pengeluaran
              <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                <RefreshCw className="h-3 w-3" />
                Sinkronisasi Real-time dengan Akuntansi
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/keuangan/laporan")}>
              <BarChart className="h-4 w-4 mr-2" />
              Laporan
            </Button>
            <Button onClick={() => {
              setIsFormOpen(true);
              setSelectedTransaction(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileUp className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Pemasukan</h2>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {allTransactions.filter(t => t.jenis === "Pemasukan").length}
              </p>
              <p className="text-sm text-muted-foreground">Total transaksi</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <FileDown className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Pengeluaran</h2>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {allTransactions.filter(t => t.jenis === "Pengeluaran").length}
              </p>
              <p className="text-sm text-muted-foreground">Total transaksi</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Semua Transaksi</h2>
              <p className="text-2xl font-bold mt-1">
                {allTransactions.length}
              </p>
              <p className="text-sm text-muted-foreground">Total transaksi</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Tabs 
              defaultValue="semua" 
              className="w-full sm:w-auto"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="semua">Semua</TabsTrigger>
                <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <TransaksiTable
            data={filteredTransactions}
            onView={handleViewTransaction}
            onEdit={handleEditTransaction}
            onDelete={handleDeletePrompt}
          />
        </div>
        
        {/* Transaction Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">
                {selectedTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="px-1">
              <TransaksiForm
                initialData={selectedTransaction || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Transaction Detail Dialog */}
        <TransaksiDetailDialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          transaction={selectedTransaction}
        />
        
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          transaction={selectedTransaction}
        />
      </div>
    </Layout>
  );
}
