
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, CircleMinus } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { AngsuranDetailItem } from "./types";
import { TransactionStatusBadge } from "@/components/transaksi/TransactionStatusBadge";

interface AngsuranTableProps {
  angsuranDetails: AngsuranDetailItem[];
  selectedPinjaman: string;
  onBayarAngsuran: (pinjamanId: string) => void;
  onPayWithSimpanan: (angsuran: AngsuranDetailItem) => void;
  simpananBalance: number;
  disableSelfPayment?: boolean;
}

export function AngsuranTable({
  angsuranDetails,
  selectedPinjaman,
  onBayarAngsuran,
  onPayWithSimpanan,
  simpananBalance,
  disableSelfPayment = false,
}: AngsuranTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (!angsuranDetails || angsuranDetails.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Tidak ada data angsuran untuk pinjaman ini</p>
      </div>
    );
  }

  // Get the first unpaid installment
  const unpaidInstallment = angsuranDetails.find(
    (item) => item.status === "belum-bayar" || item.status === "terlambat" || item.status === "belum-terbayar"
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Daftar Angsuran</h3>
        
        {!disableSelfPayment && unpaidInstallment && (
          <Button 
            onClick={() => onBayarAngsuran(selectedPinjaman)}
            size="sm"
            variant="outline"
          >
            Bayar Angsuran
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Angsuran Ke</TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Bayar</TableHead>
              <TableHead>Petugas</TableHead>
              {!disableSelfPayment && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {angsuranDetails.map((angsuran, index) => {
              const isLate = angsuran.status === "terlambat";
              const isFullyPaid = angsuran.status === "lunas" || angsuran.status === "bayar-lengkap";
              const isPartiallyPaid = angsuran.status === "bayar-sebagian";
              const isUnpaid = angsuran.status === "belum-bayar" || angsuran.status === "belum-terbayar";
              
              return (
                <TableRow 
                  key={index}
                  className={isLate ? "bg-red-50" : ""}
                >
                  <TableCell>{angsuran.angsuranKe}</TableCell>
                  <TableCell>
                    {angsuran.jatuhTempo ? formatDate(angsuran.jatuhTempo) : "-"}
                  </TableCell>
                  <TableCell>
                    {angsuran.jumlah !== undefined && angsuran.jumlah !== null 
                      ? `Rp ${angsuran.jumlah.toLocaleString("id-ID")}`
                      : "Rp 0"}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={angsuran.status} />
                  </TableCell>
                  <TableCell>
                    {(isFullyPaid || isPartiallyPaid) && angsuran.tanggalBayar
                      ? formatDate(angsuran.tanggalBayar)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {(isFullyPaid || isPartiallyPaid) && angsuran.petugas ? angsuran.petugas : "-"}
                  </TableCell>
                  {!disableSelfPayment && (
                    <TableCell className="text-right">
                      {!isFullyPaid && 
                       simpananBalance !== undefined && 
                       angsuran.jumlah !== undefined &&
                       simpananBalance >= angsuran.jumlah && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPayWithSimpanan(angsuran)}
                        >
                          Bayar dari Simpanan
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
