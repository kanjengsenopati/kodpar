
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { JurnalEntry } from "@/types/akuntansi";
import { 
  getAllJurnalEntries,
  deleteJurnalEntry,
  postJurnalEntry,
  reverseJurnalEntry 
} from "@/services/akuntansi/jurnalService";
import { batchSyncTransactionsToAccounting } from "@/services/akuntansi/syncOperationsService";
import { JurnalHeader } from "./components/JurnalHeader";
import { JurnalFilters } from "./components/JurnalFilters";
import { JurnalTable } from "./components/JurnalTable";

export default function JurnalUmumContent() {
  const { toast } = useToast();
  const [jurnalEntries, setJurnalEntries] = useState<JurnalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "posted" | "reversed">("all");
  const [isLoading, setIsLoading] = useState(false);

  // Load jurnal entries
  const loadJurnalEntries = () => {
    setIsLoading(true);
    try {
      const data = getAllJurnalEntries();
      setJurnalEntries(data);
    } catch (error) {
      console.error("Error loading jurnal entries:", error);
      toast({
        title: "Gagal memuat data jurnal",
        description: "Terjadi kesalahan saat memuat daftar jurnal",
        variant: "destructive",
      });
      setJurnalEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete jurnal entry
  const handleDeleteJurnal = async (id: string) => {
    try {
      await deleteJurnalEntry(id);
      toast({
        title: "Jurnal berhasil dihapus",
      });
      loadJurnalEntries();
    } catch (error: any) {
      console.error("Error deleting jurnal:", error);
      toast({
        title: "Gagal menghapus jurnal",
        description: error.message || "Terjadi kesalahan saat menghapus jurnal",
        variant: "destructive",
      });
    }
  };

  // Post jurnal entry
  const handlePostJurnal = async (id: string) => {
    try {
      await postJurnalEntry(id);
      toast({
        title: "Jurnal berhasil di-post",
      });
      loadJurnalEntries();
    } catch (error: any) {
      console.error("Error posting jurnal:", error);
      toast({
        title: "Gagal mem-post jurnal",
        description: error.message || "Terjadi kesalahan saat mem-post jurnal",
        variant: "destructive",
      });
    }
  };

  // Reverse jurnal entry
  const handleReverseJurnal = async (id: string) => {
    try {
      await reverseJurnalEntry(id);
      toast({
        title: "Jurnal berhasil di-reverse",
      });
      loadJurnalEntries();
    } catch (error: any) {
      console.error("Error reversing jurnal:", error);
      toast({
        title: "Gagal me-reverse jurnal",
        description: error.message || "Terjadi kesalahan saat me-reverse jurnal",
        variant: "destructive",
      });
    }
  };

  // Batch sync transactions
  const handleBatchSync = async () => {
    try {
      setIsLoading(true);
      const result = batchSyncTransactionsToAccounting();
      
      toast({
        title: "Sinkronisasi Berhasil",
        description: `${result.successful} transaksi berhasil disinkronkan, ${result.failed} gagal dari total ${result.totalProcessed} transaksi`,
      });
    } catch (error) {
      toast({
        title: "Sinkronisasi Gagal", 
        description: "Terjadi kesalahan saat sinkronisasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered jurnal entries
  const filteredJurnalEntries = jurnalEntries.filter((entry) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const matchesSearch = searchRegex.test(entry.nomorJurnal) || searchRegex.test(entry.deskripsi);
    
    let matchesStatus = true;
    if (filterStatus !== "all") {
      matchesStatus = entry.status.toLowerCase() === filterStatus;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Effects
  useEffect(() => {
    loadJurnalEntries();
  }, []);

  return (
    <div className="space-y-6">
      <JurnalHeader 
        onRefresh={loadJurnalEntries}
        onBatchSync={handleBatchSync}
      />

      <JurnalFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      <JurnalTable
        entries={filteredJurnalEntries}
        isLoading={isLoading}
        onPostJurnal={handlePostJurnal}
        onReverseJurnal={handleReverseJurnal}
        onDeleteJurnal={handleDeleteJurnal}
      />
    </div>
  );
}
