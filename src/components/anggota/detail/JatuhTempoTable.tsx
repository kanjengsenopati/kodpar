
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaksi } from "@/types";
import { Clock } from "lucide-react";

interface JatuhTempoTableProps {
  jatuhTempo: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysUntilDue: number;
  }[];
}

export function JatuhTempoTable({ jatuhTempo }: JatuhTempoTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal Pinjam</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Sisa Hari</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jatuhTempo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Clock className="h-8 w-8 text-gray-400" />
                  <p>Tidak ada pinjaman yang akan jatuh tempo</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            jatuhTempo.map((item) => (
              <TableRow key={item.transaksi.id}>
                <TableCell className="font-medium">{item.transaksi.id}</TableCell>
                <TableCell>{formatDate(item.transaksi.tanggal)}</TableCell>
                <TableCell>Rp {item.transaksi.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>{formatDate(item.jatuhTempo)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    item.daysUntilDue <= 7 ? "bg-red-100 text-red-800" : 
                    item.daysUntilDue <= 14 ? "bg-amber-100 text-amber-800" : 
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {item.daysUntilDue} hari
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Akan Jatuh Tempo
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
