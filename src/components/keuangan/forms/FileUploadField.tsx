
import React, { useRef } from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, FileImage } from 'lucide-react';
import { TransactionFormValues } from '../schema';

interface FileUploadFieldProps {
  control: Control<TransactionFormValues>;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
}

export function FileUploadField({ control, filePreview, setFilePreview }: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFilePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FormField
      control={control}
      name="bukti"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bukti Transaksi (Opsional)</FormLabel>
          <FormControl>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {filePreview ? 'Ganti File' : 'Pilih File'}
                </Button>
                {filePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    Hapus
                  </Button>
                )}
              </div>
              
              {filePreview && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileImage className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">File berhasil dipilih</span>
                  <div className="ml-auto">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="h-12 w-12 object-cover rounded border"
                    />
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
