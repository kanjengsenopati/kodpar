
import { useState } from "react";
import { AnggotaKeluarga } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface KeluargaFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  currentKeluarga: AnggotaKeluarga;
  isEditing: boolean;
  errors: {
    nama?: string;
    hubungan?: string;
    alamat?: string;
    noHp?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string) => void;
}

export function KeluargaFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  currentKeluarga,
  isEditing,
  errors,
  onInputChange,
  onSelectChange
}: KeluargaFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Anggota Keluarga" : "Tambah Anggota Keluarga"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="nama" className={errors.nama ? "text-destructive" : ""}>
              Nama Lengkap {errors.nama && <span className="text-xs ml-1">({errors.nama})</span>}
            </Label>
            <Input
              id="nama"
              name="nama"
              value={currentKeluarga.nama}
              onChange={onInputChange}
              placeholder="Masukkan nama lengkap"
              className={errors.nama ? "border-destructive" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hubungan" className={errors.hubungan ? "text-destructive" : ""}>
              Hubungan {errors.hubungan && <span className="text-xs ml-1">({errors.hubungan})</span>}
            </Label>
            <Select
              value={currentKeluarga.hubungan}
              onValueChange={onSelectChange}
            >
              <SelectTrigger id="hubungan" className={errors.hubungan ? "border-destructive" : ""}>
                <SelectValue placeholder="Pilih hubungan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anak">Anak</SelectItem>
                <SelectItem value="Suami">Suami</SelectItem>
                <SelectItem value="Istri">Istri</SelectItem>
                <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                <SelectItem value="Saudara Kandung">Saudara Kandung</SelectItem>
                <SelectItem value="Kerabat">Kerabat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alamat" className={errors.alamat ? "text-destructive" : ""}>
              Alamat {errors.alamat && <span className="text-xs ml-1">({errors.alamat})</span>}
            </Label>
            <Textarea
              id="alamat"
              name="alamat"
              value={currentKeluarga.alamat}
              onChange={onInputChange}
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className={errors.alamat ? "border-destructive" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="noHp" className={errors.noHp ? "text-destructive" : ""}>
              Nomor HP {errors.noHp && <span className="text-xs ml-1">({errors.noHp})</span>}
            </Label>
            <Input
              id="noHp"
              name="noHp"
              value={currentKeluarga.noHp}
              onChange={onInputChange}
              placeholder="Contoh: 081234567890"
              className={errors.noHp ? "border-destructive" : ""}
            />
          </div>
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">{isEditing ? "Perbarui" : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
