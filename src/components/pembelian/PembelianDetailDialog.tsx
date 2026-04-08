import { Pembelian } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PembelianDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPembelian: Pembelian | null;
  onComplete: () => void;
}

export function PembelianDetailDialog({
  isOpen,
  onClose,
  currentPembelian,
  onComplete,
}: PembelianDetailDialogProps) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detail Pembelian</DialogTitle>
        </DialogHeader>

        {currentPembelian && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Nomor Transaksi</p>
                <p className="font-medium">{currentPembelian.nomorTransaksi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium">{currentPembelian.tanggal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pemasok</p>
                <p className="font-medium">{currentPembelian.pemasok}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div>{getStatusBadge(currentPembelian.status)}</div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Harga Satuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPembelian.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.produkNama}</TableCell>
                      <TableCell className="text-right">{item.jumlah}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.hargaSatuan)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between">
                <p className="text-sm">Subtotal</p>
                <p>{formatCurrency(currentPembelian.subtotal)}</p>
              </div>
              {currentPembelian.diskon && (
                <div className="flex justify-between">
                  <p className="text-sm">Diskon</p>
                  <p>-{formatCurrency(currentPembelian.diskon)}</p>
                </div>
              )}
              {currentPembelian.ppn && (
                <div className="flex justify-between">
                  <p className="text-sm">PPN</p>
                  <p>{formatCurrency(currentPembelian.ppn)}</p>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <p>Total</p>
                <p>{formatCurrency(currentPembelian.total)}</p>
              </div>
            </div>

            {currentPembelian.catatan && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Catatan</p>
                <p>{currentPembelian.catatan}</p>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          {currentPembelian && currentPembelian.status === "proses" && (
            <Button onClick={onComplete}>
              <Check className="h-4 w-4 mr-2" /> Selesaikan Pembelian
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
