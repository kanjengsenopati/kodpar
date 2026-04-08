
import { Download, FileText } from "lucide-react";
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
import { Clock } from "lucide-react";

interface JatuhTempoTabContentProps {
  upcomingDueLoans: {
    transaksi: any;
    jatuhTempo: string;
    daysUntilDue: number;
  }[];
  chartColors: Record<string, string>;
}

export function JatuhTempoTabContent({
  upcomingDueLoans,
  chartColors,
}: JatuhTempoTabContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Ringkasan Jatuh Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pinjaman Akan Jatuh Tempo</p>
                <p className="text-2xl font-bold text-indigo-700">{upcomingDueLoans.length} Pinjaman</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jatuh Tempo kurang dari 7 hari</span>
                  <span className="font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue <= 7).length} Pinjaman
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jatuh Tempo 8-14 hari</span>
                  <span className="font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue > 7 && loan.daysUntilDue <= 14).length} Pinjaman
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jatuh Tempo 15-30 hari</span>
                  <span className="font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue > 14).length} Pinjaman
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Nilai Pinjaman</p>
                <p className="text-xl font-bold text-indigo-700">
                  {formatCurrency(
                    upcomingDueLoans.reduce((total, loan) => total + loan.transaksi.jumlah, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Statistik Jatuh Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Segera jatuh tempo (≤ 7 hari)</span>
                  <span className="text-sm font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue <= 7).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(upcomingDueLoans.filter(loan => loan.daysUntilDue <= 7).length / Math.max(upcomingDueLoans.length, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Jatuh tempo menengah (8-14 hari)</span>
                  <span className="text-sm font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue > 7 && loan.daysUntilDue <= 14).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${(upcomingDueLoans.filter(loan => loan.daysUntilDue > 7 && loan.daysUntilDue <= 14).length / Math.max(upcomingDueLoans.length, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Jatuh tempo jauh (15-30 hari)</span>
                  <span className="text-sm font-medium">
                    {upcomingDueLoans.filter(loan => loan.daysUntilDue > 14).length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(upcomingDueLoans.filter(loan => loan.daysUntilDue > 14).length / Math.max(upcomingDueLoans.length, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Pinjaman Akan Jatuh Tempo</span>
                  <span className="text-lg font-bold text-indigo-700">
                    {formatCurrency(
                      upcomingDueLoans.reduce((total, loan) => total + loan.transaksi.jumlah, 0)
                    )}
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
            <FileText size={18} className="text-indigo-600" />
            Daftar Pinjaman Yang Akan Jatuh Tempo
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={14} /> Export
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="periodeJatuhTempo">Periode Jatuh Tempo</Label>
              <Select defaultValue="all">
                <SelectTrigger id="periodeJatuhTempo">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="week">7 Hari</SelectItem>
                  <SelectItem value="twoweek">14 Hari</SelectItem>
                  <SelectItem value="month">30 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jumlahPinjamanJT">Jumlah Pinjaman</Label>
              <Select defaultValue="all">
                <SelectTrigger id="jumlahPinjamanJT">
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
              <Label htmlFor="namaAnggotaJT">Nama Anggota</Label>
              <Input id="namaAnggotaJT" placeholder="Cari nama anggota" />
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
                  <TableHead>Sisa Hari</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingDueLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Clock className="h-8 w-8 text-gray-400" />
                        <p>Tidak ada pinjaman yang akan jatuh tempo</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcomingDueLoans.map((loan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{loan.transaksi.id}</TableCell>
                      <TableCell>{loan.transaksi.anggotaNama}</TableCell>
                      <TableCell>{formatDate(loan.transaksi.tanggal)}</TableCell>
                      <TableCell>{formatCurrency(loan.transaksi.jumlah)}</TableCell>
                      <TableCell>{formatDate(loan.jatuhTempo)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          loan.daysUntilDue <= 7 ? "bg-red-100 text-red-800" : 
                          loan.daysUntilDue <= 14 ? "bg-amber-100 text-amber-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {loan.daysUntilDue} hari
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Akan Jatuh Tempo
                        </span>
                      </TableCell>
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
