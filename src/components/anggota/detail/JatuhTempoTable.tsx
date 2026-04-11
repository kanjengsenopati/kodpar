
import { cn } from "@/lib/utils";
import * as Text from "@/components/ui/text";
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
import { formatCurrency } from "@/utils/formatters";

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
    <div className="overflow-x-auto rounded-[24px] border border-slate-100 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="border-slate-50">
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Pinjam</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Jumlah</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Jatuh Tempo</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sisa Hari</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jatuhTempo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-slate-300" />
                  </div>
                  <Text.Caption className="not-italic">Tidak ada pinjaman yang akan jatuh tempo</Text.Caption>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            jatuhTempo.map((item) => (
              <TableRow key={item.transaksi.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <Text.Caption className="not-italic font-mono text-[9px] text-slate-400 opacity-60">
                    SYS: {item.transaksi.id.substring(0, 8)}...
                  </Text.Caption>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Text.Body className="text-xs">{formatDate(item.transaksi.tanggal)}</Text.Body>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Text.Amount className="text-sm font-bold">{formatCurrency(item.transaksi.jumlah)}</Text.Amount>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Text.Body className="text-xs font-semibold text-slate-700">{formatDate(item.jatuhTempo)}</Text.Body>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.daysUntilDue <= 7 ? "bg-red-50 text-red-600" : 
                    item.daysUntilDue <= 14 ? "bg-yellow-50 text-yellow-600" : 
                    "bg-blue-50 text-blue-600"
                  )}>
                    {item.daysUntilDue} hari
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                    Akan Datang
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
