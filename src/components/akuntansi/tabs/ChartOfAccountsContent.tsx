
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  BookOpen,
  Building,
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChartOfAccount } from "@/types/akuntansi";
import { 
  getAllChartOfAccounts, 
  deleteChartOfAccount 
} from "@/services/akuntansi/chartOfAccountsService";

export default function ChartOfAccountsContent() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<ChartOfAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<"ALL" | "ASET" | "KEWAJIBAN" | "MODAL" | "PENDAPATAN" | "BEBAN">("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Load chart of accounts
  const loadAccounts = () => {
    setIsLoading(true);
    try {
      const allAccounts = getAllChartOfAccounts();
      // Sort by account code
      allAccounts.sort((a, b) => a.kode.localeCompare(b.kode));
      setAccounts(allAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat memuat chart of accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter accounts
  const filterAccounts = () => {
    let filtered = [...accounts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account => 
        account.kode.toLowerCase().includes(query) ||
        account.nama.toLowerCase().includes(query) ||
        account.kategori.toLowerCase().includes(query)
      );
    }

    // Filter by jenis (account type)
    if (selectedJenis !== "ALL") {
      filtered = filtered.filter(account => account.jenis === selectedJenis);
    }

    setFilteredAccounts(filtered);
  };

  // Get account type icon
  const getAccountTypeIcon = (jenis: string) => {
    switch (jenis) {
      case "ASET":
        return <Building className="h-4 w-4" />;
      case "KEWAJIBAN":
        return <TrendingDown className="h-4 w-4" />;
      case "MODAL":
        return <DollarSign className="h-4 w-4" />;
      case "PENDAPATAN":
        return <TrendingUp className="h-4 w-4" />;
      case "BEBAN":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Get account type badge
  const getAccountTypeBadge = (jenis: string) => {
    const variants = {
      "ASET": "bg-blue-100 text-blue-800",
      "KEWAJIBAN": "bg-red-100 text-red-800",
      "MODAL": "bg-green-100 text-green-800",
      "PENDAPATAN": "bg-purple-100 text-purple-800",
      "BEBAN": "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={variants[jenis as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        <div className="flex items-center gap-1">
          {getAccountTypeIcon(jenis)}
          {jenis}
        </div>
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Aktif" : "Nonaktif"}
      </Badge>
    );
  };

  // Calculate summary by account type
  const calculateSummary = () => {
    const summary = filteredAccounts.reduce((acc, account) => {
      if (!acc[account.jenis]) {
        acc[account.jenis] = { count: 0, active: 0 };
      }
      acc[account.jenis].count++;
      if (account.isActive) {
        acc[account.jenis].active++;
      }
      return acc;
    }, {} as Record<string, { count: number; active: number }>);

    return summary;
  };

  // Effects
  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchQuery, selectedJenis]);

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Chart of Accounts
          </h3>
          <p className="text-muted-foreground">
            Kelola struktur akun keuangan koperasi
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAccounts} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Akun
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries({
          "ASET": { color: "blue", icon: Building },
          "KEWAJIBAN": { color: "red", icon: TrendingDown },
          "MODAL": { color: "green", icon: DollarSign },
          "PENDAPATAN": { color: "purple", icon: TrendingUp },
          "BEBAN": { color: "orange", icon: TrendingDown }
        }).map(([jenis, config]) => {
          const Icon = config.icon;
          const data = summary[jenis] || { count: 0, active: 0 };
          
          return (
            <Card key={jenis} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{jenis}</p>
                    <p className="text-2xl font-bold">{data.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.active} aktif
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${config.color}-50`}>
                    <Icon className={`h-4 w-4 text-${config.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Cari berdasarkan kode akun, nama, atau kategori..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <select 
              className="px-3 py-2 border rounded-md text-sm"
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value as any)}
            >
              <option value="ALL">Semua Jenis</option>
              <option value="ASET">Aset</option>
              <option value="KEWAJIBAN">Kewajiban</option>
              <option value="MODAL">Modal</option>
              <option value="PENDAPATAN">Pendapatan</option>
              <option value="BEBAN">Beban</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Akun</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Saldo Normal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {searchQuery || selectedJenis !== "ALL" 
                          ? "Tidak ada akun yang sesuai filter" 
                          : "Belum ada akun terdaftar"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium font-mono">
                          {account.kode}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`${account.isGroup ? 'font-semibold' : ''}`}>
                              {account.nama}
                            </span>
                            {account.isGroup && (
                              <Badge variant="outline" className="text-xs">
                                Group
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getAccountTypeBadge(account.jenis)}</TableCell>
                        <TableCell>{account.kategori}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            Level {account.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.saldoNormal === 'DEBIT' ? 'default' : 'secondary'}>
                            {account.saldoNormal}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(account.isActive)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
