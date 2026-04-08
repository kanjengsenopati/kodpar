
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnggotaKeluarga } from "@/types";
import { User, Phone, MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getBadgeVariantByRelationship } from "@/utils/badgeUtils";

interface KeluargaTableProps {
  keluarga: AnggotaKeluarga[];
  anggotaId?: string;
  readOnly?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function KeluargaTable({ keluarga, anggotaId, readOnly = true, onEdit, onDelete }: KeluargaTableProps) {
  if (!keluarga || keluarga.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Tidak Ada Data Keluarga</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1.5">
          Anggota ini belum memiliki data keluarga.
          {anggotaId && !readOnly && (
            <span> Anda dapat menambahkan data keluarga dengan tombol "Tambah Keluarga" di atas.</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Hubungan</TableHead>
          <TableHead>No. HP</TableHead>
          <TableHead>Alamat</TableHead>
          {!readOnly && <TableHead className="text-right">Aksi</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {keluarga.map((k) => (
          <TableRow key={k.id}>
            <TableCell className="font-medium">{k.nama}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariantByRelationship(k.hubungan)} className="font-normal">
                {k.hubungan}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Phone size={14} className="text-muted-foreground" />
                {k.noHp}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-start gap-1.5">
                <MapPin size={14} className="mt-1 text-muted-foreground" />
                <span className="line-clamp-2">{k.alamat}</span>
              </div>
            </TableCell>
            {!readOnly && onEdit && onDelete && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(k.id)}>
                    <Pencil size={16} className="mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(k.id)}>
                    <Trash2 size={16} className="mr-1" /> Hapus
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
