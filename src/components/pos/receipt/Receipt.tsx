
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { getProdukItemById } from "@/services/produk";
import { Penjualan } from "@/types";
import React from "react";
import { Receipt as ReceiptIcon, Check, Printer } from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";

interface ReceiptProps {
  sale: Penjualan;
  kasirName: string;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ sale, kasirName }, ref) => {
    const profilKoperasi = getPengaturan().profil || {
      namaKoperasi: "Koperasi Sejahtera",
      alamat: "Jl. Raya Utama No. 123",
      telepon: "021-1234567"
    };
    
    return (
      <div 
        ref={ref} 
        className="p-6 bg-white border rounded-lg shadow-sm max-h-[70vh] overflow-y-auto"
        style={{ fontFamily: '"Courier New", monospace' }}
      >
        {/* Receipt Header */}
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="font-bold text-xl">{profilKoperasi.namaKoperasi}</h2>
          <p className="text-sm text-muted-foreground">{profilKoperasi.alamat}</p>
          <p className="text-sm text-muted-foreground">Telp: {profilKoperasi.telepon}</p>
        </div>
        
        {/* Transaction Info */}
        <div className="border-t border-b py-3 mb-4">
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">No. Transaksi</span>
            <span className="font-medium">{sale.nomorTransaksi}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">Tanggal & Waktu</span>
            <span>{formatDateTime(sale.tanggal)}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">Kasir</span>
            <span>{kasirName}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span className="font-medium">
              {sale.metodePembayaran === "cash" ? "TUNAI" :
               sale.metodePembayaran === "debit" ? "KARTU DEBIT" :
               sale.metodePembayaran === "kredit" ? "KARTU KREDIT" : "QRIS"}
            </span>
          </div>
        </div>
        
        {/* Items */}
        <div className="mb-4">
          <div className="space-y-2">
            {sale.items.map((item, index) => {
              const product = getProdukItemById(item.produkId);
              return (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{product?.nama || "Product"}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.jumlah > 1 && `× ${item.jumlah}`}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {formatRupiah(item.total)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Summary */}
        <div className="border-t border-dashed py-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sub-Total</span>
            <span>{formatRupiah(sale.subtotal)}</span>
          </div>
          
          {sale.diskon && sale.diskon > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discounts</span>
              <span>({formatRupiah((sale.subtotal * (sale.diskon || 0)) / 100)})</span>
            </div>
          )}
          
          {/* Service Charge - Added for restaurant style */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Charge (15%)</span>
            <span>{formatRupiah((sale.subtotal * 0.15))}</span>
          </div>
          
          {/* Take Away Fee - Added for restaurant style */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Take Away Fee (5%)</span>
            <span>{formatRupiah((sale.subtotal * 0.05))}</span>
          </div>
        </div>
        
        {/* Total */}
        <div className="border-t mt-2 pt-3">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{formatRupiah(sale.total)}</span>
          </div>
          
          {sale.metodePembayaran === "cash" && (
            <>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Tunai</span>
                <span>{formatRupiah(sale.dibayar)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kembalian</span>
                <span>{formatRupiah(sale.kembalian)}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>Terima Kasih Atas Kunjungan Anda</p>
            <p className="mt-1">Selamat Menikmati</p>
          </div>
        </div>
        
        <div className="mt-5 text-center text-xs text-muted-foreground flex items-center justify-center">
          <Printer className="h-3 w-3 mr-1" />
          <span>{profilKoperasi.namaKoperasi}</span>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";
