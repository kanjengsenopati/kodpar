
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NeracaItem {
  label: string;
  amount: number;
  indented?: boolean;
  isTotal?: boolean;
}

interface NeracaTableProps {
  title: string;
  items: {
    assets: NeracaItem[];
    liabilities: NeracaItem[];
  };
  totalAssets: number;
  totalLiabilities: number;
  saldoAwal: number;
  saldoAkhir: number;
}

export default function NeracaTable({ 
  title, 
  items, 
  totalAssets, 
  totalLiabilities,
  saldoAwal,
  saldoAkhir 
}: NeracaTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Jumlah (Rp)</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Jumlah (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="font-bold">AKTIVA</TableCell>
                <TableCell colSpan={2} className="font-bold">PASIVA</TableCell>
              </TableRow>
              
              {/* Create rows of data, pairing assets and liabilities */}
              {Array.from({ length: Math.max(items.assets.length, items.liabilities.length) }, (_, index) => (
                <TableRow key={index}>
                  {/* Assets column */}
                  {index < items.assets.length ? (
                    <>
                      <TableCell className={`
                        ${items.assets[index].indented ? 'pl-8' : ''} 
                        ${items.assets[index].isTotal ? 'font-bold' : ''}
                      `}>
                        {items.assets[index].label}
                      </TableCell>
                      <TableCell className={`text-right ${items.assets[index].isTotal ? 'font-bold' : ''}`}>
                        {formatCurrency(items.assets[index].amount)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
                  
                  {/* Liabilities column */}
                  {index < items.liabilities.length ? (
                    <>
                      <TableCell className={`
                        ${items.liabilities[index].indented ? 'pl-8' : ''} 
                        ${items.liabilities[index].isTotal ? 'font-bold' : ''}
                      `}>
                        {items.liabilities[index].label}
                      </TableCell>
                      <TableCell className={`text-right ${items.liabilities[index].isTotal ? 'font-bold' : ''}`}>
                        {formatCurrency(items.liabilities[index].amount)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              
              {/* Totals row */}
              <TableRow className="font-bold bg-gray-50">
                <TableCell>TOTAL AKTIVA</TableCell>
                <TableCell className="text-right">{formatCurrency(totalAssets)}</TableCell>
                <TableCell>TOTAL PASIVA</TableCell>
                <TableCell className="text-right">{formatCurrency(totalLiabilities)}</TableCell>
              </TableRow>
              
              {/* Balance summary */}
              <TableRow className="bg-blue-50">
                <TableCell colSpan={2} className="font-medium">Saldo Awal</TableCell>
                <TableCell colSpan={2} className="text-right font-medium">{formatCurrency(saldoAwal)}</TableCell>
              </TableRow>
              <TableRow className={saldoAkhir >= saldoAwal ? "bg-green-50" : "bg-red-50"}>
                <TableCell colSpan={2} className="font-bold">Saldo Akhir</TableCell>
                <TableCell colSpan={2} className="text-right font-bold">{formatCurrency(saldoAkhir)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
