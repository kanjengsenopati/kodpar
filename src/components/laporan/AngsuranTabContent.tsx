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
import { TransactionStatusBadge } from "@/components/transaksi/TransactionStatusBadge";
import { extractLoanInfo } from "@/utils/loanDataSync";

// Define chart data interface for better type checking
interface ChartDataItem {
  name: string;
  angsuran: number;
  [key: string]: number | string;
}

interface AngsuranTabContentProps {
  transaksiList: Transaksi[];
  totalAngsuran: number;
  chartData: {
    angsuran: ChartDataItem[];
  };
  chartColors: Record<string, string>;
  filterDateStart: Date;
  filterDateEnd: Date;
}

export function AngsuranTabContent({
  transaksiList,
  totalAngsuran,
  chartData,
  chartColors,
  filterDateStart,
  filterDateEnd,
}: AngsuranTabContentProps) {
  // Filter only angsuran transactions
  const angsuranTransaksi = transaksiList.filter(t => t.jenis === "Angsuran" && t.status === "Sukses");

  // Function to render enhanced installment info
  const renderInstallmentDetails = (transaksi: Transaksi) => {
    const loanMatch = transaksi.keterangan?.match(/Pinjaman: (TR\d+)/);
    const pokokMatch = transaksi.keterangan?.match(/Pokok: Rp ([\d,.]+)/);
    const jasaMatch = transaksi.keterangan?.match(/Jasa: Rp ([\d,.]+)/);
    
    return (
      <div className="text-xs text-gray-600">
        {loanMatch && <div>ID Pinjaman: {loanMatch[1]}</div>}
        {pokokMatch && <div>Pokok: Rp {pokokMatch[1]}</div>}
        {jasaMatch && <div>Jasa: Rp {jasaMatch[1]}</div>}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartBar size={18} className="text-green-600" />
              Grafik Angsuran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.angsuran}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="angsuran" name="Angsuran" fill={chartColors.angsuran} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Ringkasan Angsuran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Angsuran</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalAngsuran)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Angsuran Pokok</span>
                  <span className="font-medium">{formatCurrency(totalAngsuran * 0.8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bunga</span>
                  <span className="font-medium">{formatCurrency(totalAngsuran * 0.2)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Pembayar</p>
                <p className="text-xl font-bold text-green-700">
                  {angsuranTransaksi.reduce((acc, curr) => {
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
            <FileText size={18} className="text-green-600" />
            Laporan Angsuran
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="idPinjaman">ID Pinjaman</Label>
              <Input id="idPinjaman" placeholder="Cari ID pinjaman" />
            </div>
            <div>
              <Label htmlFor="tahunAngsuran">Tahun</Label>
              <Select defaultValue="2025">
                <SelectTrigger id="tahunAngsuran">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="namaAnggota">Nama Anggota</Label>
              <Input id="namaAnggota" placeholder="Cari nama anggota" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Detail Angsuran</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {angsuranTransaksi.slice(0, 5).map((transaksi) => (
                  <TableRow key={transaksi.id}>
                    <TableCell className="font-medium">{transaksi.id}</TableCell>
                    <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
                    <TableCell>{transaksi.anggotaNama}</TableCell>
                    <TableCell>
                      {renderInstallmentDetails(transaksi)}
                    </TableCell>
                    <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaksi.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {angsuranTransaksi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Tidak ada data angsuran yang ditemukan
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
