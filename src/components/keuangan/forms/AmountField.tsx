
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formatNumberInput, parseFormattedNumber, isValidAmountRange } from '@/utils/formatters';
import { TransactionFormValues } from '../schema';
import { NominalInputField } from '@/components/ui/NominalInputField';

interface AmountFieldProps {
  control: Control<TransactionFormValues>;
  formattedJumlah: string;
  setFormattedJumlah: (value: string) => void;
}

export function AmountField({ control, formattedJumlah, setFormattedJumlah }: AmountFieldProps) {
  return (
    <FormField
      control={control}
      name="jumlah"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Jumlah (Rp)</FormLabel>
          <FormControl>
            <NominalInputField
              id="jumlah"
              value={field.value || 0}
              onValueChange={(numericValue) => {
                // Validate range before setting
                if (isValidAmountRange(numericValue)) {
                  const formatted = formatNumberInput(numericValue);
                  setFormattedJumlah(formatted);
                  field.onChange(numericValue === 0 ? null : numericValue);
                }
              }}
              placeholder="Contoh: 5.000.000.000"
              required
            />
          </FormControl>
          <FormMessage />
          <p className="text-xs text-muted-foreground">
            Masukkan jumlah (tidak ada batas maksimal)
          </p>
        </FormItem>
      )}
    />
  );
}
