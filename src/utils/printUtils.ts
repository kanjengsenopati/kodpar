
import { Transaksi } from "@/types";

export const handleTransactionPrint = (transaksi: Transaksi) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
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
