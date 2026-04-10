
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRupiah, cn } from "@/lib/utils";
import * as Text from "@/components/ui/text";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  // Pagination Props
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
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
  onDelete,
  currentPage,
  totalPages,
  rowsPerPage,
  totalRecords,
  onPageChange,
  onRowsPerPageChange
}: AnggotaTableViewProps) {
  const visibleColumns = columns.filter(col => col.isVisible);
  const startIndex = (currentPage - 1) * rowsPerPage;

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[60px] text-center">
                <Text.Label className="text-slate-500">No</Text.Label>
              </TableHead>
              {visibleColumns.map((column) => (
                <TableHead key={column.id}>
                  <Text.Label className="text-slate-500">{column.label}</Text.Label>
                </TableHead>
              ))}
              <TableHead className="text-right">
                <Text.Label className="text-slate-500">Aksi</Text.Label>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anggotaList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} className="h-32 text-center">
                  <Text.Body className="text-slate-400">Tidak ada data ditemukan</Text.Body>
                </TableCell>
              </TableRow>
            ) : (
              anggotaList.map((anggota, index) => (
                <TableRow key={anggota.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-400 text-xs">
                    {startIndex + index + 1}
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="py-2.5">
                      {column.id === "id" && <Text.Caption className="not-italic font-bold text-slate-400">{anggota.id}</Text.Caption>}
                      {column.id === "nama" && <Text.Body className="font-bold text-slate-800">{anggota.nama}</Text.Body>}
                      {column.id === "nip" && <Text.Body className="text-xs">{anggota.nip}</Text.Body>}
                      {column.id === "noHp" && <Text.Body className="text-xs">{anggota.noHp}</Text.Body>}
                      {column.id === "unitKerja" && <Text.Body className="text-[13px]">{anggota.unitKerja}</Text.Body>}
                      {column.id === "jenisKelamin" && <Text.Body className="text-xs">{anggota.jenisKelamin}</Text.Body>}
                      {column.id === "status" && (
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          anggota.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                        )}>
                          {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </div>
                      )}
                      {column.id === "totalSimpanan" && <Text.Amount className="text-sm">{formatRupiah(getTotalSimpanan(anggota.id))}</Text.Amount>}
                      {column.id === "totalPinjaman" && <Text.Amount className="text-sm text-blue-600">{formatRupiah(getTotalPinjaman(anggota.id))}</Text.Amount>}
                      {column.id === "totalSHU" && <Text.Amount className="text-sm text-purple-600">{formatRupiah(getTotalSHU(anggota.id))}</Text.Amount>}
                      {column.id === "petugas" && <Text.Body className="text-xs">{getPetugas(anggota.id)}</Text.Body>}
                      {column.id === "tanggalBergabung" && <Text.Body className="text-xs">{anggota.tanggalBergabung && new Date(anggota.tanggalBergabung).toLocaleDateString('id-ID')}</Text.Body>}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onViewDetail(anggota.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        asChild
                      >
                        <Link to={`/master/anggota/edit/${anggota.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(anggota)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30 rounded-b-[24px]">
        <div className="flex items-center gap-4">
          <Text.Caption className="not-italic text-slate-400">
            Menampilkan <span className="font-bold text-slate-600">{Math.min(totalRecords, startIndex + 1)}</span> - <span className="font-bold text-slate-600">{Math.min(totalRecords, startIndex + rowsPerPage)}</span> dari <span className="font-bold text-slate-600">{totalRecords}</span> anggota
          </Text.Caption>
          
          <div className="flex items-center gap-2">
            <Text.Caption className="not-italic text-slate-400 whitespace-nowrap">Baris per halaman:</Text.Caption>
            <Select 
              value={rowsPerPage.toString()} 
              onValueChange={(val) => onRowsPerPageChange(parseInt(val))}
            >
              <SelectTrigger className="h-8 w-16 rounded-lg border-slate-100 bg-white text-[11px] font-bold">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-100 bg-white shadow-sm disabled:opacity-30 disabled:bg-slate-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </Button>
          
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Simple pagination logic for 5 pages around current
              let pageNum = currentPage;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  className={cn(
                    "h-8 w-8 rounded-lg font-bold text-xs p-0 transition-all",
                    currentPage === pageNum 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                      : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  )}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-100 bg-white shadow-sm disabled:opacity-30 disabled:bg-slate-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
