
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Check, FileText, Upload, X, Info } from "lucide-react";

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

  // Calculate completion percentage (optional feature)
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
      // Check if document already exists
      const existingDocIndex = dokumenList.findIndex(doc => doc.jenis === jenis);
      
      if (existingDocIndex >= 0) {
        // Update existing document
        const updatedDokumenList = [...dokumenList];
        updatedDokumenList[existingDocIndex] = {
          ...updatedDokumenList[existingDocIndex],
          file: reader.result as string,
          namaFile: file.name
        };
        onChange(updatedDokumenList);
      } else {
        // Add new document
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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Dokumen Persyaratan Pinjaman (Opsional)</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Info size={14} />
            {completionPercentage}% Terunggah
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Unggah dokumen pendukung untuk mempercepat proses persetujuan pinjaman
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantDocuments.map((doc) => {
              const uploadedDoc = dokumenList.find(d => d.jenis === doc.jenis);
              const isUploaded = !!uploadedDoc;
              
              return (
                <div key={doc.jenis} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Label className="flex items-center gap-2">
                      <span>{doc.jenis}</span>
                    </Label>
                    {isUploaded ? (
                      <Badge variant="default" className="flex gap-1 bg-green-500">
                        <Check size={14} /> Terunggah
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex gap-1">
                        Opsional
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    {isUploaded ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-1 text-muted-foreground">
                          <FileText size={14} />
                          {uploadedDoc.namaFile}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(uploadedDoc.id)}
                          className="text-destructive"
                        >
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                          className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <Upload size={14} />
                          {uploading === doc.jenis ? "Mengunggah..." : "Unggah Dokumen"}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {dokumenList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Dokumen Terunggah</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Dokumen</TableHead>
                    <TableHead>Nama File</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dokumenList.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.jenis}</TableCell>
                      <TableCell>{doc.namaFile}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(doc.id)}
                          className="text-destructive"
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
