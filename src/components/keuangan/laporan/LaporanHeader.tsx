
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { FileUp, FileDown, BarChart } from 'lucide-react';

interface LaporanHeaderProps {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  periode?: string;
}

export default function LaporanHeader({ 
  totalPemasukan, 
  totalPengeluaran, 
  saldo,
  periode
}: LaporanHeaderProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Total Pemasukan</h2>
            <div className="bg-blue-100 p-2 rounded-full">
              <FileUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {formatCurrency(totalPemasukan)}
          </p>
          {periode && (
            <p className="text-sm text-muted-foreground mt-1">{periode}</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Total Pengeluaran</h2>
            <div className="bg-red-100 p-2 rounded-full">
              <FileDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalPengeluaran)}
          </p>
          {periode && (
            <p className="text-sm text-muted-foreground mt-1">{periode}</p>
          )}
        </CardContent>
      </Card>
      
      <Card className={`${saldo >= 0 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <CardContent className="pt-6 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{saldo >= 0 ? 'Surplus' : 'Defisit'}</h2>
            <div className={`${saldo >= 0 ? 'bg-green-100' : 'bg-orange-100'} p-2 rounded-full`}>
              <BarChart className={`h-5 w-5 ${saldo >= 0 ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold mt-2 ${saldo >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {formatCurrency(Math.abs(saldo))}
          </p>
          {periode && (
            <p className="text-sm text-muted-foreground mt-1">{periode}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
