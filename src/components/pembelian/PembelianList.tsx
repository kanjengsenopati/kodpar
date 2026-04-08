
import { Pembelian } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionGrid } from "@/components/ui/action-grid";

interface PembelianListProps {
  pembelianList: Pembelian[];
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PembelianList({ pembelianList, onViewDetail, onEdit, onDelete }: PembelianListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "proses":
        return <Badge className="bg-blue-500">Proses</Badge>;
      case "dibatalkan":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Transaksi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pemasok</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pembelianList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Tidak ada data pembelian
                </TableCell>
              </TableRow>
            ) : (
              pembelianList.map((pembelian) => (
                <TableRow key={pembelian.id}>
                  <TableCell>{pembelian.nomorTransaksi}</TableCell>
                  <TableCell>{pembelian.tanggal}</TableCell>
                  <TableCell>{pembelian.pemasok}</TableCell>
                  <TableCell>{formatCurrency(pembelian.total)}</TableCell>
                  <TableCell>{getStatusBadge(pembelian.status)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <ActionGrid
                        onView={() => onViewDetail(pembelian.id)}
                        onEdit={() => onEdit(pembelian.id)}
                        onDelete={pembelian.status !== "selesai" ? () => onDelete(pembelian.id) : undefined}
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
      </CardContent>
    </Card>
  );
}
