import { Transaksi } from "@/types";
import { formatCurrency } from "./formatters";

/**
 * PURE DATABASE DRIVEN LOAN INFO (SAK EP)
 */
export interface LoanInfo {
  id: string;
  anggotaId: string;
  kategori: string;
  jumlah: number;
  tenor: number;
  sukuBunga: number;
  angsuranPerBulan: number;
  nominalJasa: number;
  tanggalPinjam: string;
  status: string;
}

/**
 * Extract loan information from structured DATABASE fields
 */
export function extractLoanInfo(pinjaman: Transaksi): LoanInfo | null {
  if (pinjaman.jenis !== "Pinjam") return null;

  // Use Structured Fields (Pure DB)
  const tenor = pinjaman.tenor || 12;
  const rate = pinjaman.sukuBunga || 0;
  const angsuranPerBulan = Math.floor(pinjaman.jumlah / tenor);

  return {
    id: pinjaman.id,
    anggotaId: pinjaman.anggotaId,
    kategori: pinjaman.kategori || "Pinjaman Reguler",
    jumlah: pinjaman.jumlah,
    tenor: tenor,
    sukuBunga: rate,
    angsuranPerBulan: angsuranPerBulan,
    nominalJasa: Math.round(pinjaman.jumlah * (rate / 100)),
    tanggalPinjam: pinjaman.tanggal,
    status: pinjaman.status
  };
}

/**
 * Get all loan information for an anggota with pure DB driven logic
 */
export function getAnggotaLoanInfo(anggotaId: string, transaksiList: Transaksi[]): LoanInfo[] {
  return transaksiList
    .filter(t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses")
    .map(pinjaman => extractLoanInfo(pinjaman))
    .filter(Boolean) as LoanInfo[];
}

/**
 * Enhanced transaction print function - Pure DB Driven (No Regex)
 */
export const handleTransactionPrint = (transaksi: Transaksi) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  let extraDetails = '';
  
  if (transaksi.jenis === "Pinjam") {
    const info = extractLoanInfo(transaksi);
    if (info) {
      extraDetails = `
        <div class="row"><span class="label">Tenor:</span><span class="value">${info.tenor} Bulan</span></div>
        <div class="row"><span class="label">Suku Bunga:</span><span class="value">${info.sukuBunga}% p.m</span></div>
        <div class="row"><span class="label">Porsi Jasa:</span><span class="value">${formatCurrency(info.nominalJasa)}</span></div>
      `;
    }
  } else if (transaksi.jenis === "Angsuran") {
    extraDetails = `
      <div class="row"><span class="label">ID Pinjaman:</span><span class="value">${transaksi.referensiPinjamanId || '-'}</span></div>
      <div class="row"><span class="label">Nominal Pokok:</span><span class="value">${formatCurrency(transaksi.nominalPokok || 0)}</span></div>
      <div class="row"><span class="label">Nominal Jasa:</span><span class="value">${formatCurrency(transaksi.nominalJasa || 0)}</span></div>
    `;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bukti Transaksi ${transaksi.id}</title>
      <style>
        body { font-family: 'Inter', sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
        .row { display: flex; justify-content: space-between; border-bottom: 1px dashed #f1f5f9; padding: 10px 0; }
        .label { font-weight: 600; color: #64748b; }
        .value { font-weight: 700; color: #0f172a; text-align: right; }
        .total { font-size: 1.25rem; margin-top: 20px; border-top: 2px solid #0f172a; padding-top: 10px; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body onload="window.print(); window.onafterprint = () => window.close();">
      <div class="header">
        <h1 style="margin:0; font-size: 24px;">KSP SENOPATI</h1>
        <p style="margin:5px 0 0 0; color: #64748b;">Bukti Transaksi Elektronik SAK EP</p>
      </div>
      
      <div class="row"><span class="label">ID Transaksi</span><span class="value">${transaksi.id}</span></div>
      <div class="row"><span class="label">Tanggal</span><span class="value">${new Date(transaksi.tanggal).toLocaleString('id-ID')}</span></div>
      <div class="row"><span class="label">Anggota</span><span class="value">${transaksi.anggotaNama}</span></div>
      <div class="row"><span class="label">Jenis</span><span class="value">${transaksi.jenis} ${transaksi.kategori ? `(${transaksi.kategori})` : ''}</span></div>
      
      ${extraDetails}
      
      <div class="row total"><span class="label">JUMLAH TOTAL</span><span class="value">${formatCurrency(transaksi.jumlah)}</span></div>
      
      <div style="margin-top: 60px; text-align: right;">
        <p style="margin:0; color: #64748b; font-size: 12px;">Petugas Operasional</p>
        <div style="margin-top: 40px; font-weight: bold;">${transaksi.petugas || 'Sistem Otomatis'}</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
};
