
import React from "react";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Penjualan } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";

interface ReceiptCardProps {
  penjualan: Penjualan;
  getKasirName: (kasirId: string) => string;
  getProductName: (productId: string) => string;
}

export function ReceiptCard({ penjualan, getKasirName, getProductName }: ReceiptCardProps) {
  const profilKoperasi = getPengaturan().profil || {
    namaKoperasi: "Koperasi Sejahtera",
    alamat: "Jl. Raya Utama No. 123",
    telepon: "021-1234567"
  };
  
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" /> Struk Pembelian
        </CardTitle>
      </CardHeader>
      
      <CardContent className="border-t pt-4">
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg">{profilKoperasi.namaKoperasi}</h3>
          <p className="text-xs text-muted-foreground">{profilKoperasi.alamat}</p>
          <p className="text-xs text-muted-foreground">Telp: {profilKoperasi.telepon}</p>
        </div>
        
        <div className="flex justify-between text-xs mb-4">
          <span>{formatDateTime(penjualan.tanggal)}</span>
          <span>{penjualan.nomorTransaksi}</span>
        </div>
        
        <div className="border-t border-dashed pt-2 pb-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Kasir:</span>
            <span>{getKasirName(penjualan.kasirId)}</span>
          </div>
        </div>
        
        <div className="border-y border-dashed py-2 space-y-1 my-2">
          {penjualan.items.map((item, index) => (
            <div key={index} className="text-xs">
              <div className="flex justify-between">
                <span className="font-medium">{getProductName(item.produkId)}</span>
                <span>{formatRupiah(item.total)}</span>
              </div>
              <div className="text-muted-foreground ml-2">
                {item.jumlah} x {formatRupiah(item.hargaSatuan)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-1 py-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(penjualan.subtotal)}</span>
          </div>
          
          {penjualan.diskon > 0 && (
            <div className="flex justify-between">
              <span>Diskon ({penjualan.diskon}%)</span>
              <span>-{formatRupiah((penjualan.subtotal * penjualan.diskon) / 100)}</span>
            </div>
          )}
          
          {penjualan.pajak > 0 && (
            <div className="flex justify-between">
              <span>Pajak ({penjualan.pajak}%)</span>
              <span>{formatRupiah((penjualan.subtotal * (1 - penjualan.diskon / 100) * penjualan.pajak) / 100)}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-dashed pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{formatRupiah(penjualan.total)}</span>
          </div>
          
          {penjualan.metodePembayaran === "cash" && (
            <>
              <div className="flex justify-between text-xs mt-1">
                <span>Tunai</span>
                <span>{formatRupiah(penjualan.dibayar)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Kembalian</span>
                <span>{formatRupiah(penjualan.kembalian)}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 text-center space-y-1">
          <div className="text-xs">
            <span>Metode Pembayaran: </span>
            <span className="font-medium">
              {penjualan.metodePembayaran === "cash" ? "TUNAI" :
               penjualan.metodePembayaran === "debit" ? "KARTU DEBIT" :
               penjualan.metodePembayaran === "kredit" ? "KARTU KREDIT" : "QRIS"}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground pt-4">
            Terima kasih atas kunjungan Anda
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
