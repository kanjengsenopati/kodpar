import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ArusKasReport } from "@/services/akuntansi/laporanService";
import { formatCurrency } from "@/utils/formatters";

interface ArusKasReportProps {
  data: ArusKasReport;
}

export function ArusKasReport({ data }: ArusKasReportProps) {
  const totalOperasional = data.operasional.reduce((sum, item) => sum + item.jumlah, 0);
  const totalInvestasi = data.investasi.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPendanaan = data.pendanaan.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          LAPORAN ARUS KAS
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
              {/* Kas Awal */}
              <TableRow className="bg-blue-50 font-bold">
                <TableCell>Kas Awal Periode</TableCell>
                <TableCell className="text-right">{formatCurrency(data.kasAwal)}</TableCell>
              </TableRow>
              
              {/* Arus Kas Operasional */}
              <TableRow className="bg-green-50">
                <TableCell className="font-bold">ARUS KAS DARI AKTIVITAS OPERASIONAL</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.operasional.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Arus Kas Bersih dari Aktivitas Operasional</TableCell>
                <TableCell className="text-right">{formatCurrency(totalOperasional)}</TableCell>
              </TableRow>
              
              {/* Arus Kas Investasi */}
              <TableRow className="bg-purple-50">
                <TableCell className="font-bold">ARUS KAS DARI AKTIVITAS INVESTASI</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.investasi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Arus Kas Bersih dari Aktivitas Investasi</TableCell>
                <TableCell className="text-right">{formatCurrency(totalInvestasi)}</TableCell>
              </TableRow>
              
              {/* Arus Kas Pendanaan */}
              <TableRow className="bg-orange-50">
                <TableCell className="font-bold">ARUS KAS DARI AKTIVITAS PENDANAAN</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {data.pendanaan.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t">
                <TableCell>Arus Kas Bersih dari Aktivitas Pendanaan</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPendanaan)}</TableCell>
              </TableRow>
              
              {/* Summary */}
              <TableRow className="font-bold border-t">
                <TableCell>Kenaikan (Penurunan) Kas Bersih</TableCell>
                <TableCell className="text-right">{formatCurrency(data.perubahanKas)}</TableCell>
              </TableRow>
              
              <TableRow className="font-bold text-lg border-t-2 bg-blue-50">
                <TableCell>Kas Akhir Periode</TableCell>
                <TableCell className="text-right">{formatCurrency(data.kasAkhir)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
