
import { useState, useEffect } from 'react';
import { PemasukanPengeluaran } from '@/types';
import { 
  getPemasukanPengeluaranByJenis, 
  getPemasukanPengeluaranByPeriod,
  deletePemasukanPengeluaran,
  createPemasukanPengeluaran,
  updatePemasukanPengeluaran,
  getPemasukanPengeluaranById
} from '@/services/keuangan';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { isAfter, isBefore, isEqual } from 'date-fns';

export function useKeuanganTransaksi(initialJenis: "Pemasukan" | "Pengeluaran" = "Pemasukan") {
  const [jenis, setJenis] = useState<"Pemasukan" | "Pengeluaran">(initialJenis);
  const [transactions, setTransactions] = useState<PemasukanPengeluaran[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PemasukanPengeluaran[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Load transactions based on active jenis
  const loadTransactions = (transactionJenis: "Pemasukan" | "Pengeluaran" = jenis) => {
    setIsLoading(true);
    try {
      console.log('Loading transactions for jenis:', transactionJenis);
      let data = getPemasukanPengeluaranByJenis(transactionJenis);
      
      // Sort by date descending (newest first)
      data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      console.log('Transactions loaded:', data.length, 'items');
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on search query and date range
  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.kategori.toLowerCase().includes(query) ||
        (t.keterangan && t.keterangan.toLowerCase().includes(query))
      );
    }
    
    // Filter by date range if both from and to dates are set
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.tanggal);
        return (
          (isEqual(transactionDate, dateRange.from) || isAfter(transactionDate, dateRange.from)) &&
          (isEqual(transactionDate, dateRange.to) || isBefore(transactionDate, dateRange.to))
        );
      });
    }
    
    setFilteredTransactions(filtered);
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      console.log('Deleting transaction:', id);
      const success = deletePemasukanPengeluaran(id);
      if (success) {
        toast.success("Transaksi berhasil dihapus");
        loadTransactions();
        return true;
      } else {
        console.error('Transaction not found for deletion:', id);
        toast.error("Transaksi tidak ditemukan");
        return false;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Gagal menghapus transaksi");
      return false;
    }
  };

  // Create or update a transaction
  const saveTransaction = (transaction: Partial<PemasukanPengeluaran> & { jenis: "Pemasukan" | "Pengeluaran" }) => {
    try {
      console.log('Saving transaction:', transaction);
      
      if (transaction.id) {
        // Update existing transaction
        const updated = updatePemasukanPengeluaran(transaction.id, transaction);
        if (updated) {
          toast.success("Transaksi berhasil diperbarui");
          loadTransactions(transaction.jenis);
          return updated;
        } else {
          console.error('Transaction not found for update:', transaction.id);
          toast.error("Transaksi tidak ditemukan");
          return null;
        }
      } else {
        // Create new transaction - ensure required fields are present
        if (!transaction.tanggal || !transaction.kategori || transaction.jumlah === undefined) {
          console.error('Missing required fields:', transaction);
          toast.error("Data transaksi tidak lengkap");
          return null;
        }
        
        // Create new transaction
        const newTransaction = {
          tanggal: transaction.tanggal,
          kategori: transaction.kategori,
          jumlah: transaction.jumlah,
          keterangan: transaction.keterangan || "",
          jenis: transaction.jenis,
          createdBy: transaction.createdBy || 'user_1'
        };
        
        const created = createPemasukanPengeluaran(newTransaction);
        toast.success("Transaksi berhasil disimpan");
        loadTransactions(transaction.jenis);
        return created;
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Gagal menyimpan transaksi");
      return null;
    }
  };

  // Get transaction by ID
  const getTransactionById = (id: string) => {
    try {
      return getPemasukanPengeluaranById(id);
    } catch (error) {
      console.error("Error getting transaction by id:", error);
      return undefined;
    }
  };

  // Calculate total for displayed transactions
  const calculateTotal = () => {
    return filteredTransactions.reduce((total, t) => total + t.jumlah, 0);
  };

  // Effect to filter transactions when dependencies change
  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, dateRange]);

  // Effect to load transactions when jenis changes
  useEffect(() => {
    loadTransactions();
  }, [jenis]);

  return {
    jenis,
    setJenis,
    transactions,
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    isLoading,
    loadTransactions,
    deleteTransaction,
    saveTransaction,
    getTransactionById,
    calculateTotal
  };
}
