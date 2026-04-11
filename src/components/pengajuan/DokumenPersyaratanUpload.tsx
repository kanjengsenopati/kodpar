
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, FileText, Upload, Info, X } from "lucide-react";
import { Text } from "@/components/ui/text";

// Define document types required for loan applications
export interface PersyaratanDokumen {
  id: string;
  jenis: "KTP" | "KK" | "Sertifikat Tanah" | "Sertifikat Sertifikasi" | "Buku Rekening" | "ATM Sertifikasi";
  file: string | null; // base64 string
  namaFile: string;
  required: boolean;
  kategori: "Reguler" | "Sertifikasi" | "Musiman" | "All"; // Which loan category requires this document
}

interface DokumenPersyaratanUploadProps {
  selectedKategori: string;
  dokumenList: PersyaratanDokumen[];
  onChange: (dokumenList: PersyaratanDokumen[]) => void;
}

export function DokumenPersyaratanUpload({ selectedKategori, dokumenList, onChange }: DokumenPersyaratanUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);

  // Define required documents based on loan category
  const requiredDocuments = [
    { jenis: "KTP", kategori: "All", required: false },
    { jenis: "KK", kategori: "All", required: false },
    { jenis: "Sertifikat Tanah", kategori: "Reguler", required: false },
    { jenis: "Sertifikat Sertifikasi", kategori: "Sertifikasi", required: false },
    { jenis: "Buku Rekening", kategori: "All", required: false },
    { jenis: "ATM Sertifikasi", kategori: "Sertifikasi", required: false }
  ] as const;
  
  // Filter documents based on selected category
  const relevantDocuments = requiredDocuments.filter(
    doc => doc.kategori === "All" || doc.kategori === selectedKategori
  );

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (relevantDocuments.length === 0) return 100;
    const uploadedDocs = dokumenList.filter(
      doc => doc.file && relevantDocuments.some(rd => rd.jenis === doc.jenis)
    );
    return Math.round((uploadedDocs.length / relevantDocuments.length) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();

  // Generate a unique ID for new documents
  const generateId = () => {
    return `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleFileUpload = (jenis: PersyaratanDokumen["jenis"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(jenis);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const existingDocIndex = dokumenList.findIndex(doc => doc.jenis === jenis);
      
      if (existingDocIndex >= 0) {
        const updatedDokumenList = [...dokumenList];
        updatedDokumenList[existingDocIndex] = {
          ...updatedDokumenList[existingDocIndex],
          file: reader.result as string,
          namaFile: file.name
        };
        onChange(updatedDokumenList);
      } else {
        const requiredDoc = relevantDocuments.find(doc => doc.jenis === jenis);
        const newDokumen: PersyaratanDokumen = {
          id: generateId(),
          jenis,
          file: reader.result as string,
          namaFile: file.name,
          required: requiredDoc?.required || false,
          kategori: (requiredDoc?.kategori as "Reguler" | "Sertifikasi" | "Musiman" | "All") || "All"
        };
        onChange([...dokumenList, newDokumen]);
      }
      setUploading(null);
    };
    
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    const updatedDokumenList = dokumenList.filter(doc => doc.id !== id);
    onChange(updatedDokumenList);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Text.H2 className="text-[15px]">Dokumen Persyaratan</Text.H2>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <Text.Caption className="text-[10px] font-bold not-italic text-blue-600">{completionPercentage}%</Text.Caption>
          </div>
        </div>
        <Text.Caption className="text-[11px] leading-tight opacity-70">
          Unggah bukti pendukung untuk mempercepat proses.
        </Text.Caption>
      </div>

      <Progress value={completionPercentage} className="h-1 bg-slate-100" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {relevantDocuments.map((doc) => {
          const uploadedDoc = dokumenList.find(d => d.jenis === doc.jenis);
          const isUploaded = !!uploadedDoc;
          
          return (
            <div key={doc.jenis} className="bg-white/50 border border-slate-100 rounded-xl p-2.5 transition-all hover:bg-white hover:shadow-sm group">
              <div className="flex justify-between items-center mb-1.5">
                <Text.Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{doc.jenis}</Text.Label>
                {isUploaded ? (
                  <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full">
                    <Check size={10} strokeWidth={3} />
                  </div>
                ) : (
                  <span className="text-[9px] font-bold text-slate-300 uppercase">Opsional</span>
                )}
              </div>
              
              <div className="">
                {isUploaded ? (
                  <div className="flex items-center justify-between bg-slate-50/50 rounded-lg px-2 py-1 border border-slate-100/50">
                    <span className="text-[10px] flex items-center gap-1.5 text-slate-600 truncate max-w-[100px]">
                      <FileText size={12} className="text-blue-500 shrink-0" />
                      <span className="truncate">{uploadedDoc.namaFile}</span>
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(uploadedDoc.id)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id={`upload-${doc.jenis}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileUpload(doc.jenis)}
                      disabled={uploading !== null}
                    />
                    <label
                      htmlFor={`upload-${doc.jenis}`}
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white/30 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition-all hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50"
                    >
                      <Upload size={12} className={uploading === doc.jenis ? "animate-bounce" : ""} />
                      {uploading === doc.jenis ? "..." : "Unggah"}
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
