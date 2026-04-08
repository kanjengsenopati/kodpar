
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseAnggotaExcel } from "@/utils/excelUtils";
import { Anggota } from "@/types";
import { Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { createAnggota } from "@/services/anggotaService";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ImportAnggotaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportAnggotaDialog({ isOpen, onClose, onSuccess }: ImportAnggotaDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Partial<Anggota>[]>([]);
  const [importProgress, setImportProgress] = useState(0);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check if file is Excel
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setErrors(["File harus berformat Excel (.xlsx atau .xls)"]);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setErrors([]);
    setPreviewData([]);
    handleFilePreview(selectedFile);
  };
  
  // Preview file contents
  const handleFilePreview = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const { data, errors } = await parseAnggotaExcel(selectedFile);
      setPreviewData(data);
      setErrors(errors);
    } catch (error) {
      setErrors([error.message || "Gagal memproses file"]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Import data to system
  const handleImport = async () => {
    if (!previewData.length) {
      setErrors(["Tidak ada data yang valid untuk diimpor"]);
      return;
    }
    
    setIsLoading(true);
    const totalRecords = previewData.length;
    let successCount = 0;
    let errorCount = 0;
    const newErrors: string[] = [];
    
    for (let i = 0; i < previewData.length; i++) {
      try {
        const anggota = previewData[i];
        if (!anggota.nama || !anggota.jenisKelamin) {
          newErrors.push(`Data baris ${i + 1} tidak lengkap`);
          errorCount++;
          continue;
        }
        
        // Create a new anggota 
        createAnggota({
          nama: anggota.nama,
          nip: anggota.nip,
          alamat: anggota.alamat || '',
          noHp: anggota.noHp || '',
          jenisKelamin: anggota.jenisKelamin as 'L' | 'P',
          agama: anggota.agama || 'ISLAM',
          status: anggota.status || 'active',
          unitKerja: anggota.unitKerja || '',
          email: anggota.email || '',
        });
        
        successCount++;
      } catch (error) {
        errorCount++;
        newErrors.push(`Gagal mengimpor data baris ${i + 1}: ${error.message || "Error tidak diketahui"}`);
      }
      
      // Update progress
      setImportProgress(Math.round(((i + 1) / totalRecords) * 100));
    }
    
    setIsLoading(false);
    setErrors(newErrors);
    
    if (successCount > 0) {
      toast.success(`${successCount} anggota berhasil diimpor`);
      onSuccess();
      
      // Reset state and close dialog after 2 seconds
      setTimeout(() => {
        setFile(null);
        setPreviewData([]);
        setErrors([]);
        setImportProgress(0);
        onClose();
      }, 2000);
    } else {
      toast.error("Gagal mengimpor data anggota");
    }
  };
  
  // Reset the dialog state
  const resetDialog = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setImportProgress(0);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data Anggota</DialogTitle>
          <DialogDescription>
            Upload file Excel dengan data anggota untuk diimpor ke sistem.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="grid flex-1 gap-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border rounded-md border-dashed p-6 text-center hover:bg-gray-50"
              >
                <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="mt-2">
                  <span className="font-semibold text-primary">Klik untuk upload</span> atau drag and drop
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Format XLSX atau XLS
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="sr-only"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 p-2 border rounded bg-muted/20">
              <FileSpreadsheet size={16} />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          )}
          
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 text-sm">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {previewData.length > 0 && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>
                {previewData.length} data anggota siap untuk diimpor
              </AlertDescription>
            </Alert>
          )}
          
          {isLoading && importProgress > 0 && (
            <div className="space-y-2">
              <Progress value={importProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Mengimpor data... ({importProgress}%)
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetDialog} disabled={isLoading}>
            Batal
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!previewData.length || isLoading}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
