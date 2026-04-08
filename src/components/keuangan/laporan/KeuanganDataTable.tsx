
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PemasukanPengeluaran } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils';
import { FileText, TrendingUp, TrendingDown } from 'lucide-react';

interface KeuanganDataTableProps {
  data: PemasukanPengeluaran[];
  loading: boolean;
}

export function KeuanganDataTable({ data, loading }: KeuanganDataTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
            <p className="text-gray-500">Tidak ada transaksi pada periode yang dipilih</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detail Transaksi ({data.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">
                      {formatDate(transaction.tanggal)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.jenis === 'Pemasukan' ? 'default' : 'destructive'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {transaction.jenis === 'Pemasukan' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {transaction.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.kategori}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={transaction.keterangan}>
                      {transaction.keterangan || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-semibold ${
                      transaction.jenis === 'Pemasukan' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.jenis === 'Pemasukan' ? '+' : '-'}
                      {formatRupiah(transaction.jumlah)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
