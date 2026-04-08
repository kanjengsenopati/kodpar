
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmptyTransactionAlertProps {
  isEmpty: boolean;
  isFiltered: boolean;
}

export function EmptyTransactionAlert({ isEmpty, isFiltered }: EmptyTransactionAlertProps) {
  if (isEmpty) {
    return (
      <Alert>
        <AlertDescription>
          Belum ada data transaksi penjualan.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isFiltered) {
    return (
      <Alert>
        <AlertDescription>
          Tidak ada transaksi yang cocok dengan filter atau pencarian Anda.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}
