import React, { forwardRef } from "react";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { getAnggotaById } from "@/services/anggotaService";
import { getPengaturan, getDefaultOfficerName } from "@/services/pengaturanService";
import { Transaksi } from "@/types";
import { Separator } from "@/components/ui/separator";

interface ProfessionalLoanReceiptProps {
  transaksi: Transaksi;
  additionalCharges?: {
    danaResikoKredit?: number;
    simpananWajibKredit?: number;
  };
}

export const ProfessionalLoanReceipt = forwardRef<HTMLDivElement, ProfessionalLoanReceiptProps>(
  ({ transaksi, additionalCharges }, ref) => {
    const anggota = getAnggotaById(transaksi.anggotaId);
    const pengaturan = getPengaturan();
    const defaultOfficerName = getDefaultOfficerName();
    const profilKoperasi = pengaturan.profil || {
      namaKoperasi: "Koperasi-ERP",
      alamat: "",
      telepon: ""
    };
    
    // Extract loan details from keterangan
    const extractLoanInfo = () => {
      if (!transaksi.keterangan) return {};
      
      const tenorMatch = transaksi.keterangan.match(/Tenor: (\d+) bulan/);
      const bungaMatch = transaksi.keterangan.match(/Rate Suku Bunga: ([0-9.]+)%/);
      const angsuranMatch = transaksi.keterangan.match(/Angsuran per Bulan: Rp ([\d,.]+)/);
      const totalMatch = transaksi.keterangan.match(/Total Pengembalian: Rp ([\d,.]+)/);
      
      return {
        tenor: tenorMatch ? parseInt(tenorMatch[1]) : 12,
        bunga: bungaMatch ? parseFloat(bungaMatch[1]) : 1.5,
        angsuranPerBulan: angsuranMatch ? parseInt(angsuranMatch[1].replace(/[,.]/g, '')) : 0,
        totalPengembalian: totalMatch ? parseInt(totalMatch[1].replace(/[,.]/g, '')) : 0
      };
    };
    
    const loanInfo = extractLoanInfo();
    const currentDate = new Date();
    
    return (
      <div 
        ref={ref}
        className="p-8 bg-white shadow-lg max-w-[800px] mx-auto"
        style={{ 
          fontFamily: '"Times New Roman", serif',
          lineHeight: '1.6',
          fontSize: '14px'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {profilKoperasi.namaKoperasi.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-600">{profilKoperasi.alamat}</p>
          <p className="text-sm text-gray-600">Telp: {profilKoperasi.telepon}</p>
        </div>
        
        {/* Document Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            TANDA TERIMA PINJAMAN
          </h2>
          <p className="text-sm text-gray-600 mt-2">No. {transaksi.id}</p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Borrower Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              DATA PEMINJAM
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex mb-2">
                  <span className="w-32 text-gray-600">Nama</span>
                  <span className="w-4">:</span>
                  <span className="font-medium">{anggota?.nama || "-"}</span>
                </div>
                <div className="flex mb-2">
                  <span className="w-32 text-gray-600">No. Anggota</span>
                  <span className="w-4">:</span>
                  <span className="font-medium">{anggota?.id || "-"}</span>
                </div>
                <div className="flex mb-2">
                  <span className="w-32 text-gray-600">No. Telepon</span>
                  <span className="w-4">:</span>
                  <span className="font-medium">{anggota?.noHp || "-"}</span>
                </div>
              </div>
              <div>
                <div className="flex mb-2">
                  <span className="w-32 text-gray-600">Tanggal</span>
                  <span className="w-4">:</span>
                  <span className="font-medium">
                    {new Date(transaksi.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long", 
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex mb-2">
                  <span className="w-32 text-gray-600">Alamat</span>
                  <span className="w-4">:</span>
                  <span className="font-medium">{anggota?.alamat || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loan Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              RINCIAN PINJAMAN
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Jumlah Pinjaman</span>
                <span className="font-bold text-lg">{formatRupiah(transaksi.jumlah)}</span>
              </div>
              
              {additionalCharges?.danaResikoKredit && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Dana Resiko Kredit ({pengaturan.sukuBunga.danaResikoKredit?.persentase}%)</span>
                  <span className="font-medium">{formatRupiah(additionalCharges.danaResikoKredit)}</span>
                </div>
              )}
              
              {additionalCharges?.simpananWajibKredit && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Simpanan Wajib Kredit ({pengaturan.sukuBunga.simpananWajibKredit?.persentase}%)</span>
                  <span className="font-medium">{formatRupiah(additionalCharges.simpananWajibKredit)}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="flex mb-2">
                    <span className="w-32 text-gray-600">Tenor</span>
                    <span className="w-4">:</span>
                    <span className="font-medium">{loanInfo.tenor} bulan</span>
                  </div>
                  <div className="flex mb-2">
                    <span className="w-32 text-gray-600">Suku Bunga</span>
                    <span className="w-4">:</span>
                    <span className="font-medium">{loanInfo.bunga}% per bulan</span>
                  </div>
                </div>
                <div>
                  <div className="flex mb-2">
                    <span className="w-32 text-gray-600">Angsuran/Bulan</span>
                    <span className="w-4">:</span>
                    <span className="font-medium">{formatRupiah(loanInfo.angsuranPerBulan)}</span>
                  </div>
                  <div className="flex mb-2">
                    <span className="w-32 text-gray-600">Total Kembali</span>
                    <span className="w-4">:</span>
                    <span className="font-medium">{formatRupiah(loanInfo.totalPengembalian)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Net Amount Received */}
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Jumlah Diterima Peminjam
              </span>
              <span className="text-xl font-bold text-green-700">
                {formatRupiah(
                  transaksi.jumlah - 
                  (additionalCharges?.danaResikoKredit || 0) - 
                  (additionalCharges?.simpananWajibKredit || 0)
                )}
              </span>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              SYARAT DAN KETENTUAN
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Peminjam wajib membayar angsuran tepat waktu sesuai jadwal yang telah disepakati.</p>
              <p>2. Keterlambatan pembayaran akan dikenakan denda sesuai peraturan koperasi.</p>
              <p>3. Peminjam bertanggung jawab penuh atas pinjaman yang diterima.</p>
              <p>4. Pinjaman ini telah sesuai dengan AD/ART koperasi yang berlaku.</p>
            </div>
          </div>
          
          {/* Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="mb-16 text-gray-700">Peminjam,</p>
              <div className="border-b border-gray-800 mb-2"></div>
              <p className="font-medium">{anggota?.nama || "Nama Peminjam"}</p>
              <p className="text-sm text-gray-600">Anggota No. {anggota?.id}</p>
            </div>
            <div className="text-center">
              <p className="mb-16 text-gray-700">Petugas Koperasi,</p>
              <div className="border-b border-gray-800 mb-2"></div>
              <p className="font-medium">{defaultOfficerName}</p>
              <p className="text-sm text-gray-600">
                {currentDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center">
            <p className="text-xs text-gray-500">
              Dokumen ini dicetak otomatis pada {formatDateTime(new Date().toISOString())}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tanda terima ini merupakan bukti sah transaksi pinjaman
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ProfessionalLoanReceipt.displayName = "ProfessionalLoanReceipt";
