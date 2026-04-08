import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type LabaRugiReport } from "@/services/akuntansi/laporanService";
import { formatCurrency } from "@/utils/formatters";

interface LabaRugiReportProps {
  data: LabaRugiReport;
}

export function LabaRugiReport({ data }: LabaRugiReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          LAPORAN LABA RUGI
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
              {/* Pendapatan Section */}
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">PENDAPATAN</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.pendapatan.map((item) => (
                <TableRow key={item.coaId}>
                  <TableCell className="pl-6">{item.namaAkun}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Total Pendapatan</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalPendapatan)}</TableCell>
              </TableRow>
              
              {/* Beban Section */}
              <TableRow className="bg-red-50">
                <TableCell className="font-bold">BEBAN</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.beban.map((item) => (
                <TableRow key={item.coaId}>
                  <TableCell className="pl-6">{item.namaAkun}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Total Beban</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalBeban)}</TableCell>
              </TableRow>
              
              {/* Laba Bersih */}
              <TableRow className={`font-bold text-lg border-t-2 ${data.labaBersih >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <TableCell>LABA BERSIH</TableCell>
                <TableCell className="text-right">{formatCurrency(data.labaBersih)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
