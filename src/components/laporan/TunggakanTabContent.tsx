
import { AlertTriangle, Download, FileText } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/utils/formatters";

interface TunggakanTabContentProps {
  overdueLoans: {
    transaksi: any;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[];
  chartColors: Record<string, string>;
}

export function TunggakanTabContent({
  overdueLoans,
  chartColors,
}: TunggakanTabContentProps) {
  const totalPenalty = overdueLoans.reduce((total, loan) => total + loan.penalty, 0);
  const totalOverdueAmount = overdueLoans.reduce((total, loan) => total + loan.transaksi.jumlah, 0);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" />
              Ringkasan Tunggakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pinjaman Menunggak</p>
                <p className="text-2xl font-bold text-red-700">{overdueLoans.length} Pinjaman</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tunggakan 1-7 hari</span>
                  <span className="font-medium">
                    {overdueLoans.filter(loan => loan.daysOverdue <= 7).length} Pinjaman
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tunggakan 8-30 hari</span>
                  <span className="font-medium">
                    {overdueLoans.filter(loan => loan.daysOverdue > 7 && loan.daysOverdue <= 30).length} Pinjaman
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tunggakan lebih dari 30 hari</span>
                  <span className="font-medium">
                    {overdueLoans.filter(loan => loan.daysOverdue > 30).length} Pinjaman
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Nilai Tunggakan</p>
                <p className="text-xl font-bold text-red-700">
                  {formatCurrency(totalOverdueAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" />
              Statistik Denda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Denda ringan (1-7 hari)</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      overdueLoans
                        .filter(loan => loan.daysOverdue <= 7)
                        .reduce((total, loan) => total + loan.penalty, 0)
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${(overdueLoans.filter(loan => loan.daysOverdue <= 7).reduce((total, loan) => total + loan.penalty, 0) / Math.max(totalPenalty, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Denda sedang (8-30 hari)</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      overdueLoans
                        .filter(loan => loan.daysOverdue > 7 && loan.daysOverdue <= 30)
                        .reduce((total, loan) => total + loan.penalty, 0)
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{
                      width: `${(overdueLoans.filter(loan => loan.daysOverdue > 7 && loan.daysOverdue <= 30).reduce((total, loan) => total + loan.penalty, 0) / Math.max(totalPenalty, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Denda berat (lebih dari 30 hari)</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      overdueLoans
                        .filter(loan => loan.daysOverdue > 30)
                        .reduce((total, loan) => total + loan.penalty, 0)
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(overdueLoans.filter(loan => loan.daysOverdue > 30).reduce((total, loan) => total + loan.penalty, 0) / Math.max(totalPenalty, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Denda Tunggakan</span>
                  <span className="text-lg font-bold text-red-700">
                    {formatCurrency(totalPenalty)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText size={18} className="text-red-600" />
            Daftar Pinjaman Menunggak
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="periodeTunggakan">Periode Tunggakan</Label>
              <Select defaultValue="all">
                <SelectTrigger id="periodeTunggakan">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="week">1-7 Hari</SelectItem>
                  <SelectItem value="month">8-30 Hari</SelectItem>
                  <SelectItem value="overmonth">Lebih dari 30 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jumlahPinjamanT">Jumlah Pinjaman</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jumlahPinjamanT">
                  <SelectValue placeholder="Rentang jumlah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jumlah</SelectItem>
                  <SelectItem value="small">Kurang dari 5 juta</SelectItem>
                  <SelectItem value="medium">5 - 20 juta</SelectItem>
                  <SelectItem value="large">Lebih dari 20 juta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="namaAnggotaT">Nama Anggota</Label>
              <Input id="namaAnggotaT" placeholder="Cari nama anggota" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pinjaman</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Tanggal Pinjam</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Keterlambatan</TableHead>
                  <TableHead>Denda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                        <p>Tidak ada pinjaman yang menunggak</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  overdueLoans.map((loan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{loan.transaksi.id}</TableCell>
                      <TableCell>{loan.transaksi.anggotaNama}</TableCell>
                      <TableCell>{formatDate(loan.transaksi.tanggal)}</TableCell>
                      <TableCell>{formatCurrency(loan.transaksi.jumlah)}</TableCell>
                      <TableCell>{formatDate(loan.jatuhTempo)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          loan.daysOverdue > 30 ? "bg-red-100 text-red-800" : 
                          loan.daysOverdue > 7 ? "bg-orange-100 text-orange-800" : 
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {loan.daysOverdue} hari
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(loan.penalty)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
