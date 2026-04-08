import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { Penjualan } from "@/types";
import { 
  getAllPenjualan, 
  deletePenjualan, 
  updatePenjualan 
} from "@/services/penjualan";

// Import refactored components
import { TransactionFilters } from "@/components/transaksi/TransactionFilters";
import { TransactionTable } from "@/components/transaksi/TransactionTable";
import { EmptyTransactionAlert } from "@/components/transaksi/EmptyTransactionAlert";

export default function RiwayatTransaksi() {
  const { toast } = useToast();
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "sukses" | "dibatalkan">("all");
  const [filteredPenjualan, setFilteredPenjualan] = useState<Penjualan[]>([]);

  // Load penjualan on component mount
  useEffect(() => {
    loadPenjualan();
  }, []);

  // Filter penjualan when search query, filter status or penjualan list changes
  useEffect(() => {
    let filtered = penjualanList;
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nomorTransaksi.toLowerCase().includes(query) ||
          item.tanggal.includes(query) ||
          item.metodePembayaran.includes(query)
      );
    }
    
    setFilteredPenjualan(filtered);
  }, [searchQuery, filterStatus, penjualanList]);

  const loadPenjualan = () => {
    const allPenjualan = getAllPenjualan();
    // Sort by date descending (newest first)
    const sorted = [...allPenjualan].sort((a, b) => 
      new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    setPenjualanList(sorted);
    setFilteredPenjualan(sorted);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter status change
  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value as "all" | "sukses" | "dibatalkan");
  };

  // Handle view transaction
  const handleViewTransaction = (id: string) => {
    window.location.href = `/pos/penjualan/${id}`;
  };

  // Handle cancel transaction
  const handleCancelTransaction = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan transaksi ini? Stok produk akan dikembalikan.")) {
      try {
        updatePenjualan(id, { status: "dibatalkan" });
        loadPenjualan();
        
        toast({
          title: "Sukses",
          description: "Transaksi berhasil dibatalkan dan stok dikembalikan",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal membatalkan transaksi",
          variant: "destructive",
        });
      }
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        deletePenjualan(id);
        loadPenjualan();
        
        toast({
          title: "Sukses",
          description: "Transaksi berhasil dihapus",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus transaksi",
          variant: "destructive",
        });
      }
    }
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      cash: "Tunai",
      debit: "Kartu Debit",
      kredit: "Kartu Kredit",
      qris: "QRIS"
    };
    return methodMap[method] || method;
  };

  return (
    <Layout pageTitle="Riwayat Transaksi">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle>Riwayat Transaksi Penjualan</CardTitle>
              </div>
              <TransactionFilters 
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                onSearchChange={handleSearchChange}
                onFilterStatusChange={handleFilterStatusChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            <EmptyTransactionAlert 
              isEmpty={penjualanList.length === 0}
              isFiltered={penjualanList.length > 0 && filteredPenjualan.length === 0}
            />
            
            {penjualanList.length > 0 && filteredPenjualan.length > 0 && (
              <TransactionTable 
                transactions={filteredPenjualan}
                formatPaymentMethod={formatPaymentMethod}
                onViewTransaction={handleViewTransaction}
                onCancelTransaction={handleCancelTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
