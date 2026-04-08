
import { Anggota } from "@/types";
import { parseAnggotaExcel } from "@/utils/excelUtils";
import { createAnggota } from "./anggotaService";
import { toast } from "sonner";

/**
 * Import data from Excel file
 * @param file The Excel file to parse
 * @returns Parsed data and status
 */
export async function importExcelData(file: File): Promise<{
  data: any[];
  headers: string[];
  errors: string[];
}> {
  try {
    // Parse the Excel file
    const fileContent = await parseExcelRaw(file);
    
    if (!fileContent || !fileContent.data || fileContent.data.length === 0) {
      return {
        data: [],
        headers: [],
        errors: ["File tidak memiliki data yang dapat dibaca"]
      };
    }
    
    // Extract headers from the first row
    const headers = Object.keys(fileContent.data[0]);
    
    return {
      data: fileContent.data,
      headers,
      errors: fileContent.errors || []
    };
  } catch (error) {
    console.error("Error importing data:", error);
    return {
      data: [],
      headers: [],
      errors: [error.message || "Gagal memproses file Excel"]
    };
  }
}

/**
 * Parse Excel file to raw JSON data
 */
async function parseExcelRaw(file: File): Promise<{ data: any[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Use existing XLSX parsing logic from excelUtils
        const result = await parseAnggotaRawData(file);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse Anggota Excel data without transformation to Anggota objects
 */
async function parseAnggotaRawData(file: File): Promise<{ data: any[]; errors: string[] }> {
  try {
    const XLSX = await import('xlsx');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON with header
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          resolve({ data: jsonData, errors: [] });
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          reject(new Error('Gagal memproses file Excel'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Gagal membaca file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error("Error loading XLSX library:", error);
    throw new Error("Gagal memuat library untuk membaca file Excel");
  }
}

/**
 * Generate demo data for Anggota preview
 */
export function generateDemoAnggotaData(): {
  data: any[];
  headers: string[];
} {
  const demoData = [
    {
      "Nama": "Budiman Santoso",
      "NIP": "198506152010011002",
      "Alamat": "Jl. Pahlawan No. 45, Semarang",
      "No HP": "081234567890",
      "Jenis Kelamin": "L",
      "Agama": "ISLAM",
      "Status": "active",
      "Unit Kerja": "SDN Maju Jaya 01",
      "Email": "budiman.s@example.com"
    },
    {
      "Nama": "Siti Rahayu",
      "NIP": "198709212011012003",
      "Alamat": "Jl. Soekarno Hatta No. 12, Semarang",
      "No HP": "082345678901",
      "Jenis Kelamin": "P",
      "Agama": "ISLAM",
      "Status": "active",
      "Unit Kerja": "SDN Maju Jaya 02",
      "Email": "siti.r@example.com"
    },
    {
      "Nama": "Ahmad Fadli",
      "NIP": "199002102012011004",
      "Alamat": "Jl. Ahmad Yani No. 78, Semarang",
      "No HP": "083456789012",
      "Jenis Kelamin": "L",
      "Agama": "ISLAM",
      "Status": "active",
      "Unit Kerja": "SMPN 3 Semarang",
      "Email": "ahmad.f@example.com"
    },
    {
      "Nama": "Sri Wahyuni",
      "NIP": "199104172013012005",
      "Alamat": "Jl. Diponegoro No. 34, Semarang",
      "No HP": "084567890123",
      "Jenis Kelamin": "P",
      "Agama": "ISLAM",
      "Status": "active",
      "Unit Kerja": "SMAN 1 Semarang",
      "Email": "sri.w@example.com"
    },
    {
      "Nama": "Budi Santoso",
      "NIP": "199205232014011006",
      "Alamat": "Jl. Gajah Mada No. 67, Semarang",
      "No HP": "085678901234",
      "Jenis Kelamin": "L",
      "Agama": "KRISTEN",
      "Status": "active",
      "Unit Kerja": "SDN Sukamaju 03",
      "Email": "budi.s@example.com"
    }
  ];
  
  const headers = Object.keys(demoData[0]);
  
  return { data: demoData, headers };
}

/**
 * Generate demo data for Transaksi preview
 */
export function generateDemoTransaksiData(): {
  data: any[];
  headers: string[];
} {
  const demoData = [
    {
      "ID Anggota": "AG0001",
      "Nama Anggota": "Mariyem",
      "Jenis Transaksi": "SIMPANAN WAJIB",
      "Tanggal": "2023-01-05",
      "Jumlah": 100000,
      "Keterangan": "Simpanan wajib bulan Januari 2023"
    },
    {
      "ID Anggota": "AG0002",
      "Nama Anggota": "Maskun Rozak",
      "Jenis Transaksi": "SIMPANAN POKOK",
      "Tanggal": "2023-01-10",
      "Jumlah": 250000,
      "Keterangan": "Simpanan pokok anggota baru"
    },
    {
      "ID Anggota": "AG0001",
      "Nama Anggota": "Mariyem",
      "Jenis Transaksi": "PINJAMAN",
      "Tanggal": "2023-02-15",
      "Jumlah": 5000000,
      "Keterangan": "Pinjaman pendidikan anak"
    },
    {
      "ID Anggota": "AG0003",
      "Nama Anggota": "Ahmad Nuralimin",
      "Jenis Transaksi": "SIMPANAN SUKARELA",
      "Tanggal": "2023-02-20",
      "Jumlah": 500000,
      "Keterangan": "Simpanan sukarela"
    },
    {
      "ID Anggota": "AG0001",
      "Nama Anggota": "Mariyem",
      "Jenis Transaksi": "ANGSURAN",
      "Tanggal": "2023-03-15",
      "Jumlah": 458333,
      "Keterangan": "Angsuran pinjaman ke-1"
    }
  ];
  
  const headers = Object.keys(demoData[0]);
  
  return { data: demoData, headers };
}

/**
 * Import Anggota data to the system
 * @param data Array of Anggota objects to import
 * @returns Status of the import operation
 */
export async function importAnggotaData(data: Partial<Anggota>[]): Promise<{
  success: number;
  errors: number;
  errorMessages: string[];
}> {
  let successCount = 0;
  let errorCount = 0;
  const errorMessages: string[] = [];
  
  for (const anggota of data) {
    try {
      if (!anggota.nama) {
        errorMessages.push(`Data anggota tidak memiliki nama`);
        errorCount++;
        continue;
      }
      
      // Ensure all required fields are present with default values
      const anggotaData = {
        nama: anggota.nama,
        nip: anggota.nip || '',
        alamat: anggota.alamat || '',
        noHp: anggota.noHp || '',
        jenisKelamin: anggota.jenisKelamin as 'L' | 'P' || 'L',
        agama: anggota.agama || 'ISLAM',
        status: anggota.status || 'active',
        unitKerja: anggota.unitKerja || '',
        email: anggota.email || ''
      };
      
      // Save to database
      await createAnggota(anggotaData);
      successCount++;
    } catch (error) {
      errorCount++;
      errorMessages.push(`Gagal menyimpan anggota ${anggota.nama}: ${error.message || "Error tidak diketahui"}`);
    }
  }
  
  return {
    success: successCount,
    errors: errorCount,
    errorMessages
  };
}

/**
 * Download template for anggota import
 */
export function downloadAnggotaTemplate(): void {
  const templateData = [
    {
      "Nama": "Contoh Nama",
      "NIP": "198501012010012001",
      "Alamat": "Jl. Contoh No. 123",
      "No HP": "08123456789",
      "Jenis Kelamin": "L",
      "Agama": "ISLAM",
      "Status": "active", 
      "Unit Kerja": "SDN Contoh 01",
      "Email": "email@contoh.com"
    }
  ];
  
  downloadExcelTemplate(templateData, "Template_Import_Anggota");
}

/**
 * Download template for transaksi import
 */
export function downloadTransaksiTemplate(): void {
  const templateData = [
    {
      "ID Anggota": "AG0001",
      "Nama Anggota": "Contoh Nama",
      "Jenis Transaksi": "SIMPANAN WAJIB",
      "Tanggal": "2024-01-01",
      "Jumlah": 100000,
      "Keterangan": "Contoh keterangan transaksi"
    }
  ];
  
  downloadExcelTemplate(templateData, "Template_Import_Transaksi");
}

/**
 * Generic function to download Excel template
 */
async function downloadExcelTemplate(data: any[], filename: string): Promise<void> {
  try {
    const XLSX = await import('xlsx');
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error("Error generating template:", error);
    toast.error("Gagal mengunduh template");
  }
}
