
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KategoriTransaksi } from '@/types';
import { createKategoriTransaksi, updateKategoriTransaksi } from '@/services/keuangan';
import { toast } from 'sonner';

const formSchema = z.object({
  nama: z.string().min(2, { message: 'Nama kategori minimal 2 karakter' }),
  deskripsi: z.string().optional(),
  jenis: z.enum(['Pemasukan', 'Pengeluaran'], {
    required_error: 'Jenis kategori harus dipilih',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface KategoriFormProps {
  initialData?: KategoriTransaksi;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function KategoriForm({ initialData, onSuccess, onCancel }: KategoriFormProps) {
  const isEdit = !!initialData;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      deskripsi: initialData?.deskripsi || '',
      jenis: initialData?.jenis || 'Pemasukan',
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      console.log('Submitting kategori form:', values);
      
      // Ensure all required properties are present
      const kategoriData: Omit<KategoriTransaksi, "id"> = {
        nama: values.nama,
        deskripsi: values.deskripsi || '',
        jenis: values.jenis,
      };

      if (isEdit && initialData) {
        const result = updateKategoriTransaksi(initialData.id, kategoriData);
        if (result) {
          toast.success('Kategori berhasil diperbarui');
          console.log('Category updated:', result);
        } else {
          throw new Error('Gagal memperbarui kategori');
        }
      } else {
        const result = createKategoriTransaksi(kategoriData);
        toast.success('Kategori berhasil ditambahkan');
        console.log('Category created:', result);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan kategori';
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama kategori" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Masukkan deskripsi kategori"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit">
            {isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
