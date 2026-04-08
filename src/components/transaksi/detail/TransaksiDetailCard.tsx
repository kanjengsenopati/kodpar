
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Transaksi } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { FileUp, FileDown, Wallet, TrendingDown } from 'lucide-react';

interface TransaksiDetailCardProps {
  transaksi: Transaksi;
  anggotaNama?: string;
}

export function TransaksiDetailCard({ transaksi, anggotaNama }: TransaksiDetailCardProps) {
  const getIcon = () => {
    switch (transaksi.jenis) {
      case 'Simpan':
        return <FileUp className="h-5 w-5 text-green-600" />;
      case 'Penarikan':
        return <FileDown className="h-5 w-5 text-red-600" />;
      case 'Pinjam':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'Angsuran':
        return <TrendingDown className="h-5 w-5 text-purple-600" />;
      default:
        return <FileUp className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Sukses':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Gagal':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAmountColor = () => {
    switch (transaksi.jenis) {
      case 'Simpan':
        return 'text-green-600';
      case 'Penarikan':
        return 'text-red-600';
      case 'Pinjam':
        return 'text-blue-600';
      case 'Angsuran':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className="text-xl">
                Detail {transaksi.jenis}
              </CardTitle>
              <CardDescription>
                ID Transaksi: {transaksi.id}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getStatusVariant(transaksi.status)}>
            {transaksi.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Transaksi</p>
              <p className="font-medium text-lg">{formatDate(transaksi.tanggal)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Nama Anggota</p>
              <p className="font-medium text-lg">{anggotaNama || transaksi.anggotaNama}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">ID Anggota</p>
              <p className="font-medium">{transaksi.anggotaId}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Jumlah</p>
              <p className={`font-bold text-2xl ${getAmountColor()}`}>
                {formatCurrency(transaksi.jumlah)}
              </p>
            </div>
            
            {transaksi.kategori && (
              <div>
                <p className="text-sm text-muted-foreground">Kategori</p>
                <p className="font-medium">{transaksi.kategori}</p>
              </div>
            )}
          </div>
        </div>
        
        {transaksi.keterangan && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Keterangan</p>
              <p className="text-gray-700 leading-relaxed">{transaksi.keterangan}</p>
            </div>
          </>
        )}
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium">Dibuat pada</p>
            <p>{formatDate(transaksi.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium">Terakhir diubah</p>
            <p>{formatDate(transaksi.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
