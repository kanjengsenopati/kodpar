
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TransactionFormValues } from '../schema';

interface DescriptionFieldProps {
  control: Control<TransactionFormValues>;
}

export function DescriptionField({ control }: DescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="keterangan"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Keterangan</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Masukkan keterangan transaksi"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
