
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TransactionFormValues } from '../schema';

interface DateFieldProps {
  control: Control<TransactionFormValues>;
}

export function DateField({ control }: DateFieldProps) {
  return (
    <FormField
      control={control}
      name="tanggal"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
