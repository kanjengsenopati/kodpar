
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";
import { BukuBesar, ChartOfAccount } from "@/types/akuntansi";
import { 
  getBukuBesarByAccount, 
  getAllChartOfAccounts 
} from "@/services/akuntansi/chartOfAccountsService";

export default function BukuBesarContent() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [bukuBesar, setBukuBesar] = useState<BukuBesar | null>(null);
  const [periode, setPeriode] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load accounts
  const loadAccounts = () => {
    try {
      const allAccounts = getAllChartOfAccounts().filter(
        account => account.isActive && !account.isGroup
      );
      setAccounts(allAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast({
        title: "Gagal memuat data akun",
        description: "Terjadi kesalahan saat memuat daftar akun",
        variant: "destructive",
      });
    }
  };

  // Load buku besar for selected account
  const loadBukuBesar = () => {
    if (!selectedAccountId || !periode) return;

    setIsLoading(true);
    try {
      const data = getBukuBesarByAccount(selectedAccountId, periode);
      setBukuBesar(data);
    } catch (error) {
      console.error("Error loading buku besar:", error);
      toast({
        title: "Gagal memuat buku besar",
        description: "Terjadi kesalahan saat memuat data buku besar",
        variant: "destructive",
      });
      setBukuBesar(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate running balance
  const calculateRunningBalance = (transactions: any[]) => {
    let runningBalance = bukuBesar?.saldoAwal || 0;
    
    return transactions.map(transaction => {
      const isDebitAccount = bukuBesar?.coa.saldoNormal === 'DEBIT';
      
      if (isDebitAccount) {
        runningBalance += transaction.debit - transaction.kredit;
      } else {
        runningBalance += transaction.kredit - transaction.debit;
      }
      
      return {
        ...transaction,
        saldo: runningBalance
      };
    });
  };

  // Effects
  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadBukuBesar();
  }, [selectedAccountId, periode]);

  const transactionsWithBalance = bukuBesar ? calculateRunningBalance(bukuBesar.transaksi) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Buku Besar
          </h3>
          <p className="text-muted-foreground">
            Lihat detail transaksi per akun
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadBukuBesar} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Buku Besar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Akun</label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{account.kode}</span>
                        <span>{account.nama}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Periode</label>
              <Input 
                type="month"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      {bukuBesar && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Awal</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(bukuBesar.saldoAwal)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Debit</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(bukuBesar.totalDebit)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Kredit</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(bukuBesar.totalKredit)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Akhir</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(bukuBesar.saldoAkhir)}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Details */}
      {bukuBesar && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <span>{bukuBesar.coa.nama}</span>
                <Badge variant="outline" className="ml-2">
                  {bukuBesar.coa.kode}
                </Badge>
              </div>
              <Badge variant={bukuBesar.coa.saldoNormal === 'DEBIT' ? 'default' : 'secondary'}>
                Saldo Normal: {bukuBesar.coa.saldoNormal}
              </Badge>
            </CardTitle>
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
                      <TableHead>Tanggal</TableHead>
                      <TableHead>No. Jurnal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Kredit</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Opening balance row */}
                    {bukuBesar.saldoAwal !== 0 && (
                      <TableRow className="bg-muted/50">
                        <TableCell>{formatDate(periode + '-01')}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="font-medium">Saldo Awal</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(bukuBesar.saldoAwal)}
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {transactionsWithBalance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Tidak ada transaksi untuk periode ini
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactionsWithBalance.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(transaction.tanggal)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.nomorJurnal}
                          </TableCell>
                          <TableCell>{transaction.keterangan}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {transaction.kredit > 0 ? formatCurrency(transaction.kredit) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(transaction.saldo)}
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
      )}

      {/* Empty state */}
      {!selectedAccountId && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pilih Akun</h3>
              <p className="text-muted-foreground">
                Pilih akun dari dropdown di atas untuk melihat buku besar
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
