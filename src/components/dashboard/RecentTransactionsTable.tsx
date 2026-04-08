
import { formatCurrency } from "@/utils/formatters";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaksi } from "@/types";

interface RecentTransactionsTableProps {
  transactions: Transaksi[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Anggota</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaksi) => (
          <TableRow key={transaksi.id}>
            <TableCell className="font-medium">{transaksi.id}</TableCell>
            <TableCell>{new Date(transaksi.tanggal).toLocaleDateString("id-ID")}</TableCell>
            <TableCell>{transaksi.anggotaNama}</TableCell>
            <TableCell>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                "bg-blue-100 text-blue-800"
              }`}>
                {transaksi.jenis}
              </span>
            </TableCell>
            <TableCell>{formatCurrency(transaksi.jumlah)}</TableCell>
            <TableCell>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-800"
              }`}>
                {transaksi.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">Tidak ada transaksi terbaru</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
