
import { Penjualan } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatRupiah } from "@/lib/utils";
import { ActionGrid } from "@/components/ui/action-grid";

interface TransactionTableProps {
  transactions: Penjualan[];
  formatPaymentMethod: (method: string) => string;
  onViewTransaction: (id: string) => void;
  onCancelTransaction: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({
  transactions,
  formatPaymentMethod,
  onViewTransaction,
  onCancelTransaction,
  onDeleteTransaction,
}: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor Transaksi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Pembayaran</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              Tidak ada data transaksi yang ditemukan
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.nomorTransaksi}</TableCell>
              <TableCell>
                {new Date(transaction.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>{formatRupiah(transaction.total)}</TableCell>
              <TableCell>{formatPaymentMethod(transaction.metodePembayaran)}</TableCell>
              <TableCell>
                <TransactionStatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <ActionGrid 
                    onView={() => onViewTransaction(transaction.id)}
                    onDelete={() => onDeleteTransaction(transaction.id)}
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
  );
}
