
import * as XLSX from 'xlsx';
import { Anggota } from "@/types";
import { generateAnggotaId } from "@/services/anggotaService";

/**
 * Generates an Excel template for anggota data import
 * @returns Blob of the Excel file
 */
export const generateAnggotaTemplate = (): Blob => {
  // Create worksheet with headers
  const headers = [
    'Nama', 'NIP', 'Alamat', 'No HP', 'Jenis Kelamin (L/P)', 
    'Agama', 'Status', 'Unit Kerja', 'Email'
  ];
  
  // Sample data row (empty)
  const sampleRow = [
    'Nama Anggota', '198501012010012001', 'Alamat Lengkap', '08123456789', 
    'L', 'ISLAM', 'active', 'SDN Contoh 01', 'email@example.com'
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  
  // Set column widths for better readability
  const wscols = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = wscols;
  
  // Create workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Anggota');
  
  // Generate the Excel file as a blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Parse Excel file and convert to Anggota objects
 * @param file The Excel file to parse
 * @returns Array of Anggota objects
 */
export const parseAnggotaExcel = async (
  file: File
): Promise<{ data: Partial<Anggota>[]; errors: string[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const errors: string[] = [];
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Skip header row
        if (jsonData.length < 2) {
          resolve({ data: [], errors: ['File tidak memiliki data yang valid'] });
          return;
        }
        
        // Extract headers (first row)
        const headers = jsonData[0] as string[];
        
        // Map expected headers to column indices
        const headerMap = {
          nama: headers.findIndex(h => h?.toLowerCase().includes('nama')),
          nip: headers.findIndex(h => h?.toLowerCase().includes('nip')),
          alamat: headers.findIndex(h => h?.toLowerCase().includes('alamat')),
          noHp: headers.findIndex(h => h?.toLowerCase().includes('no hp')),
          jenisKelamin: headers.findIndex(h => h?.toLowerCase().includes('jenis kelamin')),
          agama: headers.findIndex(h => h?.toLowerCase().includes('agama')),
          status: headers.findIndex(h => h?.toLowerCase().includes('status')),
          unitKerja: headers.findIndex(h => h?.toLowerCase().includes('unit kerja')),
          email: headers.findIndex(h => h?.toLowerCase().includes('email')),
        };
        
        // Check if required headers exist
        if (headerMap.nama === -1 || headerMap.jenisKelamin === -1) {
          resolve({ 
            data: [], 
            errors: ['Format file tidak valid. Pastikan file memiliki kolom Nama dan Jenis Kelamin'] 
          });
          return;
        }
        
        // Process data rows
        const anggotaData: Partial<Anggota>[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Skip empty rows
          if (!row || row.length === 0 || !row[headerMap.nama]) continue;
          
          // Extract and validate gender value
          let jenisKelamin = row[headerMap.jenisKelamin];
          if (typeof jenisKelamin === 'string') {
            jenisKelamin = jenisKelamin.trim().toUpperCase();
            if (jenisKelamin !== 'L' && jenisKelamin !== 'P') {
              errors.push(`Baris ${i+1}: Jenis kelamin harus L atau P`);
              jenisKelamin = 'L'; // Default value
            }
          } else {
            jenisKelamin = 'L'; // Default if not specified
          }
          
          // Create anggota object
          const anggota: Partial<Anggota> = {
            nama: row[headerMap.nama]?.toString().trim() || '',
            nip: headerMap.nip !== -1 ? row[headerMap.nip]?.toString() : undefined,
            alamat: headerMap.alamat !== -1 ? row[headerMap.alamat]?.toString() || '' : '',
            noHp: headerMap.noHp !== -1 ? row[headerMap.noHp]?.toString() || '' : '',
            jenisKelamin: jenisKelamin as 'L' | 'P',
            agama: headerMap.agama !== -1 ? row[headerMap.agama]?.toString() || 'ISLAM' : 'ISLAM',
            status: headerMap.status !== -1 ? row[headerMap.status]?.toString() || 'active' : 'active',
            unitKerja: headerMap.unitKerja !== -1 ? row[headerMap.unitKerja]?.toString() || '' : '',
            email: headerMap.email !== -1 ? row[headerMap.email]?.toString() || '' : '',
          };
          
          anggotaData.push(anggota);
        }
        
        resolve({ data: anggotaData, errors });
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
};
