
import React from "react";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Pencil, Printer, Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Penjualan } from "@/types";

interface TransactionInfoCardProps {
  penjualan: Penjualan;
  getKasirName: (kasirId: string) => string;
  onEditClick: () => void;
  onPrintReceipt: () => void;
  onStatusClick: () => void;
}

export function TransactionInfoCard({
  penjualan,
  getKasirName,
  onEditClick,
  onPrintReceipt,
  onStatusClick,
}: TransactionInfoCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informasi Transaksi</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onEditClick}
          >
            <Pencil size={14} /> Edit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onPrintReceipt}
          >
            <Printer size={14} /> Cetak
          </Button>
          
          {penjualan.status === "sukses" ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={onStatusClick}
            >
              <Ban size={14} /> Batalkan
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={onStatusClick}
            >
              <Check size={14} /> Tandai Sukses
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Informasi Umum</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nomor Transaksi</span>
                <span className="text-sm font-medium">{penjualan.nomorTransaksi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tanggal & Waktu</span>
                <span className="text-sm">{formatDateTime(penjualan.tanggal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kasir</span>
                <span className="text-sm">{getKasirName(penjualan.kasirId)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  penjualan.status === "sukses" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Informasi Pembayaran</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                <span className="text-sm">
                  {penjualan.metodePembayaran === "cash" ? "Tunai" :
                   penjualan.metodePembayaran === "debit" ? "Debit" :
                   penjualan.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm">{formatRupiah(penjualan.subtotal)}</span>
              </div>
              {penjualan.diskon > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Diskon ({penjualan.diskon}%)</span>
                  <span className="text-sm text-destructive">-{formatRupiah((penjualan.subtotal * penjualan.diskon) / 100)}</span>
                </div>
              )}
              {penjualan.pajak > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pajak ({penjualan.pajak}%)</span>
                  <span className="text-sm">{formatRupiah((penjualan.subtotal * (1 - penjualan.diskon / 100) * penjualan.pajak) / 100)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">{formatRupiah(penjualan.total)}</span>
              </div>
              
              {penjualan.metodePembayaran === "cash" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dibayar</span>
                    <span className="text-sm">{formatRupiah(penjualan.dibayar)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kembalian</span>
                    <span className="text-sm">{formatRupiah(penjualan.kembalian)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {penjualan.catatan && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Catatan</h3>
            <p className="text-sm p-3 bg-muted rounded-md">{penjualan.catatan}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
