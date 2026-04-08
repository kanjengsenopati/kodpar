
import { AnggotaKeluarga } from "@/types";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { getBadgeVariantByRelationship } from "@/utils/badgeUtils";

interface KeluargaDataTableProps {
  keluarga: AnggotaKeluarga[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KeluargaDataTable({ keluarga, onEdit, onDelete }: KeluargaDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Hubungan</TableHead>
          <TableHead>No. HP</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keluarga.map((k) => (
          <TableRow key={k.id}>
            <TableCell className="font-medium">{k.nama}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariantByRelationship(k.hubungan)}>
                {k.hubungan}
              </Badge>
            </TableCell>
            <TableCell>{k.noHp}</TableCell>
            <TableCell className="max-w-[200px] truncate">{k.alamat}</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
