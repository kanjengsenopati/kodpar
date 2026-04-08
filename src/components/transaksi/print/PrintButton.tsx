
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  filename?: string;
  onAfterPrint?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PrintButton({ 
  contentRef, 
  filename = 'transaksi-detail',
  onAfterPrint,
  variant = 'default',
  size = 'default',
  className = ''
}: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: filename,
    onAfterPrint
  });

  return (
    <Button 
      onClick={handlePrint}
      variant={variant}
      size={size}
      className={`gap-2 bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      <Printer className="h-4 w-4" />
      Cetak Detail
    </Button>
  );
}
