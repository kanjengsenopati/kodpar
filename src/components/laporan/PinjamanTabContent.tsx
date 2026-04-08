import { ChartBar, Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Transaksi } from "@/types";
import { useEffect, useState } from "react";
import { JenisPinjaman } from "@/types/jenis";
import { getJenisByType } from "@/services/jenisService";
import { calculateSpecificLoanRemainingBalance } from "@/services/financialCalculations";

// Define chart data interface for better type checking
interface ChartDataItem {
  name: string;
  pinjaman: number;
  [key: string]: number | string;
}

interface PinjamanTabContentProps {
  transaksiList: Transaksi[];
  totalPinjaman: number;
  chartData: {
    pinjaman: ChartDataItem[];
  };
  chartColors: Record<string, string>;
  filterDateStart: Date;
  filterDateEnd: Date;
}

export function PinjamanTabContent({
  transaksiList,
  totalPinjaman,
  chartData,
  chartColors,
  filterDateStart,
  filterDateEnd,
}: PinjamanTabContentProps) {
  // Filter only pinjaman transactions
  const pinjamanTransaksi = transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  const [jenisPinjaman, setJenisPinjaman] = useState<JenisPinjaman[]>([]);
  const [selectedJenis, setSelectedJenis] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAmount, setSelectedAmount] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTransaksi, setFilteredTransaksi] = useState<Transaksi[]>(pinjamanTransaksi);

  useEffect(() => {
    // Load jenis pinjaman data
    const loadedJenis = getJenisByType("Pinjaman") as JenisPinjaman[];
    setJenisPinjaman(loadedJenis);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...pinjamanTransaksi];
    
    // Filter by jenis
    if (selectedJenis !== "all") {
      filtered = filtered.filter(t => t.kategori === selectedJenis);
    }
    
    // Filter by amount range
    if (selectedAmount !== "all") {
      switch (selectedAmount) {
        case "small":
          filtered = filtered.filter(t => t.jumlah < 5000000);
          break;
        case "medium":
          filtered = filtered.filter(t => t.jumlah >= 5000000 && t.jumlah <= 20000000);
          break;
        case "large":
          filtered = filtered.filter(t => t.jumlah > 20000000);
          break;
      }
    }
    
    // Filter by search query (anggota name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.anggotaNama.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransaksi(filtered);
  }, [selectedJenis, selectedAmount, searchQuery, pinjamanTransaksi]);

  // Helper function to extract loan type from transaction
  const getLoanType = (transaksi: Transaksi): string => {
    if (transaksi.kategori) return transaksi.kategori;
    
    if (transaksi.keterangan) {
      if (transaksi.keterangan.includes("Reguler")) return "Pinjaman Reguler";
      if (transaksi.keterangan.includes("Usaha")) return "Modal Usaha";
      if (transaksi.keterangan.includes("Pendidikan")) return "Pinjaman Pendidikan";
      if (transaksi.keterangan.includes("Konsumtif")) return "Pinjaman Konsumtif";
    }
    
    return "Pinjaman Umum";
  };

  // FIXED: Use centralized accurate remaining loan calculation
  const calculateAccurateSisaPinjaman = (transaksi: Transaksi): number => {
    return calculateSpecificLoanRemainingBalance(transaksi.id);
  };

  // Calculate totals by jenis pinjaman
  const calculateTotalsByJenis = () => {
    const totals: Record<string, number> = {};
    
    // Initialize with 0 for all jenis
    jenisPinjaman.forEach(jenis => {
      totals[jenis.nama] = 0;
    });
    
    // Sum up transactions by kategori
    pinjamanTransaksi.forEach(transaksi => {
      if (transaksi.kategori) {
        totals[transaksi.kategori] = (totals[transaksi.kategori] || 0) + transaksi.jumlah;
      } else {
        const loanType = getLoanType(transaksi);
        totals[loanType] = (totals[loanType] || 0) + transaksi.jumlah;
      }
    });
    
    return totals;
  };
  
  const totalsByJenis = calculateTotalsByJenis();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartBar size={18} className="text-amber-600" />
              Grafik Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.pinjaman}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="pinjaman" name="Pinjaman" fill={chartColors.pinjaman} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-600" />
              Ringkasan Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pinjaman</p>
                <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalPinjaman)}</p>
              </div>
              
              <div className="space-y-2">
                {Object.entries(totalsByJenis)
                  .filter(([_, value]) => value > 0)
                  .map(([jenis, total]) => (
                    <div key={jenis} className="flex justify-between items-center">
                      <span className="text-sm">{jenis}</span>
                      <span className="font-medium">{formatCurrency(total)}</span>
                    </div>
                  ))
                }
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Peminjam</p>
                <p className="text-xl font-bold text-amber-700">
                  {pinjamanTransaksi.reduce((acc, curr) => {
                    if (!acc.includes(curr.anggotaId)) {
                      acc.push(curr.anggotaId);
                    }
                    return acc;
                  }, [] as string[]).length} Anggota
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText size={18} className="text-amber-600" />
            Laporan Pinjaman
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="statusPinjaman">Status Pinjaman</Label>
              <Select 
                defaultValue="all" 
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger id="statusPinjaman">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jumlahPinjaman">Jumlah Pinjaman</Label>
              <Select 
                defaultValue="all" 
                value={selectedAmount}
                onValueChange={setSelectedAmount}
              >
                <SelectTrigger id="jumlahPinjaman">
                  <SelectValue placeholder="Rentang jumlah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jumlah</SelectItem>
                  <SelectItem value="small">{"< 5 juta"}</SelectItem>
                  <SelectItem value="medium">5 - 20 juta</SelectItem>
                  <SelectItem value="large">{"> 20 juta"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jenisPinjaman">Jenis Pinjaman</Label>
              <Select 
                defaultValue="all"
                value={selectedJenis}
                onValueChange={setSelectedJenis}
              >
                <SelectTrigger id="jenisPinjaman">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {jenisPinjaman.map(jenis => (
                    <SelectItem key={jenis.id} value={jenis.nama}>
                      {jenis.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="namaPeminjam">Nama Anggota</Label>
              <Input 
                id="namaPeminjam" 
                placeholder="Cari nama anggota" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tenor</TableHead>
                  <TableHead>Jenis Pinjaman</TableHead>
                  <TableHead>Sisa Pinjaman</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransaksi.slice(0, 5).map((transaksi) => {
                  // Extract tenor from keterangan
                  const tenorMatch = transaksi.keterangan?.match(/Tenor: (\d+) bulan/);
                  const tenor = tenorMatch ? tenorMatch[1] : "12";
                  
                  // Get loan type
                  const loanType = transaksi.kategori || getLoanType(transaksi);
                  
                  // FIXED: Use accurate centralized remaining loan calculation
                  const sisaPinjaman = calculateAccurateSisaPinjaman(transaksi);
                  
                  return (
                    <TableRow key={transaksi.id}>
                      <TableCell className="font-medium">{transaksi.id}</TableCell>
                      <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                      <TableCell>{transaksi.anggotaNama}</TableCell>
                      <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                      <TableCell>{tenor} bulan</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          {loanType}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-amber-700">
                        {formatCurrency(sisaPinjaman)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredTransaksi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Tidak ada data pinjaman yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
