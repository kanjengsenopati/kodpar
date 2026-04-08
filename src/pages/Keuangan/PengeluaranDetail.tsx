
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash, Receipt } from 'lucide-react';
import { toast } from 'sonner';

import { PemasukanPengeluaran } from '@/types';
import { getPemasukanPengeluaranById, deletePemasukanPengeluaran } from '@/services/keuanganService';
import TransaksiForm from '@/components/keuangan/TransaksiForm';
import { DeleteConfirmDialog } from '@/components/keuangan/DeleteConfirmDialog';

export default function PengeluaranDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState<PemasukanPengeluaran | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadTransactionData(id);
    }
  }, [id]);
  
  const loadTransactionData = (transactionId: string) => {
    try {
      const data = getPemasukanPengeluaranById(transactionId);
      
      if (!data) {
        toast.error("Transaksi tidak ditemukan");
        navigate('/keuangan/arus-kas');
        return;
      }
      
      // Ensure it's a pengeluaran
      if (data.jenis !== "Pengeluaran") {
        toast.error("Halaman ini hanya untuk pengeluaran");
        navigate('/keuangan/pemasukan/' + transactionId);
        return;
      }
      
      setTransaction(data);
    } catch (error) {
      console.error("Error loading transaction:", error);
      toast.error("Gagal memuat data transaksi");
      navigate('/keuangan/arus-kas');
    }
  };
  
  const handleEdit = () => {
    setIsFormOpen(true);
  };
  
  const handleDeletePrompt = () => {
    setIsDeleteOpen(true);
  };
  
  const confirmDelete = () => {
    if (transaction) {
      try {
        deletePemasukanPengeluaran(transaction.id);
        toast.success("Transaksi berhasil dihapus");
        navigate('/keuangan/arus-kas');
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Gagal menghapus transaksi");
      }
    }
  };
  
  const handleFormSuccess = () => {
    if (id) {
      loadTransactionData(id);
    }
    setIsFormOpen(false);
  };
  
  if (!transaction) {
    return (
      <Layout pageTitle="Memuat Detail Pengeluaran...">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/keuangan/arus-kas')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Memuat Detail Pengeluaran...</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = format(new Date(transaction.tanggal), 'd MMMM yyyy', { locale: idLocale });
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(transaction.jumlah);
  
  return (
    <Layout pageTitle={`Detail Pengeluaran - ${transaction.kategori}`}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/keuangan/arus-kas')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Detail Pengeluaran</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDeletePrompt}>
              <Trash className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>
        
        {/* Transaction Details */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex justify-between">
              <span>Pengeluaran</span>
              <span className="text-red-600">{formattedAmount}</span>
            </CardTitle>
            <CardDescription>ID: {transaction.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="text-lg font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-lg font-medium">{transaction.kategori}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Keterangan</p>
                <p className="text-lg">{transaction.keterangan || "-"}</p>
              </div>
              
              {transaction.bukti && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bukti Transaksi</p>
                  <div className="border border-gray-300 rounded-md p-2 bg-white">
                    <img
                      src={transaction.bukti}
                      alt="Bukti Transaksi"
                      className="max-h-72 mx-auto"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Dibuat pada</p>
                  <p className="text-base">
                    {format(new Date(transaction.createdAt), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terakhir diupdate</p>
                  <p className="text-base">
                    {format(new Date(transaction.updatedAt), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2" 
                onClick={() => navigate('/keuangan/arus-kas')}
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Arus Kas
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => navigate('/keuangan/laporan')}
              >
                <Receipt className="h-4 w-4" />
                Lihat Laporan
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Transaksi</DialogTitle>
            </DialogHeader>
            <TransaksiForm
              initialData={transaction}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          transaction={transaction}
        />
      </div>
    </Layout>
  );
}
