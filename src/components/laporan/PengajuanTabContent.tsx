
import { Pengajuan } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getPengajuanByStatus } from "@/services/pengajuanService";
import { ChartPie, Download, FileCheck, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PengajuanTabContentProps {
  pengajuanList: Pengajuan[];
  chartData: {
    pengajuan: Array<{
      name: string;
      value: number;
    }>;
  };
  pieColors: string[];
}

export function PengajuanTabContent({
  pengajuanList,
  chartData,
  pieColors,
}: PengajuanTabContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartPie size={18} className="text-purple-600" />
              Distribusi Pengajuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pengajuan}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.pengajuan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-600" />
              Ringkasan Pengajuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengajuan</p>
                <p className="text-2xl font-bold text-purple-700">{pengajuanList.length} Pengajuan</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-amber-500 mr-2 rounded-sm"></div>
                    Menunggu
                  </span>
                  <span className="font-medium">{getPengajuanByStatus("Menunggu").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-2 rounded-sm"></div>
                    Disetujui
                  </span>
                  <span className="font-medium">{getPengajuanByStatus("Disetujui").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></div>
                    Ditolak
                  </span>
                  <span className="font-medium">{getPengajuanByStatus("Ditolak").length}</span>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-2 rounded-sm"></div>
                    Simpanan
                  </span>
                  <span className="font-medium">{pengajuanList.filter(p => p.jenis === "Simpan").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-amber-500 mr-2 rounded-sm"></div>
                    Pinjaman
                  </span>
                  <span className="font-medium">{pengajuanList.filter(p => p.jenis === "Pinjam").length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText size={18} className="text-purple-600" />
            Laporan Pengajuan
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="jenisPengajuan">Jenis Pengajuan</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jenisPengajuan">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="Simpan">Simpanan</SelectItem>
                  <SelectItem value="Pinjam">Pinjaman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusPengajuan">Status Pengajuan</Label>
              <Select defaultValue="all">
                <SelectTrigger id="statusPengajuan">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Disetujui">Disetujui</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="namaPengaju">Nama Anggota</Label>
              <Input id="namaPengaju" placeholder="Cari nama anggota" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pengajuanList.slice(0, 5).map((pengajuan) => (
                  <TableRow key={pengajuan.id}>
                    <TableCell>{pengajuan.id}</TableCell>
                    <TableCell>{formatDate(pengajuan.tanggal)}</TableCell>
                    <TableCell>{pengajuan.anggotaNama}</TableCell>
                    <TableCell>{pengajuan.jenis}</TableCell>
                    <TableCell>{formatCurrency(pengajuan.jumlah)}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                        pengajuan.status === "Ditolak" ? "bg-red-100 text-red-800" : 
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {pengajuan.status}
                      </span>
                    </TableCell>
                    <TableCell>{pengajuan.keterangan?.substring(0, 30) || "-"}</TableCell>
                  </TableRow>
                ))}
                {pengajuanList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Tidak ada data pengajuan yang ditemukan
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
