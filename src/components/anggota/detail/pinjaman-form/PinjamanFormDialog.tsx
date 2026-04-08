
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { PinjamanFormFields } from "./PinjamanFormFields";
import { PinjamanFormData, PinjamanFormProps } from "./types";
import { formatNumberInput } from "@/utils/formatters";

export function PinjamanFormDialog({ 
  anggotaId, 
  anggotaNama, 
  isOpen, 
  onClose,
  onSubmit,
  isSubmitting
}: PinjamanFormProps) {
  const pinjamanCategories = getPinjamanCategories();
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    jumlah: '',
    keterangan: '',
    kategori: pinjamanCategories[0]
  });
  
  const [formattedJumlah, setFormattedJumlah] = useState('');

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        jumlah: '',
        keterangan: '',
        kategori: pinjamanCategories[0]
      });
      setFormattedJumlah('');
    }
  }, [isOpen, pinjamanCategories]);

  // Update formatted amount when raw amount changes
  useEffect(() => {
    if (formData.jumlah) {
      setFormattedJumlah(formatNumberInput(formData.jumlah));
    } else {
      setFormattedJumlah('');
    }
  }, [formData.jumlah]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pengajuan Pinjaman Baru</DialogTitle>
          <DialogDescription>
            Silakan isi form pengajuan pinjaman di bawah ini
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="anggota">Nama Anggota</Label>
            <Input id="anggota" value={anggotaNama} disabled />
          </div>
          
          <PinjamanFormFields 
            formData={formData}
            setFormData={setFormData}
            formattedJumlah={formattedJumlah}
            setFormattedJumlah={setFormattedJumlah}
          />
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
