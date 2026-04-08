
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { extractLoanInfo, formatLoanDisplay } from "@/utils/loanDataSync";

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
      const jenisSimpanan = tr.kategori || 
                          (tr.keterangan?.includes("Pokok") ? "Simpanan Pokok" :
                           tr.keterangan?.includes("Wajib") ? "Simpanan Wajib" : "Simpanan Sukarela");
      
      return (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          {jenisSimpanan}
        </span>
      );
    } else if (tr.jenis === "Pinjam") {
      const jenisPinjaman = tr.kategori || "Pinjaman Reguler";
      
      return (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
          {jenisPinjaman}
        </span>
      );
    } else {
      return (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
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
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            transaksi.map((tr) => (
              <TableRow key={tr.id}>
                <TableCell className="font-medium">{tr.id}</TableCell>
                <TableCell>{formatDate(tr.tanggal)}</TableCell>
                <TableCell>
                  <div>
                    {renderTransactionType(tr)}
                    {renderLoanInfo(tr)}
                    {renderInstallmentInfo(tr)}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(tr.jumlah)}</TableCell>
                <TableCell>{tr.keterangan || "-"}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tr.status === "Sukses" ? "bg-green-100 text-green-800" : 
                    tr.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {tr.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
