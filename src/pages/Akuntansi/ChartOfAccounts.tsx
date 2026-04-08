
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash, ArrowLeft, Building, TrendingUp, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartOfAccount } from "@/types/akuntansi";
import { COAForm } from "@/components/akuntansi/COAForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  getAllChartOfAccounts, 
  createChartOfAccount, 
  updateChartOfAccount, 
  deleteChartOfAccount
} from "@/services/akuntansi/coaService";

export default function ChartOfAccounts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<ChartOfAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<ChartOfAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, selectedType]);

  const loadAccounts = async () => {
    try {
      setIsInitialLoading(true);
      const data = getAllChartOfAccounts();
      // Sort by account code for better organization
      data.sort((a, b) => a.kode.localeCompare(b.kode));
      setAccounts(data);
      console.log('Loaded accounts:', data.length);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data akun",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = [...accounts];

    if (selectedType !== "ALL") {
      filtered = filtered.filter(acc => acc.jenis === selectedType);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(acc => 
        acc.nama.toLowerCase().includes(query) ||
        acc.kode.toLowerCase().includes(query) ||
        acc.kategori.toLowerCase().includes(query)
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    try {
      const newAccount = await createChartOfAccount(data);
      await loadAccounts();
      toast({
        title: "Berhasil",
        description: "Akun berhasil dibuat",
      });
      setIsFormOpen(false);
      console.log('Created account:', newAccount);
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat akun",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedAccount) return;
    
    setIsLoading(true);
    try {
      const updatedAccount = await updateChartOfAccount(selectedAccount.id, data);
      await loadAccounts();
      toast({
        title: "Berhasil",
        description: "Akun berhasil diperbarui",
      });
      setSelectedAccount(null);
      setIsFormOpen(false);
      console.log('Updated account:', updatedAccount);
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui akun",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAccount) return;
    
    setIsLoading(true);
    try {
      await deleteChartOfAccount(deleteAccount.id);
      await loadAccounts();
      toast({
        title: "Berhasil",
        description: "Akun berhasil dihapus",
      });
      setDeleteAccount(null);
      console.log('Deleted account:', deleteAccount.id);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus akun",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditForm = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAccount(null);
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      'ASET': 'bg-blue-100 text-blue-800',
      'KEWAJIBAN': 'bg-red-100 text-red-800',
      'MODAL': 'bg-green-100 text-green-800',
      'PENDAPATAN': 'bg-purple-100 text-purple-800',
      'BEBAN': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const accountTypes = [
    { value: "ALL", label: "Semua Jenis" },
    { value: "ASET", label: "Aset" },
    { value: "KEWAJIBAN", label: "Kewajiban" },
    { value: "MODAL", label: "Modal" },
    { value: "PENDAPATAN", label: "Pendapatan" },
    { value: "BEBAN", label: "Beban" }
  ];

  const accountStats = {
    total: accounts.length,
    aset: accounts.filter(acc => acc.jenis === 'ASET').length,
    kewajiban: accounts.filter(acc => acc.jenis === 'KEWAJIBAN').length,
    modal: accounts.filter(acc => acc.jenis === 'MODAL').length,
    pendapatan: accounts.filter(acc => acc.jenis === 'PENDAPATAN').length,
    beban: accounts.filter(acc => acc.jenis === 'BEBAN').length,
    active: accounts.filter(acc => acc.isActive).length
  };

  if (isInitialLoading) {
    return (
      <Layout pageTitle="Chart of Accounts">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Memuat data akun...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Chart of Accounts">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/akuntansi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
              <p className="text-muted-foreground">Kelola daftar akun dan struktur chart of accounts</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAccounts} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Akun Baru
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6 mb-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Total Akun</h2>
              <p className="text-xl font-bold mt-1">{accountStats.total}</p>
              <p className="text-xs text-muted-foreground">{accountStats.active} aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Aset</h2>
              <p className="text-xl font-bold text-blue-600 mt-1">{accountStats.aset}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Kewajiban</h2>
              <p className="text-xl font-bold text-red-600 mt-1">{accountStats.kewajiban}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Modal</h2>
              <p className="text-xl font-bold text-green-600 mt-1">{accountStats.modal}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Pendapatan</h2>
              <p className="text-xl font-bold text-purple-600 mt-1">{accountStats.pendapatan}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="mt-2 font-semibold text-sm">Beban</h2>
              <p className="text-xl font-bold text-orange-600 mt-1">{accountStats.beban}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari berdasarkan nama atau kode akun..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {accountTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts List */}
        <div className="space-y-4">
          {filteredAccounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || selectedType !== "ALL" ? "Tidak ada akun yang sesuai" : "Belum ada akun"}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || selectedType !== "ALL" 
                    ? "Coba ubah filter pencarian Anda" 
                    : "Mulai dengan membuat akun pertama"}
                </p>
                {!searchTerm && selectedType === "ALL" && (
                  <Button onClick={openCreateForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Akun Baru
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAccounts.map((account) => (
              <Card key={account.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{account.kode} - {account.nama}</h3>
                        <Badge className={getAccountTypeColor(account.jenis)}>
                          {account.jenis}
                        </Badge>
                        {account.isGroup && (
                          <Badge variant="outline">Grup</Badge>
                        )}
                        <Badge variant={account.isActive ? "default" : "secondary"}>
                          {account.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Kategori: <span className="font-medium">{account.kategori}</span></p>
                        <p>Saldo Normal: <span className="font-medium">{account.saldoNormal}</span></p>
                        <p>Level: <span className="font-medium">{account.level}</span></p>
                        {account.deskripsi && (
                          <p>Deskripsi: <span className="font-medium">{account.deskripsi}</span></p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(account)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeleteAccount(account)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <COAForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={selectedAccount ? handleUpdate : handleCreate}
          initialData={selectedAccount || undefined}
          parentAccounts={accounts.filter(acc => acc.isGroup)}
          isLoading={isLoading}
        />

        <AlertDialog open={!!deleteAccount} onOpenChange={() => setDeleteAccount(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus akun "{deleteAccount?.nama}"? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
