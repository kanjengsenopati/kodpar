
import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenjualanItem } from "@/types";

interface ItemsTableProps {
  items: PenjualanItem[];
  subtotal: number;
  getProductName: (productId: string) => string;
  getProductCode?: (productId: string) => string;
}

export function ItemsTable({ items, subtotal, getProductName, getProductCode }: ItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Item Pembelian</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getProductName(item.produkId)}</div>
                      {getProductCode && (
                        <div className="text-xs text-muted-foreground">
                          {getProductCode(item.produkId)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatRupiah(item.hargaSatuan)}</TableCell>
                  <TableCell className="text-right">{item.jumlah}</TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(item.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatRupiah(subtotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
