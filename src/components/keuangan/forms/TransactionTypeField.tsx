
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
import { TransactionFormValues } from '../schema';

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>;
  onTypeChange?: (type: 'Pemasukan' | 'Pengeluaran') => void;
}

export function TransactionTypeField({ control, onTypeChange }: TransactionTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="jenis"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Jenis Transaksi</FormLabel>
          <Select 
            onValueChange={(value: 'Pemasukan' | 'Pengeluaran') => {
              field.onChange(value);
              if (onTypeChange) onTypeChange(value);
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis transaksi" />
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
  );
}
