
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
import { getAllJenis } from "@/services/jenisService";
import { PinjamanFormFields } from "./PinjamanFormFields";
import { PinjamanFormData, PinjamanFormProps } from "./types";
import { formatNumberInput } from "@/utils/formatters";
import { MemberName } from "@/components/anggota/MemberName";

export function PinjamanFormDialog({ 
  anggotaId, 
  isOpen, 
  onClose,
  onSubmit,
  isSubmitting
}: PinjamanFormProps) {
  const pinjamanJenis = getAllJenis().filter(j => j.jenisTransaksi === "Pinjaman" && j.isActive);
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    jumlah: '',
    keterangan: '',
    jenisId: pinjamanJenis[0]?.id || ''
  });
  
  const [formattedJumlah, setFormattedJumlah] = useState('');

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        jumlah: '',
        keterangan: '',
        jenisId: pinjamanJenis[0]?.id || ''
      });
      setFormattedJumlah('');
    }
  }, [isOpen, pinjamanJenis]);

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
            <div className="p-2 border rounded bg-slate-50 font-medium">
              <MemberName memberId={anggotaId} />
            </div>
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
