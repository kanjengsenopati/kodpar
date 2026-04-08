
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEdit: boolean;
  onCancel?: () => void;
}

export function FormActions({ isEdit, onCancel }: FormActionsProps) {
  return (
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
  );
}
