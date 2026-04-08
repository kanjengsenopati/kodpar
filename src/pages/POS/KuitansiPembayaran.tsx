import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Receipt, Search, Printer, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Penjualan } from "@/types";
import { getAllPenjualan, initSamplePenjualanData } from "@/services/penjualan";
import { initSampleProdukData } from "@/services/produk";
import { initSampleKasirData, getKasirById } from "@/services/kasirService";
import { formatRupiah } from "@/lib/utils";

export default function KuitansiPembayaran() {
  const { toast } = useToast();
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPenjualan, setFilteredPenjualan] = useState<Penjualan[]>([]);
  const [selectedPenjualan, setSelectedPenjualan] = useState<Penjualan | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Load penjualan on component mount
  useEffect(() => {
    // Initialize all sample data
    initSampleProdukData();
    initSampleKasirData();
    initSamplePenjualanData();
    
    loadPenjualan();
  }, []);

  // Filter penjualan when search query or penjualan list changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPenjualan(penjualanList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = penjualanList.filter(
        (item) =>
          item.nomorTransaksi.toLowerCase().includes(query) ||
          item.tanggal.includes(query)
      );
      setFilteredPenjualan(filtered);
    }
  }, [searchQuery, penjualanList]);

  const loadPenjualan = () => {
    // Only get successful sales
    const allPenjualan = getAllPenjualan().filter(item => item.status === "sukses");
    // Sort by date descending (newest first)
    const sorted = [...allPenjualan].sort((a, b) => 
      new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    setPenjualanList(sorted);
    setFilteredPenjualan(sorted);
  };

  // Helper function to get cashier name
  const getKasirName = (kasirId: string): string => {
    const kasir = getKasirById(kasirId);
    return kasir ? kasir.nama : "Unknown";
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Select a sale to display receipt
  const handleSelectPenjualan = (penjualan: Penjualan) => {
    setSelectedPenjualan(penjualan);
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      cash: "Tunai",
      debit: "Kartu Debit",
      kredit: "Kartu Kredit",
      qris: "QRIS"
    };
    return methodMap[method] || method;
  };
  
  // Format date for display
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Print receipt
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = `
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { font-family: 'Courier New', monospace; font-size: 12px; }
          .receipt-header { text-align: center; margin-bottom: 10px; }
          .receipt-title { font-size: 16px; font-weight: bold; }
          .receipt-info { margin: 10px 0; }
          .receipt-table { width: 100%; border-collapse: collapse; }
          .receipt-table th, .receipt-table td { text-align: left; padding: 2px 0; }
          .receipt-total { margin: 10px 0; font-weight: bold; }
          .receipt-footer { text-align: center; margin-top: 20px; font-size: 10px; }
        </style>
        <div class="receipt-container">
          ${printContents}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  // Download receipt as PDF (simplified implementation)
  const handleDownload = () => {
    toast({
      title: "Informasi",
      description: "Fitur download PDF akan segera tersedia",
    });
  };

  return (
    <Layout pageTitle="Kuitansi Pembayaran">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Kuitansi Pembayaran</h2>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  <CardTitle>Daftar Transaksi</CardTitle>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nomor transaksi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {penjualanList.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Belum ada data transaksi penjualan.
                  </AlertDescription>
                </Alert>
              ) : filteredPenjualan.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Tidak ada transaksi yang cocok dengan pencarian Anda.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nomor</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kasir</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPenjualan.map((penjualan) => (
                      <TableRow 
                        key={penjualan.id}
                        className={selectedPenjualan?.id === penjualan.id ? "bg-muted" : ""}
                      >
                        <TableCell className="font-medium">{penjualan.nomorTransaksi}</TableCell>
                        <TableCell>{formatDate(penjualan.tanggal)}</TableCell>
                        <TableCell>{getKasirName(penjualan.kasirId)}</TableCell>
                        <TableCell>{formatRupiah(penjualan.total)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectPenjualan(penjualan)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> Pilih
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <CardTitle>Struk Pembayaran</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPenjualan ? (
                <div ref={receiptRef} className="p-4 bg-white rounded-md border border-gray-200">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold">KOPERASI NASIONAL INDONESIA</h2>
                    <p className="text-sm">Jl. Pahlawan No. 123, Jakarta Pusat</p>
                    <p className="text-sm">Telp: (021) 123-4567</p>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm">
                      <span>No. Transaksi:</span>
                      <span className="font-semibold">{selectedPenjualan.nomorTransaksi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tanggal:</span>
                      <span>{formatDate(selectedPenjualan.tanggal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kasir:</span>
                      <span>{getKasirName(selectedPenjualan.kasirId)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-semibold">Item</th>
                        <th className="text-right font-semibold">Qty</th>
                        <th className="text-right font-semibold">Harga</th>
                        <th className="text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPenjualan.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-1">{item.produkId.substring(0, 20)}</td>
                          <td className="py-1 text-right">{item.jumlah}</td>
                          <td className="py-1 text-right">{formatRupiah(item.hargaSatuan)}</td>
                          <td className="py-1 text-right">{formatRupiah(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatRupiah(selectedPenjualan.subtotal)}</span>
                    </div>
                    
                    {selectedPenjualan.diskon && selectedPenjualan.diskon > 0 && (
                      <div className="flex justify-between">
                        <span>Diskon ({selectedPenjualan.diskon}%):</span>
                        <span>-{formatRupiah((selectedPenjualan.subtotal * selectedPenjualan.diskon) / 100)}</span>
                      </div>
                    )}
                    
                    {selectedPenjualan.pajak && selectedPenjualan.pajak > 0 && (
                      <div className="flex justify-between">
                        <span>Pajak ({selectedPenjualan.pajak}%):</span>
                        <span>{formatRupiah((selectedPenjualan.subtotal * (1 - (selectedPenjualan.diskon || 0) / 100) * selectedPenjualan.pajak) / 100)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold">
                      <span>TOTAL:</span>
                      <span>{formatRupiah(selectedPenjualan.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Dibayar:</span>
                      <span>{formatRupiah(selectedPenjualan.dibayar)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Kembali:</span>
                      <span>{formatRupiah(selectedPenjualan.kembalian)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Metode Pembayaran:</span>
                      <span>{formatPaymentMethod(selectedPenjualan.metodePembayaran)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-sm">
                    <p>Terima Kasih Atas Kunjungan Anda</p>
                    <p className="text-xs mt-1">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Pilih transaksi dari daftar untuk melihat struk.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            {selectedPenjualan && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Cetak Struk
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
