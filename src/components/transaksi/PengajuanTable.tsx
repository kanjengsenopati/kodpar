
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pengajuan } from "@/types";
import { ExpandablePengajuanRow } from "./ExpandablePengajuanRow";

interface PengajuanTableProps {
  pengajuan: Pengajuan[];
  onDelete: (id: string) => void;
}

export function PengajuanTable({ pengajuan, onDelete }: PengajuanTableProps) {
  if (pengajuan.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada data pengajuan
      </div>
    );
  }

  const headers = ["ID", "Tanggal", "Anggota", "Jenis", "Jumlah", "Status", "Aksi"];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          {headers.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pengajuan.map((item) => (
          <ExpandablePengajuanRow
            key={item.id}
            item={item}
            onDelete={onDelete}
            colSpan={headers.length}
          />
        ))}
      </TableBody>
    </Table>
  );
}
