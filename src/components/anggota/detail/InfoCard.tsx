
import { Card, CardContent } from "@/components/ui/card";
import { Anggota } from "@/types";
import { Badge } from "@/components/ui/badge";
import { File, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface InfoCardProps {
  anggota: Anggota;
}

export function InfoCard({ anggota }: InfoCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">NIP</h3>
              <p>{anggota.nip}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Jenis Kelamin</h3>
              <p>{anggota.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Agama</h3>
              <p>{anggota.agama}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Unit Kerja</h3>
            <p>{anggota.unitKerja || "-"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Dokumen</h3>
            <div className="flex flex-wrap gap-2">
              {anggota.dokumen && anggota.dokumen.length > 0 ? (
                anggota.dokumen.map((doc) => (
                  <Dialog key={doc.id}>
                    <DialogTrigger asChild>
                      <Badge 
                        variant={doc.jenis === "KTP" || doc.jenis === "KK" ? "info" : "success"} 
                        className="cursor-pointer hover:bg-accent flex gap-1.5 items-center py-1.5"
                      >
                        <File size={14} /> {doc.jenis}
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Dokumen {doc.jenis}</DialogTitle>
                      </DialogHeader>
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
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                  <File size={16} className="text-muted-foreground/70" />
                  <span>Tidak ada dokumen tersedia</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Data Keluarga</h3>
            {anggota.keluarga && anggota.keluarga.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {anggota.keluarga.map((k) => (
                  <div key={k.id} className="border p-3 rounded-md flex items-center gap-2">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      <User size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{k.nama}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {k.hubungan}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <User size={16} className="text-muted-foreground/70" />
                <span>Tidak ada data keluarga</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
