import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type PerubahanModalReport } from "@/services/akuntansi/laporanService";
import { formatCurrency } from "@/utils/formatters";

interface PerubahanModalReportProps {
  data: PerubahanModalReport;
}

export function PerubahanModalReport({ data }: PerubahanModalReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          LAPORAN PERUBAHAN MODAL
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Periode: {data.periode}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Jumlah (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Modal Awal */}
              <TableRow className="bg-blue-50 font-bold">
                <TableCell>Modal Awal Periode</TableCell>
                <TableCell className="text-right">{formatCurrency(data.modalAwal)}</TableCell>
              </TableRow>
              
              {/* Penambahan Modal */}
              <TableRow className="bg-green-50">
                <TableCell className="font-bold">PENAMBAHAN</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.penambahan.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Total Penambahan</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalPenambahan)}</TableCell>
              </TableRow>
              
              {/* Pengurangan Modal */}
              <TableRow className="bg-red-50">
                <TableCell className="font-bold">PENGURANGAN</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.pengurangan.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Total Pengurangan</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalPengurangan)}</TableCell>
              </TableRow>
              
              {/* Modal Akhir */}
              <TableRow className="font-bold text-lg border-t-2 bg-blue-50">
                <TableCell>MODAL AKHIR PERIODE</TableCell>
                <TableCell className="text-right">{formatCurrency(data.modalAkhir)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
