
import React, { forwardRef } from "react";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { getAnggotaById } from "@/services/anggotaService";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import { Transaksi } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";

interface TransaksiReceiptProps {
  transaksi: Transaksi;
  remainingAmount?: number;
}

export const TransaksiReceipt = forwardRef<HTMLDivElement, TransaksiReceiptProps>(
  ({ transaksi, remainingAmount }, ref) => {
    const anggota = getAnggotaById(transaksi.anggotaId);
    const profilKoperasi = getPengaturan().profil || {
      namaKoperasi: "Koperasi Sejahtera",
      alamat: "Jl. Raya Utama No. 123",
      telepon: "021-1234567"
    };
    
    // Helper to get transaction type in Indonesian
    const getJenisTransaksi = (jenis: string) => {
      switch (jenis) {
        case "Simpan": return "Simpanan";
        case "Pinjam": return "Pinjaman";
        case "Angsuran": return "Pembayaran Angsuran";
        default: return jenis;
      }
    };
    
    // Format date in Indonesian format
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    };
    
    // Extract related info from keterangan if available
    const extractInfoFromKeterangan = () => {
      if (!transaksi.keterangan) return {};
      
      const info: Record<string, string | number | null> = {};
      
      // Extract tenor and angsuran if pinjaman
      if (transaksi.jenis === "Pinjam") {
        const tenorMatch = transaksi.keterangan.match(/Tenor: (\d+) bulan/);
        const bungaMatch = transaksi.keterangan.match(/Bunga: ([0-9.]+)%/);
        
        if (tenorMatch && tenorMatch[1]) info.tenor = parseInt(tenorMatch[1]);
        if (bungaMatch && bungaMatch[1]) info.bunga = parseFloat(bungaMatch[1]);
      }
      
      // Extract angsuran ke- if angsuran
      if (transaksi.jenis === "Angsuran") {
        const angsuranKeMatch = transaksi.keterangan.match(/Angsuran ke-(\d+)/);
        const pinjamanIdMatch = transaksi.keterangan.match(/pinjaman #(TR\d+)/);
        
        if (angsuranKeMatch && angsuranKeMatch[1]) info.angsuranKe = parseInt(angsuranKeMatch[1]);
        if (pinjamanIdMatch && pinjamanIdMatch[1]) info.pinjamanId = pinjamanIdMatch[1];
      }
      
      return info;
    };
    
    const additionalInfo = extractInfoFromKeterangan();
    
    return (
      <div 
        ref={ref}
        className="p-6 bg-white border rounded-lg shadow-sm max-w-[800px] mx-auto"
        style={{ fontFamily: '"Courier New", monospace' }}
      >
        {/* Receipt Header */}
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="font-bold text-xl">{profilKoperasi.namaKoperasi}</h2>
          <p className="text-sm text-muted-foreground">{profilKoperasi.alamat}</p>
          <p className="text-sm text-muted-foreground">Telp: {profilKoperasi.telepon}</p>
        </div>
        
        {/* Receipt Title */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold uppercase">
            Bukti {getJenisTransaksi(transaksi.jenis)}
          </h3>
          <p className="text-sm text-muted-foreground">#{transaksi.id}</p>
        </div>
        
        {/* Transaction Info */}
        <div className="border-t border-b py-3 mb-4">
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">Tanggal</span>
            <span>{formatDate(transaksi.tanggal)}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">Status</span>
            <span className={
              transaksi.status === "Sukses" ? "text-green-600 font-medium" :
              transaksi.status === "Pending" ? "text-amber-600 font-medium" :
              "text-red-600 font-medium"
            }>
              {transaksi.status}
            </span>
          </div>
        </div>
        
        {/* Member Info */}
        {anggota && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Informasi Anggota</h4>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-medium">{anggota.nama}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">ID Anggota</span>
                <span>{anggota.id}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction Amount */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Detail Transaksi</h4>
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">Jenis Transaksi</span>
              <span>{getJenisTransaksi(transaksi.jenis)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">Jumlah</span>
              <span className="font-medium">{formatRupiah(transaksi.jumlah)}</span>
            </div>
            
            {/* Additional info based on transaction type */}
            {transaksi.jenis === "Pinjam" && additionalInfo.tenor && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Tenor</span>
                <span>{additionalInfo.tenor} bulan</span>
              </div>
            )}
            
            {transaksi.jenis === "Pinjam" && additionalInfo.bunga && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Bunga</span>
                <span>{additionalInfo.bunga}%</span>
              </div>
            )}
            
            {transaksi.jenis === "Angsuran" && additionalInfo.angsuranKe && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Angsuran Ke</span>
                <span>{additionalInfo.angsuranKe}</span>
              </div>
            )}
            
            {transaksi.jenis === "Angsuran" && additionalInfo.pinjamanId && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">ID Pinjaman</span>
                <span>{additionalInfo.pinjamanId}</span>
              </div>
            )}
            
            {transaksi.jenis === "Angsuran" && remainingAmount !== undefined && (
              <div className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">Sisa Pinjaman</span>
                <span>{formatRupiah(remainingAmount)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        {transaksi.keterangan && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Keterangan</h4>
            <div className="bg-muted/30 p-3 rounded-md text-sm">
              {transaksi.keterangan}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Dicetak pada: {formatDateTime(new Date().toISOString())}
          </p>
          <div className="text-xs text-muted-foreground mt-2">
            <p>Terima Kasih Atas Kepercayaan Anda</p>
            <p className="mt-1">Dokumen ini merupakan bukti transaksi yang sah</p>
          </div>
        </div>
      </div>
    );
  }
);

TransaksiReceipt.displayName = "TransaksiReceipt";
