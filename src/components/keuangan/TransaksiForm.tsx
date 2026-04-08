import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PemasukanPengeluaran, KategoriTransaksi } from '@/types';
import { getAllKategoriTransaksi, createPemasukanPengeluaran, updatePemasukanPengeluaran } from '@/services/keuangan';
import { formatNumberInput } from '@/utils/formatters';
import { transactionFormSchema, TransactionFormValues } from './schema';
import { TransactionTypeField } from './forms/TransactionTypeField';
import { DateField } from './forms/DateField';
import { CategoryField } from './forms/CategoryField';
import { AmountField } from './forms/AmountField';
import { DescriptionField } from './forms/DescriptionField';
import { FileUploadField } from './forms/FileUploadField';
import { FormActions } from './forms/FormActions';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TransaksiFormProps {
  initialData?: PemasukanPengeluaran;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransaksiForm({ initialData, onSuccess, onCancel }: TransaksiFormProps) {
  const [categories, setCategories] = useState<KategoriTransaksi[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.bukti || null);
  const [formattedJumlah, setFormattedJumlah] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<KategoriTransaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!initialData;
  
  console.log('TransaksiForm render:', { initialData, isEdit, isLoading, error });
  
  // Initialize form with better default values
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      tanggal: initialData ? new Date(initialData.tanggal) : new Date(),
      kategori: initialData?.kategori || '',
      jumlah: initialData?.jumlah || 0,
      keterangan: initialData?.keterangan || '',
      jenis: initialData?.jenis || 'Pemasukan',
      bukti: initialData?.bukti || ''
    },
    mode: 'onChange'
  });

  // Update formatted amount when form values change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'jumlah' && value.jumlah) {
        setFormattedJumlah(formatNumberInput(value.jumlah));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Load categories with better error handling
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading categories...');
        const allCategories = getAllKategoriTransaksi();
        console.log('Categories loaded:', allCategories);
        
        if (!allCategories || allCategories.length === 0) {
          console.warn('No categories found');
          setError('Tidak ada kategori yang tersedia. Silakan tambahkan kategori terlebih dahulu.');
          setCategories([]);
          setFilteredCategories([]);
          return;
        }
        
        setCategories(allCategories);
        
        // Initial filtering based on current type
        const currentType = form.getValues('jenis');
        const filtered = allCategories.filter(cat => cat.jenis === currentType);
        console.log('Filtered categories:', filtered, 'for type:', currentType);
        setFilteredCategories(filtered);
        
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Gagal memuat kategori. Silakan refresh halaman.');
        toast.error('Gagal memuat kategori');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [form]);
  
  // Handle transaction type change
  const handleTransactionTypeChange = (type: 'Pemasukan' | 'Pengeluaran') => {
    console.log('Transaction type changed to:', type);
    
    // Reset category when transaction type changes
    form.setValue('kategori', '');
    
    // Filter categories based on selected transaction type
    const filtered = categories.filter(cat => cat.jenis === type);
    console.log('Filtering categories for type:', type, 'result:', filtered);
    setFilteredCategories(filtered);
  };
  
  // Handle file upload value setting
  const handleSetFilePreview = (preview: string | null) => {
    setFilePreview(preview);
    if (preview) {
      form.setValue('bukti', preview);
    } else {
      form.setValue('bukti', '');
    }
  };
  
  // Form submission handler with enhanced accounting sync
  const onSubmit = async (values: TransactionFormValues) => {
    try {
      console.log('Form submission started:', values);
      
      const transactionData = {
        tanggal: values.tanggal.toISOString().split('T')[0],
        kategori: values.kategori, 
        jumlah: values.jumlah,
        keterangan: values.keterangan || '',
        jenis: values.jenis,
        bukti: values.bukti || ''
      };
      
      console.log('Transaction data prepared:', transactionData);
      
      if (isEdit && initialData) {
        console.log('Updating transaction:', initialData.id);
        const result = updatePemasukanPengeluaran(initialData.id, transactionData);
        
        if (!result) {
          throw new Error('Gagal memperbarui transaksi - data tidak ditemukan');
        }
        
        toast.success('Transaksi berhasil diperbarui');
        console.log('Transaction updated successfully:', result);
      } else {
        console.log('Creating new transaction');
        const result = createPemasukanPengeluaran({
          ...transactionData,
          createdBy: 'user_1'
        });
        
        toast.success('Transaksi berhasil disimpan');
        console.log('Transaction created successfully:', result);
      }
      
      // Enhanced sync: trigger both keuangan and accounting updates
      console.log('Triggering enhanced sync to accounting system...');
      window.dispatchEvent(new CustomEvent('keuangan-data-updated'));
      window.dispatchEvent(new CustomEvent('accounting-sync-updated', {
        detail: { 
          action: isEdit ? 'update' : 'create',
          transactionType: values.jenis,
          amount: values.jumlah,
          timestamp: Date.now()
        }
      }));
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan transaksi';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Memuat form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2 mt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="min-w-20"
              >
                Tutup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Compact grid layout - First row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TransactionTypeField 
              control={form.control} 
              onTypeChange={handleTransactionTypeChange} 
            />
            <DateField control={form.control} />
            <CategoryField 
              control={form.control} 
              categories={filteredCategories} 
            />
          </div>
          
          {/* Second row - Amount and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AmountField 
              control={form.control}
              formattedJumlah={formattedJumlah}
              setFormattedJumlah={setFormattedJumlah}
            />
            <DescriptionField control={form.control} />
          </div>
          
          {/* Third row - File Upload (full width) */}
          <FileUploadField 
            control={form.control} 
            filePreview={filePreview}
            setFilePreview={handleSetFilePreview}
          />
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="min-w-20">
                Batal
              </Button>
            )}
            <Button type="submit" className="min-w-20">
              {isEdit ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
