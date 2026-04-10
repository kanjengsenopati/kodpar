
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaksi } from "@/types";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ActionGrid } from "@/components/ui/action-grid";
import * as Text from "@/components/ui/text";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { usePagination } from "@/hooks/ui/usePagination";

interface TransaksiTableProps {
  data: Transaksi[];
  columns: Array<{id: string; label: string; isVisible: boolean}>;
  type: "simpan" | "pinjam" | "angsuran" | "penarikan";
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function TransaksiTable({ 
  data, 
  columns, 
  type, 
  onDelete, 
  emptyMessage = "Tidak ada data yang ditemukan" 
}: TransaksiTableProps) {
  const visibleColumns = columns.filter(col => col.isVisible);
  
  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Sukses":
        return "bg-emerald-50 text-emerald-600";
      case "Pending":
        return "bg-yellow-50 text-yellow-600";
      case "Gagal":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-400";
    }
  };

  const getJenisBadgeColor = (jenis: string) => {
    switch (jenis) {
      case "Simpan":
        return "bg-blue-50 text-blue-600";
      case "Pinjam":
        return "bg-amber-50 text-amber-600";
      case "Angsuran":
        return "bg-purple-50 text-purple-600";
      case "Penarikan":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-400";
    }
  };

  return (
    <div className="flex flex-col">
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} className="h-32 text-center">
                  <Text.Body className="text-slate-400">{emptyMessage}</Text.Body>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((transaksi, index) => (
                <TableRow key={transaksi.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-400 text-xs">
                    {startIndex + index + 1}
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="py-2.5">
                      {column.id === "id" && <Text.Caption className="not-italic font-bold text-slate-400">{transaksi.nomorTransaksi || (transaksi.id.length > 10 ? transaksi.id.substring(0,8) + "..." : transaksi.id)}</Text.Caption>}
                      {column.id === "tanggal" && <Text.Body className="text-xs">{formatDate(transaksi.tanggal)}</Text.Body>}
                      {column.id === "anggota" && <Text.Body className="font-bold text-slate-800">{transaksi.anggotaNama}</Text.Body>}
                      {column.id === "jenis" && (
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getJenisBadgeColor(transaksi.jenis)}`}>
                          {transaksi.jenis}
                        </div>
                      )}
                      {column.id === "jumlah" && <Text.Amount className="text-sm">{formatCurrency(transaksi.jumlah)}</Text.Amount>}
                      {column.id === "status" && (
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(transaksi.status)}`}>
                          {transaksi.status}
                        </div>
                      )}
                      {column.id === "keterangan" && (
                        <Text.Body className="text-xs text-slate-500 truncate max-w-[150px]">
                          {transaksi.keterangan || "-"}
                        </Text.Body>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionGrid
                        onView={() => window.location.href = `/transaksi/${type}/${transaksi.id}`}
                        onEdit={() => window.location.href = `/transaksi/${type}/edit/${transaksi.id}`}
                        onDelete={() => onDelete(transaksi.id)}
                        layout="grid"
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
        label="transaksi"
        className="rounded-b-[24px]"
      />
    </div>
  );
}
