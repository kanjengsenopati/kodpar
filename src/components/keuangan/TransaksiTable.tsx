
import React from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PemasukanPengeluaran } from '@/types';
import { FileUp, FileDown, Eye, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface TransaksiTableProps {
  data: PemasukanPengeluaran[];
  onView?: (transaction: PemasukanPengeluaran) => void;
  onEdit?: (transaction: PemasukanPengeluaran) => void;
  onDelete?: (transaction: PemasukanPengeluaran) => void;
}

export default function TransaksiTable({ 
  data, 
  onView,
  onEdit,
  onDelete
}: TransaksiTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[100px]">Tanggal</TableHead>
              <TableHead className="w-[100px]">Jenis</TableHead>
              <TableHead className="w-[120px]">Kategori</TableHead>
              <TableHead className="text-right w-[120px]">Jumlah</TableHead>
              <TableHead className="min-w-[150px]">Keterangan</TableHead>
              <TableHead className="text-center w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Belum ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              data.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-xs">{transaction.id}</TableCell>
                  <TableCell className="text-xs">
                    {format(new Date(transaction.tanggal), 'dd MMM yyyy', { locale: idLocale })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.jenis === 'Pemasukan' ? 'success' : 'destructive'} className="text-xs">
                      {transaction.jenis === 'Pemasukan' ? (
                        <FileUp className="h-2 w-2 mr-1" />
                      ) : (
                        <FileDown className="h-2 w-2 mr-1" />
                      )}
                      {transaction.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{transaction.kategori}</TableCell>
                  <TableCell className="text-right font-medium text-xs">
                    {formatCurrency(transaction.jumlah)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs">
                    {transaction.keterangan || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <div className="grid grid-cols-2 gap-1 w-fit">
                        {onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onView(transaction)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onEdit(transaction)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {onDelete && !onView && !onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 col-span-2"
                            onClick={() => onDelete(transaction)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
