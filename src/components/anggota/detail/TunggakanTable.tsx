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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tanggal Pinjam</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Keterlambatan</TableHead>
            <TableHead>Denda</TableHead>
            <TableHead className="text-center w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tunggakan.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-gray-400" />
                  <p>Tidak ada pinjaman yang menunggak</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tunggakan.map((item) => (
              <TableRow key={item.transaksi.id}>
                <TableCell className="font-medium">{item.transaksi.id}</TableCell>
                <TableCell>{formatDate(item.transaksi.tanggal)}</TableCell>
                <TableCell>Rp {item.transaksi.jumlah.toLocaleString("id-ID")}</TableCell>
                <TableCell>{formatDate(item.jatuhTempo)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800`}>
                    {item.daysOverdue} hari
                  </span>
                </TableCell>
                <TableCell>Rp {item.penalty.toLocaleString("id-ID")}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 gap-1 w-fit">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {/* Handle view action */}}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {/* Handle edit action */}}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
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
