
import { Anggota } from "@/types";
import { formatCurrency, formatDate, formatNumber } from "@/utils/formatters";
import { ChartLine, ChartPie, Download, FileText, User } from "lucide-react";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Define chart data interface for better type checking
interface ChartDataItem {
  name: string;
  anggota: number;
  [key: string]: number | string;
}

interface AnggotaTabContentProps {
  anggotaList: Anggota[];
  chartData: {
    anggota: ChartDataItem[];
  };
  totalAnggota: number;
  chartColors: {
    anggota: string;
  };
}

export function AnggotaTabContent({
  anggotaList,
  chartData,
  totalAnggota,
  chartColors,
}: AnggotaTabContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartLine size={18} className="text-purple-500" />
              Grafik Pertumbuhan Anggota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.anggota}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${value} anggota`,
                      "Jumlah Anggota"
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="anggota" 
                    name="Jumlah Anggota" 
                    stroke={chartColors.anggota} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ChartPie size={18} className="text-purple-500" />
              Komposisi Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Laki-laki", value: 75 },
                      { name: "Perempuan", value: 45 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} anggota`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 mt-4 w-full">
              <div>
                <p className="text-sm text-muted-foreground">Total Anggota</p>
                <p className="text-2xl font-bold text-purple-700">{totalAnggota} Anggota</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-[#8B5CF6] mr-2 rounded-sm"></div>
                    Laki-laki
                  </span>
                  <span className="font-medium">75 (62.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center">
                    <div className="w-3 h-3 bg-[#EC4899] mr-2 rounded-sm"></div>
                    Perempuan
                  </span>
                  <span className="font-medium">45 (37.5%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText size={18} className="text-purple-500" />
            Laporan Anggota
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="periodeAnggota">Status Anggota</Label>
              <Select defaultValue="all">
                <SelectTrigger id="periodeAnggota">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jenisKelamin">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unitKerja">Unit Kerja</Label>
              <Select defaultValue="all">
                <SelectTrigger id="unitKerja">
                  <SelectValue placeholder="Pilih unit kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="sdn">SD Negeri</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="smp">SMP</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Unit Kerja</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead>Total Simpanan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anggotaList.slice(0, 5).map((anggota) => (
                  <TableRow key={anggota.id}>
                    <TableCell>{anggota.id}</TableCell>
                    <TableCell>{anggota.nama}</TableCell>
                    <TableCell>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                    <TableCell>{anggota.unitKerja || "-"}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell>{anggota.tanggalBergabung ? formatDate(anggota.tanggalBergabung) : "-"}</TableCell>
                    <TableCell>{formatCurrency(750000)}</TableCell>
                  </TableRow>
                ))}
                {anggotaList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Tidak ada data anggota yang ditemukan
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
