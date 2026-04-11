
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { extractLoanInfo, formatLoanDisplay } from "@/utils/loanDataSync";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";
import * as Text from "@/components/ui/text";

interface TransactionTableProps {
  transaksi: Transaksi[];
}

export function TransactionTable({ transaksi }: TransactionTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  // Function to determine transaction type display with loan details
  const renderTransactionType = (tr: Transaksi) => {
    if (tr.jenis === "Simpan") {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/50">
          {getCategoryNameSync(tr.kategori)}
        </span>
      );
    } else if (tr.jenis === "Pinjam") {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
          {getCategoryNameSync(tr.kategori)}
        </span>
      );
    } else {
      const cls = tr.jenis === "Angsuran" ? "bg-purple-50 text-purple-600 border-purple-100/50" : "bg-slate-50 text-slate-600 border-slate-100/50";
      return (
        <span className={cn("inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", cls)}>
          {tr.jenis}
        </span>
      );
    }
  };

  // Enhanced function to render loan information
  const renderLoanInfo = (tr: Transaksi) => {
    if (tr.jenis !== "Pinjam") return null;

    const loanInfo = extractLoanInfo(tr);
    if (!loanInfo) return null;

    const displayInfo = formatLoanDisplay(loanInfo);

    return (
      <div className="text-xs text-gray-600 mt-1">
        <div>Tenor: {displayInfo.tenor}</div>
        <div>Bunga: {displayInfo.sukuBunga}</div>
        <div>Angsuran/Bulan: {displayInfo.angsuranPerBulan}</div>
      </div>
    );
  };

  // Enhanced function to render installment information
  const renderInstallmentInfo = (tr: Transaksi) => {
    if (tr.jenis !== "Angsuran") return null;

    // Extract loan ID from keterangan
    const loanMatch = tr.keterangan?.match(/Pinjaman: (TR\d+)/);
    if (!loanMatch) return null;

    // Extract installment details from keterangan
    const pokokMatch = tr.keterangan?.match(/Pokok: Rp ([\d,.]+)/);
    const jasaMatch = tr.keterangan?.match(/Jasa: Rp ([\d,.]+)/);

    return (
      <div className="text-xs text-gray-600 mt-1">
        <div>ID Pinjaman: {loanMatch[1]}</div>
        {pokokMatch && <div>Pokok: Rp {pokokMatch[1]}</div>}
        {jasaMatch && <div>Jasa: Rp {jasaMatch[1]}</div>}
      </div>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaksi.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <Text.Caption className="not-italic">Tidak ada data transaksi yang ditemukan</Text.Caption>
              </TableCell>
            </TableRow>
          ) : (
            transaksi.map((tr) => (
              <TableRow key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <Text.Caption className="not-italic font-bold text-slate-400 font-mono text-[9px] uppercase tracking-tighter">
                      SYS: {tr.id.substring(0, 8)}...
                    </Text.Caption>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Text.Body className="text-xs text-nowrap">{formatDate(tr.tanggal)}</Text.Body>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    {renderTransactionType(tr)}
                    {renderLoanInfo(tr)}
                    {renderInstallmentInfo(tr)}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Text.Amount className="text-xs font-bold leading-none">
                    {formatCurrency(tr.jumlah)}
                  </Text.Amount>
                </TableCell>
                <TableCell className="py-3 max-w-[200px]">
                  <Text.Caption className="not-italic text-slate-500 line-clamp-2 leading-relaxed">
                    {tr.keterangan || "-"}
                  </Text.Caption>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    tr.status === "Sukses" ? "bg-emerald-50 text-emerald-600" : 
                    tr.status === "Pending" ? "bg-yellow-50 text-yellow-600" : 
                    "bg-red-50 text-red-600"
                  )}>
                    {tr.status}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
