
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaDokumen } from "@/types";

interface DokumenFormProps {
  dokumen: AnggotaDokumen[];
  onUploadSuccess: (dokumen: AnggotaDokumen) => void;
}

export function DokumenForm({ dokumen, onUploadSuccess }: DokumenFormProps) {
  const { toast } = useToast();
  const [jenisDokumen, setJenisDokumen] = useState<"KTP" | "KK" | "Sertifikat" | "BPKB" | "SK">("KTP");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file terlalu besar (maksimum 5MB)");
      return false;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Format file tidak didukung (hanya PDF, JPG, PNG)");
      return false;
    }
    
    // Check if document of this type already exists
    const existingDoc = dokumen.find(d => d.jenis === jenisDokumen);
    if (existingDoc) {
      setFileError(`Dokumen ${jenisDokumen} sudah ada. Hapus terlebih dahulu untuk mengganti.`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        e.target.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      const newDokumen: AnggotaDokumen = {
        id: `doc-${Date.now()}`,
        jenis: jenisDokumen,
        file: result,
        namaFile: selectedFile.name,
        tanggalUpload: new Date().toISOString(),
      };

      onUploadSuccess(newDokumen);
      
      setSelectedFile(null);
      setIsUploading(false);
      
      // Reset file input
      const fileInput = document.getElementById("dokumen") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Gagal membaca file",
        description: "Terjadi kesalahan saat membaca file dokumen",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(selectedFile);
  };

  const isDocTypeUsed = (type: string): boolean => {
    return dokumen.some(doc => doc.jenis === type);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="jenisDokumen">Jenis Dokumen</Label>
        <Select value={jenisDokumen} onValueChange={(value) => {
          setJenisDokumen(value as any);
          setFileError(null);
          if (isDocTypeUsed(value)) {
            setFileError(`Dokumen ${value} sudah ada. Hapus terlebih dahulu untuk mengganti.`);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis dokumen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="KTP" disabled={isDocTypeUsed("KTP")}>
              <div className="flex items-center gap-2">
                <span>KTP</span>
                {isDocTypeUsed("KTP") && <Check size={16} className="text-green-500" />}
              </div>
            </SelectItem>
            <SelectItem value="KK" disabled={isDocTypeUsed("KK")}>
              <div className="flex items-center gap-2">
                <span>Kartu Keluarga</span>
                {isDocTypeUsed("KK") && <Check size={16} className="text-green-500" />}
              </div>
            </SelectItem>
            <SelectItem value="Sertifikat" disabled={isDocTypeUsed("Sertifikat")}>
              <div className="flex items-center gap-2">
                <span>Sertifikat</span>
                {isDocTypeUsed("Sertifikat") && <Check size={16} className="text-green-500" />}
              </div>
            </SelectItem>
            <SelectItem value="BPKB" disabled={isDocTypeUsed("BPKB")}>
              <div className="flex items-center gap-2">
                <span>BPKB</span>
                {isDocTypeUsed("BPKB") && <Check size={16} className="text-green-500" />}
              </div>
            </SelectItem>
            <SelectItem value="SK" disabled={isDocTypeUsed("SK")}>
              <div className="flex items-center gap-2">
                <span>Surat Keterangan</span>
                {isDocTypeUsed("SK") && <Check size={16} className="text-green-500" />}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="dokumen">File Dokumen</Label>
        <Input
          id="dokumen"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={isUploading || isDocTypeUsed(jenisDokumen)}
          className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
        />
        <div className="flex items-center h-5 mt-1">
          {fileError ? (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle size={12} /> {fileError}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Format: PDF, JPG, PNG. Maks: 5MB
            </p>
          )}
        </div>
      </div>
      <div className="flex items-end">
        <Button 
          onClick={handleUpload} 
          className="w-full"
          disabled={!selectedFile || isUploading || !!fileError}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>Mengupload...</span>
            </span>
          ) : (
            <>
              <Upload size={16} className="mr-1" /> Upload Dokumen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
