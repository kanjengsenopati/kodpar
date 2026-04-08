import { Transaksi } from "@/types";
import { getLoanDetails, extractLoanDetailsFromKeterangan } from "@/services/loanDataService";

export interface LoanInfo {
  id: string;
  anggotaId: string;
  kategori: string;
  jumlah: number;
  tenor: number;
  sukuBunga: number;
  angsuranPerBulan: number;
  totalPengembalian: number;
  nominalJasa: number;
  totalNominalJasa: number;
  tanggalPinjam: string;
  status: string;
}

/**
 * Extract loan information from transaction data with consistent calculation
 */
export function extractLoanInfo(pinjaman: Transaksi): LoanInfo | null {
  if (pinjaman.jenis !== "Pinjam") return null;

  const loanDetails = getLoanDetails(pinjaman.id);
  if (!loanDetails) {
    // Fallback to keterangan parsing
    const loanInfo = extractLoanDetailsFromKeterangan(pinjaman.keterangan || "");
    const nominalJasa = Math.floor(loanInfo.angsuranPerBulan * 0.2);
    
    return {
      id: pinjaman.id,
      anggotaId: pinjaman.anggotaId,
      kategori: pinjaman.kategori || "Pinjaman Reguler",
      jumlah: pinjaman.jumlah,
      tenor: loanInfo.tenor,
      sukuBunga: loanInfo.sukuBunga,
      angsuranPerBulan: loanInfo.angsuranPerBulan,
      totalPengembalian: loanInfo.totalPengembalian,
      nominalJasa,
      totalNominalJasa: nominalJasa * loanInfo.tenor,
      tanggalPinjam: pinjaman.tanggal,
      status: pinjaman.status
    };
  }

  const nominalJasa = Math.floor(loanDetails.angsuranPerBulan * 0.2);

  return {
    id: loanDetails.id,
    anggotaId: loanDetails.anggotaId,
    kategori: loanDetails.kategori,
    jumlah: loanDetails.jumlahPinjaman,
    tenor: loanDetails.tenor,
    sukuBunga: loanDetails.sukuBunga,
    angsuranPerBulan: loanDetails.angsuranPerBulan,
    totalPengembalian: loanDetails.totalPengembalian,
    nominalJasa,
    totalNominalJasa: nominalJasa * loanDetails.tenor,
    tanggalPinjam: loanDetails.tanggalPinjam,
    status: loanDetails.status
  };
}

/**
 * Get all loan information for an anggota with consistent calculations
 */
export function getAnggotaLoanInfo(anggotaId: string, transaksiList: Transaksi[]): LoanInfo[] {
  const pinjamanList = transaksiList.filter(
    t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses"
  );

  return pinjamanList.map(pinjaman => extractLoanInfo(pinjaman)).filter(Boolean) as LoanInfo[];
}

/**
 * Calculate remaining installments for a loan
 */
export function calculateRemainingInstallments(loanId: string, transaksiList: Transaksi[]): number {
  const loanDetails = getLoanDetails(loanId);
  if (!loanDetails) return 0;

  // Count successful installment payments for this loan
  const angsuranCount = transaksiList.filter(
    t => t.jenis === "Angsuran" && 
         t.status === "Sukses" && 
         t.anggotaId === loanDetails.anggotaId &&
         t.keterangan?.includes(loanId)
  ).length;

  return Math.max(0, loanDetails.tenor - angsuranCount);
}

/**
 * Format loan information for display
 */
export function formatLoanDisplay(loanInfo: LoanInfo) {
  return {
    tenor: `${loanInfo.tenor} bulan`,
    sukuBunga: `${loanInfo.sukuBunga}% per bulan`,
    angsuranPerBulan: `Rp ${loanInfo.angsuranPerBulan.toLocaleString('id-ID')}`,
    totalPengembalian: `Rp ${loanInfo.totalPengembalian.toLocaleString('id-ID')}`,
    nominalJasa: `Rp ${loanInfo.nominalJasa.toLocaleString('id-ID')}`,
    totalNominalJasa: `Rp ${loanInfo.totalNominalJasa.toLocaleString('id-ID')}`
  };
}

/**
 * Enhanced transaction print function with loan details
 */
export const handleTransactionPrint = (transaksi: Transaksi) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  // Get loan information if it's a loan transaction
  let loanDetails = '';
  if (transaksi.jenis === "Pinjam") {
    const loanInfo = extractLoanInfo(transaksi);
    if (loanInfo) {
      const displayInfo = formatLoanDisplay(loanInfo);
      loanDetails = `
        <div class="row">
          <span class="label">Tenor:</span>
          <span class="value">${displayInfo.tenor}</span>
        </div>
        <div class="row">
          <span class="label">Suku Bunga:</span>
          <span class="value">${displayInfo.sukuBunga}</span>
        </div>
        <div class="row">
          <span class="label">Angsuran per Bulan:</span>
          <span class="value">${displayInfo.angsuranPerBulan}</span>
        </div>
        <div class="row">
          <span class="label">Total Pengembalian:</span>
          <span class="value">${displayInfo.totalPengembalian}</span>
        </div>
      `;
    }
  } else if (transaksi.jenis === "Angsuran") {
    // Extract installment details
    const loanMatch = transaksi.keterangan?.match(/Pinjaman: (TR\d+)/);
    const pokokMatch = transaksi.keterangan?.match(/Pokok: Rp ([\d,.]+)/);
    const jasaMatch = transaksi.keterangan?.match(/Jasa: Rp ([\d,.]+)/);
    
    if (loanMatch) {
      loanDetails = `
        <div class="row">
          <span class="label">ID Pinjaman:</span>
          <span class="value">${loanMatch[1]}</span>
        </div>
        ${pokokMatch ? `
        <div class="row">
          <span class="label">Pembayaran Pokok:</span>
          <span class="value">Rp ${pokokMatch[1]}</span>
        </div>
        ` : ''}
        ${jasaMatch ? `
        <div class="row">
          <span class="label">Pembayaran Jasa:</span>
          <span class="value">Rp ${jasaMatch[1]}</span>
        </div>
        ` : ''}
      `;
    }
  }

  // Generate print content
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bukti Transaksi ${transaksi.id}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .content { 
          margin: 20px 0; 
        }
        .row { 
          display: flex; 
          justify-content: space-between; 
          margin: 8px 0;
          padding: 5px 0;
        }
        .label { 
          font-weight: bold; 
          width: 40%;
        }
        .value { 
          width: 60%; 
        }
        .footer {
          margin-top: 50px;
          text-align: right;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>KOPERASI SIMPAN PINJAM</h2>
        <h3>Bukti Transaksi ${transaksi.jenis}</h3>
      </div>
      
      <div class="content">
        <div class="row">
          <span class="label">No. Transaksi:</span>
          <span class="value">${transaksi.id}</span>
        </div>
        <div class="row">
          <span class="label">Jenis Transaksi:</span>
          <span class="value">${transaksi.jenis}</span>
        </div>
        <div class="row">
          <span class="label">Nama Anggota:</span>
          <span class="value">${transaksi.anggotaNama}</span>
        </div>
        <div class="row">
          <span class="label">ID Anggota:</span>
          <span class="value">${transaksi.anggotaId}</span>
        </div>
        <div class="row">
          <span class="label">Tanggal:</span>
          <span class="value">${new Date(transaksi.tanggal).toLocaleDateString('id-ID')}</span>
        </div>
        <div class="row">
          <span class="label">Jumlah:</span>
          <span class="value">Rp ${transaksi.jumlah.toLocaleString('id-ID')}</span>
        </div>
        <div class="row">
          <span class="label">Status:</span>
          <span class="value">${transaksi.status}</span>
        </div>
        ${transaksi.kategori ? `
        <div class="row">
          <span class="label">Kategori:</span>
          <span class="value">${transaksi.kategori}</span>
        </div>
        ` : ''}
        ${loanDetails}
        ${transaksi.keterangan ? `
        <div class="row">
          <span class="label">Keterangan:</span>
          <span class="value">${transaksi.keterangan}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
};
