import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type PosisiKeuanganReport } from "@/services/akuntansi/laporanService";
import { formatCurrency } from "@/utils/formatters";

interface PosisiKeuanganReportProps {
  data: PosisiKeuanganReport;
}

export function PosisiKeuanganReport({ data }: PosisiKeuanganReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          LAPORAN POSISI KEUANGAN
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
                <TableHead className="w-1/2">ASET</TableHead>
                <TableHead className="text-right">Jumlah (Rp)</TableHead>
                <TableHead className="w-1/2">KEWAJIBAN & EKUITAS</TableHead>
                <TableHead className="text-right">Jumlah (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Assets and Liabilities rows */}
              {Array.from({ 
                length: Math.max(data.aset.length + 1, data.kewajiban.length + data.modal.length + 2) 
              }, (_, index) => {
                const asetItem = data.aset[index];
                const pasivaItems = [...data.kewajiban, ...data.modal];
                const pasivaItem = pasivaItems[index];
                
                return (
                  <TableRow key={index}>
                    {/* Assets column */}
                    <TableCell className={asetItem ? 'pl-4' : ''}>
                      {asetItem ? asetItem.namaAkun : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      {asetItem ? formatCurrency(asetItem.jumlah) : ''}
                    </TableCell>
                    
                    {/* Pasiva column */}
                    <TableCell className={pasivaItem ? 'pl-4' : ''}>
                      {pasivaItem ? pasivaItem.namaAkun : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      {pasivaItem ? formatCurrency(pasivaItem.jumlah) : ''}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* Totals row */}
              <TableRow className="font-bold border-t-2">
                <TableCell>TOTAL ASET</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalAset)}</TableCell>
                <TableCell>TOTAL KEWAJIBAN & EKUITAS</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalKewajiban + data.totalModal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
