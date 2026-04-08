
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnggotaDokumen } from "@/types";
import { DokumenForm } from "./DokumenForm";
import { DokumenTable } from "./DokumenTable";
import { useToast } from "@/components/ui/use-toast";

interface DokumenUploadCardProps {
  dokumen: AnggotaDokumen[];
  onDokumenChange: (dokumen: AnggotaDokumen[]) => void;
}

export function DokumenUploadCard({ dokumen, onDokumenChange }: DokumenUploadCardProps) {
  const { toast } = useToast();
  const [previewDokumen, setPreviewDokumen] = useState<string | null>(null);

  const handleUploadSuccess = (newDokumen: AnggotaDokumen) => {
    const updatedDokumen = [...dokumen, newDokumen];
    onDokumenChange(updatedDokumen);
    
    toast({
      title: "Dokumen berhasil diupload",
      description: `${newDokumen.jenis} telah berhasil diupload`,
    });
  };

  const handleDelete = (id: string) => {
    const updatedDokumen = dokumen.filter((doc) => doc.id !== id);
    onDokumenChange(updatedDokumen);
    
    toast({
      title: "Dokumen berhasil dihapus",
    });
  };

  const handlePreview = (doc: AnggotaDokumen) => {
    setPreviewDokumen(doc.file);
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Dokumen Anggota</span>
          {dokumen.length > 0 && (
            <Badge variant="success">{dokumen.length} Dokumen</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <DokumenForm 
          dokumen={dokumen}
          onUploadSuccess={handleUploadSuccess}
        />

        {dokumen.length > 0 && (
          <DokumenTable 
            dokumen={dokumen}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}
      </CardContent>
    </Card>
  );
}
