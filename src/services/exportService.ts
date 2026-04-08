
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Anggota, Transaksi, Pengajuan } from '@/types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportField {
  key: string;
  label: string;
  selected: boolean;
}

export interface ExportOptions {
  title: string;
  data: any[];
  fields: ExportField[];
  filename: string;
}

// Export to PDF
export const exportToPDF = (options: ExportOptions) => {
  const { title, data, fields, filename } = options;
  const selectedFields = fields.filter(f => f.selected);
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);
  
  // Prepare table data
  const headers = selectedFields.map(f => f.label);
  const rows = data.map(item => 
    selectedFields.map(field => {
      const value = item[field.key];
      if (field.key.includes('tanggal') && value) {
        return new Date(value).toLocaleDateString('id-ID');
      }
      if (typeof value === 'number' && field.key.includes('jumlah')) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(value);
      }
      return value || '-';
    })
  );
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  doc.save(`${filename}.pdf`);
};

// Export to Excel
export const exportToExcel = (options: ExportOptions) => {
  const { title, data, fields, filename } = options;
  const selectedFields = fields.filter(f => f.selected);
  
  // Prepare data with selected fields only
  const exportData = data.map(item => {
    const filteredItem: any = {};
    selectedFields.forEach(field => {
      let value = item[field.key];
      if (field.key.includes('tanggal') && value) {
        value = new Date(value).toLocaleDateString('id-ID');
      }
      if (typeof value === 'number' && field.key.includes('jumlah')) {
        value = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(value);
      }
      filteredItem[field.label] = value || '-';
    });
    return filteredItem;
  });
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  
  // Add title row
  XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });
  XLSX.utils.sheet_add_aoa(ws, [[`Generated: ${new Date().toLocaleDateString('id-ID')}`]], { origin: 'A2' });
  
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Print functionality
export const printData = (options: ExportOptions) => {
  const { title, data, fields } = options;
  const selectedFields = fields.filter(f => f.selected);
  
  // Create printable HTML
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const headers = selectedFields.map(f => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">${f.label}</th>`).join('');
  
  const rows = data.map(item => {
    const cells = selectedFields.map(field => {
      let value = item[field.key];
      if (field.key.includes('tanggal') && value) {
        value = new Date(value).toLocaleDateString('id-ID');
      }
      if (typeof value === 'number' && field.key.includes('jumlah')) {
        value = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(value);
      }
      return `<td style="border: 1px solid #ddd; padding: 8px;">${value || '-'}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          h1 { color: #333; }
          .date { color: #666; font-size: 14px; margin-bottom: 20px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated: ${new Date().toLocaleDateString('id-ID')}</div>
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Field definitions for different data types
export const getAnggotaFields = (): ExportField[] => [
  { key: 'id', label: 'ID Anggota', selected: true },
  { key: 'nama', label: 'Nama', selected: true },
  { key: 'nip', label: 'NIP', selected: true },
  { key: 'noHp', label: 'No. HP', selected: false },
  { key: 'unitKerja', label: 'Unit Kerja', selected: true },
  { key: 'jenisKelamin', label: 'Jenis Kelamin', selected: false },
  { key: 'status', label: 'Status', selected: true },
  { key: 'tanggalBergabung', label: 'Tanggal Bergabung', selected: false }
];

export const getTransaksiFields = (): ExportField[] => [
  { key: 'id', label: 'ID Transaksi', selected: true },
  { key: 'tanggal', label: 'Tanggal', selected: true },
  { key: 'anggotaNama', label: 'Nama Anggota', selected: true },
  { key: 'jenis', label: 'Jenis', selected: true },
  { key: 'kategori', label: 'Kategori', selected: false },
  { key: 'jumlah', label: 'Jumlah', selected: true },
  { key: 'keterangan', label: 'Keterangan', selected: false },
  { key: 'status', label: 'Status', selected: true }
];

export const getPengajuanFields = (): ExportField[] => [
  { key: 'id', label: 'ID Pengajuan', selected: true },
  { key: 'tanggal', label: 'Tanggal', selected: true },
  { key: 'anggotaNama', label: 'Nama Anggota', selected: true },
  { key: 'jenis', label: 'Jenis', selected: true },
  { key: 'jumlah', label: 'Jumlah', selected: true },
  { key: 'status', label: 'Status', selected: true },
  { key: 'keterangan', label: 'Keterangan', selected: false }
];
