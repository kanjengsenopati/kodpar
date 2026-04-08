
import { Penjualan } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { ActionGrid } from "@/components/ui/action-grid";

interface PenjualanTableProps {
  penjualanList: Penjualan[];
  getKasirName: (kasirId: string) => string;
  onViewDetail: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export function PenjualanTable({
  penjualanList,
  getKasirName,
  onViewDetail,
  onDeleteClick
}: PenjualanTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Transaksi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penjualanList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Tidak ada data transaksi yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            penjualanList.map((penjualan) => (
              <TableRow key={penjualan.id}>
                <TableCell className="font-medium">{penjualan.nomorTransaksi}</TableCell>
                <TableCell>{formatDateTime(penjualan.tanggal)}</TableCell>
                <TableCell>{getKasirName(penjualan.kasirId)}</TableCell>
                <TableCell>{penjualan.items.reduce((sum, item) => sum + item.jumlah, 0)} items</TableCell>
                <TableCell>{formatRupiah(penjualan.total)}</TableCell>
                <TableCell>
                  {penjualan.metodePembayaran === "cash" ? "Tunai" :
                  penjualan.metodePembayaran === "debit" ? "Debit" :
                  penjualan.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    penjualan.status === "sukses" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <ActionGrid
                      onView={() => onViewDetail(penjualan.id)}
                      onDelete={() => onDeleteClick(penjualan.id)}
                    />
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
