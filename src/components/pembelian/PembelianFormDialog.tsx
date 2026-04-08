
import { useState, useEffect } from "react";
import { Pembelian, PembelianItem, Pemasok } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PembelianFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  currentPembelian: Pembelian | null;
  formData: Partial<Pembelian>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Pembelian>>>;
  pemasokList: Pemasok[];
  calculateTotal: () => void;
}

export function PembelianFormDialog({
  isOpen,
  onClose,
  onSave,
  currentPembelian,
  formData,
  setFormData,
  pemasokList,
  calculateTotal,
}: PembelianFormDialogProps) {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (status: string) => {
    setFormData({
      ...formData,
      status: status as "proses" | "selesai" | "dibatalkan",
    });
  };

  const handlePemasokChange = (pemasokId: string) => {
    const pemasok = pemasokList.find((s) => s.id === pemasokId);
    setFormData({
      ...formData,
      pemasokId: pemasokId,
      pemasok: pemasok?.nama || "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {currentPembelian ? "Edit Pembelian" : "Tambah Pembelian Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tanggal</label>
            <Input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Pemasok</label>
            <Select value={formData.pemasokId} onValueChange={handlePemasokChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Pemasok" />
              </SelectTrigger>
              <SelectContent>
                {pemasokList.map((pemasok) => (
                  <SelectItem key={pemasok.id} value={pemasok.id}>
                    {pemasok.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proses">Proses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Catatan</label>
            <Input
              name="catatan"
              value={formData.catatan || ""}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Items table - simplified for this implementation */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 text-center p-4">
            Untuk sederhananya, implementasi ini tidak menyertakan form untuk menambahkan detail item pembelian.
            Dalam implementasi lengkap, di sini akan ada tabel untuk menambah/edit/hapus item pembelian.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Subtotal</label>
            <Input
              type="number"
              name="subtotal"
              value={formData.subtotal}
              onChange={handleFormChange}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Diskon</label>
            <Input
              type="number"
              name="diskon"
              value={formData.diskon || 0}
              onChange={handleFormChange}
              onBlur={calculateTotal}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">PPN</label>
            <Input
              type="number"
              name="ppn"
              value={formData.ppn || 0}
              onChange={handleFormChange}
              onBlur={calculateTotal}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Total</label>
            <Input type="number" name="total" value={formData.total} disabled />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={onSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
