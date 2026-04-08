
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { getJenisOptions } from "@/services/jenisService";

interface SimpananTransactionTableProps {
  transaksi: Transaksi[];
}

export function SimpananTransactionTable({ transaksi }: SimpananTransactionTableProps) {
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  
  // Get available simpanan categories
  const simpananCategories = getJenisOptions("Simpanan");
  
  // Filter transactions based on selected kategori
  const filteredTransaksi = useMemo(() => {
    if (selectedKategori === "all") {
      return transaksi;
    }
    return transaksi.filter(t => t.kategori === selectedKategori);
  }, [transaksi, selectedKategori]);
  
  // Calculate totals by category
  const totalsById = useMemo(() => {
    const totals: { [key: string]: { simpan: number; penarikan: number; net: number } } = {};
    
    // Initialize with all categories
    simpananCategories.forEach(kategori => {
      totals[kategori.nama] = { simpan: 0, penarikan: 0, net: 0 };
    });
    
    // Calculate totals
    transaksi.forEach(t => {
      const kategori = t.kategori || "Umum";
      if (!totals[kategori]) {
        totals[kategori] = { simpan: 0, penarikan: 0, net: 0 };
      }
      
      if (t.jenis === "Simpan") {
        totals[kategori].simpan += t.jumlah;
        totals[kategori].net += t.jumlah;
      } else if (t.jenis === "Penarikan") {
        totals[kategori].penarikan += t.jumlah;
        totals[kategori].net -= t.jumlah;
      }
    });
    
    return totals;
  }, [transaksi, simpananCategories]);
  
  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    let totalSimpan = 0;
    let totalPenarikan = 0;
    
    filteredTransaksi.forEach(t => {
      if (t.jenis === "Simpan") {
        totalSimpan += t.jumlah;
      } else if (t.jenis === "Penarikan") {
        totalPenarikan += t.jumlah;
      }
    });
    
    return {
      simpan: totalSimpan,
      penarikan: totalPenarikan,
      net: totalSimpan - totalPenarikan
    };
  }, [filteredTransaksi]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="kategoriFilter">Filter Kategori Simpanan</Label>
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger id="kategoriFilter">
              <SelectValue placeholder="Pilih kategori simpanan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {simpananCategories.map((kategori) => (
                <SelectItem key={kategori.id} value={kategori.nama}>
                  {kategori.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Simpanan</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(filteredTotals.simpan)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Penarikan</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(filteredTotals.penarikan)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Saldo Bersih</p>
              <p className={`text-lg font-bold ${filteredTotals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(filteredTotals.net)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Category (when showing all) */}
      {selectedKategori === "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Breakdown per Kategori Simpanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(totalsById).map(([kategori, totals]) => (
                <div key={kategori} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{kategori}</span>
                  <div className="text-right">
                    <div className="text-sm text-green-600">+{formatCurrency(totals.simpan)}</div>
                    <div className="text-sm text-red-600">-{formatCurrency(totals.penarikan)}</div>
                    <div className={`font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totals.net)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransaksi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      {selectedKategori === "all" 
                        ? "Tidak ada data transaksi simpanan yang ditemukan"
                        : `Tidak ada transaksi untuk kategori "${selectedKategori}"`
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransaksi.map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell className="font-medium">{tr.id}</TableCell>
                      <TableCell>{formatDate(tr.tanggal)}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          tr.jenis === "Simpan" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {tr.jenis}
                        </span>
                      </TableCell>
                      <TableCell>{tr.kategori || "Umum"}</TableCell>
                      <TableCell className={tr.jenis === "Simpan" ? "text-green-600" : "text-red-600"}>
                        {tr.jenis === "Simpan" ? "+" : "-"}{formatCurrency(tr.jumlah)}
                      </TableCell>
                      <TableCell>{tr.keterangan || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          tr.status === "Sukses" ? "bg-green-100 text-green-800" : 
                          tr.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {tr.status}
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

      {/* Dynamic Sum Summary at bottom */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">
              {selectedKategori === "all" ? "Total Keseluruhan" : `Total ${selectedKategori}`}:
            </span>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600 font-semibold">
                Simpan: {formatCurrency(filteredTotals.simpan)}
              </span>
              <span className="text-red-600 font-semibold">
                Penarikan: {formatCurrency(filteredTotals.penarikan)}
              </span>
              <span className={`font-bold ${filteredTotals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Saldo: {formatCurrency(filteredTotals.net)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
