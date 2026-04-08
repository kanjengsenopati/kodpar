
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Kasir } from "@/types";

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: {
    catatan: string;
    kasirId: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{
    catatan: string;
    kasirId: string;
  }>>;
  kasirList: Kasir[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  editForm,
  setEditForm,
  kasirList,
  onSubmit,
  isSubmitting,
}: EditTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="kasirId">Kasir</Label>
            <Select
              value={editForm.kasirId}
              onValueChange={(value) => setEditForm(prev => ({ ...prev, kasirId: value }))}
            >
              <SelectTrigger id="kasirId">
                <SelectValue placeholder="Pilih kasir" />
              </SelectTrigger>
              <SelectContent>
                {kasirList.filter(k => k.aktif).map((kasir) => (
                  <SelectItem key={kasir.id} value={kasir.id}>
                    {kasir.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Tambahkan catatan (opsional)"
              value={editForm.catatan}
              onChange={(e) => setEditForm(prev => ({ ...prev, catatan: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
