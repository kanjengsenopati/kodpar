
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnggotaDokumen } from "@/types";
import { DokumenPreview } from "./DokumenPreview";

interface DokumenTableProps {
  dokumen: AnggotaDokumen[];
  onDelete: (id: string) => void;
  onPreview: (doc: AnggotaDokumen) => void;
}

export function DokumenTable({ dokumen, onDelete, onPreview }: DokumenTableProps) {
  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis</TableHead>
            <TableHead>Nama File</TableHead>
            <TableHead>Tanggal Upload</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dokumen.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <Badge variant={doc.jenis === "KTP" || doc.jenis === "KK" ? "info" : "success"}>
                  {doc.jenis}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{doc.namaFile}</TableCell>
              <TableCell>{new Date(doc.tanggalUpload).toLocaleDateString("id-ID")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => onPreview(doc)}>
                        <File size={16} className="mr-1" /> Lihat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Dokumen {doc.jenis}</DialogTitle>
                      </DialogHeader>
                      <DokumenPreview doc={doc} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(doc.id)}>
                    <Trash2 size={16} className="mr-1" /> Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
