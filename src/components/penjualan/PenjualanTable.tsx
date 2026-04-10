
import { Penjualan } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { ActionGrid } from "@/components/ui/action-grid";
import * as Text from "@/components/ui/text";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { usePagination } from "@/hooks/ui/usePagination";

interface PenjualanTableProps {
  penjualanList: Penjualan[];
  getKasirName: (kasirId: string) => string;
  onViewDetail: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export function PenjualanTable({
  penjualanList,
  getKasirName,
  onViewDetail,
  onDeleteClick
}: PenjualanTableProps) {
  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data: penjualanList || [] });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[60px] text-center">
                <Text.Label className="text-slate-500">No</Text.Label>
              </TableHead>
              <TableHead><Text.Label className="text-slate-500">No Transaksi</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Tanggal</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Kasir</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Total</Text.Label></TableHead>
              <TableHead><Text.Label className="text-slate-500">Status</Text.Label></TableHead>
              <TableHead className="text-right"><Text.Label className="text-slate-500">Aksi</Text.Label></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Text.Body className="text-slate-400">Tidak ada data transaksi yang ditemukan</Text.Body>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((penjualan, index) => (
                <TableRow key={penjualan.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-400 text-xs">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <Text.Caption className="not-italic font-bold text-slate-400">{penjualan.nomorTransaksi}</Text.Caption>
                  </TableCell>
                  <TableCell>
                    <Text.Body className="text-xs">{formatDateTime(penjualan.tanggal)}</Text.Body>
                  </TableCell>
                  <TableCell>
                    <Text.Body className="font-bold text-slate-800">{getKasirName(penjualan.kasirId)}</Text.Body>
                  </TableCell>
                  <TableCell>
                    <Text.Amount className="text-sm">{formatRupiah(penjualan.total)}</Text.Amount>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      penjualan.status === "sukses" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {penjualan.status === "sukses" ? "Sukses" : "Batal"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionGrid
                        onView={() => onViewDetail(penjualan.id)}
                        onDelete={() => onDeleteClick(penjualan.id)}
                        compact={true}
                      />
                    </div>
                  </TableCell>
                </TableRow>
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
        label="penjualan"
        className="rounded-b-[24px]"
      />
    </div>
  );
}
