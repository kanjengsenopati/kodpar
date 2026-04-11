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
import { Button } from "@/components/ui/button";
import { Transaksi } from "@/types";
import { AlertTriangle, Eye, Edit } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface TunggakanTableProps {
  tunggakan: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[];
}

export function TunggakanTable({ tunggakan }: TunggakanTableProps) {
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
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Keterlambatan</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Denda</TableHead>
            <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tunggakan.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-slate-300" />
                  </div>
                  <Text.Caption className="not-italic">Tidak ada pinjaman yang menunggak</Text.Caption>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tunggakan.map((item) => (
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
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600">
                    {item.daysOverdue} hari
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-red-600 font-bold">
                  {formatCurrency(item.penalty)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
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
