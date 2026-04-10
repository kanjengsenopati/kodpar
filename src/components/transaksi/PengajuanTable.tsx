
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pengajuan } from "@/types";
import { ExpandablePengajuanRow } from "./ExpandablePengajuanRow";
import * as Text from "@/components/ui/text";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { usePagination } from "@/hooks/ui/usePagination";

interface PengajuanTableProps {
  pengajuan: Pengajuan[];
  onDelete: (id: string) => void;
}

export function PengajuanTable({ pengajuan, onDelete }: PengajuanTableProps) {
  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data: pengajuan || [] });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[60px] text-center">
                <Text.Label className="text-slate-500">No</Text.Label>
              </TableHead>
              <TableHead className="w-8" />
              <TableHead><Text.Label className="text-slate-500">ID</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Tanggal</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Anggota</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Jenis</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Jumlah</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Status</Text.Label></TableHead>
              <TableHead className="text-right"><Text.Label className="text-slate-500">Aksi</Text.Label></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <Text.Body className="text-slate-400">Tidak ada data pengajuan</Text.Body>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <ExpandablePengajuanRow
                  key={item.id}
                  item={item}
                  onDelete={onDelete}
                  colSpan={8}
                  index={startIndex + index + 1}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <TablePaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        startIndex={startIndex}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        label="pengajuan"
        className="rounded-b-[24px]"
      />
    </div>
  );
}
