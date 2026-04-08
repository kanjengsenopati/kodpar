
import React from 'react';
import { Transaksi } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getPengaturan } from '@/services/pengaturanService';

interface PrintableContentProps {
  transaksi: Transaksi;
  anggotaNama?: string;
}

export const PrintableContent = React.forwardRef<HTMLDivElement, PrintableContentProps>(
  ({ transaksi, anggotaNama }, ref) => {
    const pengaturan = getPengaturan();
    const profilKoperasi = pengaturan.profil || {
      namaKoperasi: "Koperasi Sejahtera",
      alamat: "Jl. Raya Utama No. 123",
      telepon: "021-1234567"
    };

    return (
      <div 
        ref={ref} 
        className="p-8 bg-white max-w-2xl mx-auto"
        style={{ fontFamily: '"Times New Roman", serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {profilKoperasi.namaKoperasi}
          </h1>
          <p className="text-gray-600">{profilKoperasi.alamat}</p>
          <p className="text-gray-600">Telp: {profilKoperasi.telepon}</p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800">
              BUKTI TRANSAKSI {transaksi.jenis.toUpperCase()}
            </h2>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <table className="w-full">
                <tbody className="space-y-2">
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">ID Transaksi</td>
                    <td className="py-2">: {transaksi.id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Tanggal</td>
                    <td className="py-2">: {formatDate(transaksi.tanggal)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Jenis Transaksi</td>
                    <td className="py-2">: {transaksi.jenis}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Status</td>
                    <td className="py-2">: {transaksi.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">ID Anggota</td>
                    <td className="py-2">: {transaksi.anggotaId}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Nama Anggota</td>
                    <td className="py-2">: {anggotaNama || transaksi.anggotaNama}</td>
                  </tr>
                  {transaksi.kategori && (
                    <tr>
                      <td className="py-2 text-gray-600 font-medium">Kategori</td>
                      <td className="py-2">: {transaksi.kategori}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Jumlah Transaksi</p>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(transaksi.jumlah)}
            </p>
          </div>
        </div>

        {/* Description */}
        {transaksi.keterangan && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-2">Keterangan:</h3>
            <p className="text-gray-700 leading-relaxed border-l-4 border-gray-300 pl-4">
              {transaksi.keterangan}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex justify-between items-end">
          <div className="text-sm text-gray-500">
            <p>Dicetak pada: {formatDate(new Date().toISOString())}</p>
            <p>Dokumen ini sah tanpa tanda tangan</p>
          </div>
          
          <div className="text-center">
            <div className="border-t-2 border-gray-300 pt-2 mt-16 w-48">
              <p className="text-sm text-gray-600">Petugas Koperasi</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableContent.displayName = 'PrintableContent';
