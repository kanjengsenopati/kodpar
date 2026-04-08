
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRupiah } from "@/lib/utils";

interface Column {
  id: string;
  label: string;
  isVisible: boolean;
}

interface AnggotaTableViewProps {
  anggotaList: any[];
  columns: Column[];
  getTotalSimpanan: (anggotaId: string) => number;
  getTotalPinjaman: (anggotaId: string) => number;
  getTotalSHU: (anggotaId: string) => number;
  getPetugas: (petugasId: string) => string;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (anggota: any) => void;
}

export function AnggotaTableView({
  anggotaList,
  columns,
  getTotalSimpanan,
  getTotalPinjaman,
  getTotalSHU,
  getPetugas,
  onViewDetail,
  onEdit,
  onDelete
}: AnggotaTableViewProps) {
  const visibleColumns = columns.filter(col => col.isVisible);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.id}>{column.label}</TableHead>
            ))}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anggotaList.map((anggota) => (
            <TableRow key={anggota.id}>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  {column.id === "id" && anggota.id}
                  {column.id === "nama" && anggota.nama}
                  {column.id === "nip" && anggota.nip}
                  {column.id === "noHp" && anggota.noHp}
                  {column.id === "unitKerja" && anggota.unitKerja}
                  {column.id === "jenisKelamin" && anggota.jenisKelamin}
                  {column.id === "status" && (
                    <Badge variant={anggota.status === "active" ? "default" : "secondary"}>
                      {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  )}
                  {column.id === "totalSimpanan" && formatRupiah(getTotalSimpanan(anggota.id))}
                  {column.id === "totalPinjaman" && formatRupiah(getTotalPinjaman(anggota.id))}
                  {column.id === "totalSHU" && formatRupiah(getTotalSHU(anggota.id))}
                  {column.id === "petugas" && getPetugas(anggota.id)}
                  {column.id === "tanggalBergabung" && anggota.tanggalBergabung && new Date(anggota.tanggalBergabung).toLocaleDateString('id-ID')}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(anggota.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/master/anggota/edit/${anggota.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(anggota)}
                  >
                    <Trash2 className="h-4 w-4" />
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
