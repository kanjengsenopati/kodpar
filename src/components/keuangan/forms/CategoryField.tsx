
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KategoriTransaksi } from '@/types';
import { TransactionFormValues } from '../schema';

interface CategoryFieldProps {
  control: Control<TransactionFormValues>;
  categories: KategoriTransaksi[];
}

export function CategoryField({ control, categories }: CategoryFieldProps) {
  return (
    <FormField
      control={control}
      name="kategori"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kategori</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.nama}>
                  {category.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
