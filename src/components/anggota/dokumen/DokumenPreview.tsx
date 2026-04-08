
import { AnggotaDokumen } from "@/types";

interface DokumenPreviewProps {
  doc: AnggotaDokumen;
}

export function DokumenPreview({ doc }: DokumenPreviewProps) {
  return (
    <div className="mt-2 max-h-[70vh] overflow-auto">
      {doc.file.includes("data:application/pdf") ? (
        <iframe 
          src={doc.file} 
          className="w-full h-[500px]" 
          title={doc.namaFile} 
        />
      ) : (
        <img 
          src={doc.file} 
          alt={doc.namaFile} 
          className="max-w-full h-auto" 
        />
      )}
    </div>
  );
}
