
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PemasukanPengeluaran } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FileUp, FileDown } from 'lucide-react';

interface TransaksiDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PemasukanPengeluaran | null;
}

export function TransaksiDetailDialog({ 
  isOpen, 
  onClose, 
  transaction 
}: TransaksiDetailDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transaction.jenis === 'Pemasukan' ? (
              <FileUp className="h-5 w-5 text-green-600" />
            ) : (
              <FileDown className="h-5 w-5 text-red-600" />
            )}
            Detail Transaksi {transaction.jenis}
          </DialogTitle>
          <DialogDescription>
            ID Transaksi: {transaction.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="font-medium">
                {format(new Date(transaction.tanggal), 'dd MMMM yyyy', { locale: idLocale })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis</p>
              <Badge variant={transaction.jenis === 'Pemasukan' ? 'success' : 'destructive'}>
                {transaction.jenis}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Kategori</p>
            <p className="font-medium">{transaction.kategori}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Jumlah</p>
            <p className="text-lg font-bold">
              {formatCurrency(transaction.jumlah)}
            </p>
          </div>
          
          {transaction.keterangan && (
            <div>
              <p className="text-sm text-muted-foreground">Keterangan</p>
              <p className="font-medium">{transaction.keterangan}</p>
            </div>
          )}
          
          {transaction.bukti && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bukti Transaksi</p>
                <img 
                  src={transaction.bukti} 
                  alt="Bukti transaksi" 
                  className="w-full max-w-sm rounded-lg border"
                />
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p>Dibuat: {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p>Diubah: {format(new Date(transaction.updatedAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
