
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccount } from "@/types/akuntansi";
import { X } from "lucide-react";

interface COAFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: ChartOfAccount;
  parentAccounts: ChartOfAccount[];
  isLoading: boolean;
}

export function COAForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  parentAccounts,
  isLoading 
}: COAFormProps) {
  const [formData, setFormData] = useState({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    jenis: initialData?.jenis || "ASET",
    kategori: initialData?.kategori || "",
    parentId: initialData?.parentId || "none",
    isGroup: initialData?.isGroup || false,
    saldoNormal: initialData?.saldoNormal || "DEBIT",
    deskripsi: initialData?.deskripsi || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        kode: initialData.kode || "",
        nama: initialData.nama || "",
        jenis: initialData.jenis || "ASET",
        kategori: initialData.kategori || "",
        parentId: initialData.parentId || "none",
        isGroup: initialData.isGroup || false,
        saldoNormal: initialData.saldoNormal || "DEBIT",
        deskripsi: initialData.deskripsi || "",
      });
    } else {
      setFormData({
        kode: "",
        nama: "",
        jenis: "ASET",
        kategori: "",
        parentId: "none",
        isGroup: false,
        saldoNormal: "DEBIT",
        deskripsi: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.kode.trim()) {
      newErrors.kode = "Kode akun wajib diisi";
    }

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama akun wajib diisi";
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = "Kategori wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const level = formData.parentId !== "none" 
      ? (parentAccounts.find(p => p.id === formData.parentId)?.level || 0) + 1 
      : 1;

    const submitData = {
      ...formData,
      parentId: formData.parentId === "none" ? undefined : formData.parentId,
      level,
      isActive: true,
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getKategoriOptions = (jenis: string) => {
    const kategoriMap = {
      ASET: ["ASET LANCAR", "ASET TETAP", "ASET TIDAK BERWUJUD", "INVESTASI JANGKA PANJANG"],
      KEWAJIBAN: ["KEWAJIBAN LANCAR", "KEWAJIBAN JANGKA PANJANG"],
      MODAL: ["MODAL DISETOR", "LABA DITAHAN", "MODAL DONASI"],
      PENDAPATAN: ["PENDAPATAN OPERASIONAL", "PENDAPATAN NON-OPERASIONAL"],
      BEBAN: ["BEBAN OPERASIONAL", "BEBAN NON-OPERASIONAL", "BEBAN ADMINISTRASI", "BEBAN PENJUALAN"]
    };
    
    return kategoriMap[jenis as keyof typeof kategoriMap] || [];
  };

  const filteredParentAccounts = parentAccounts.filter(acc => 
    acc.jenis === formData.jenis && acc.isGroup
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {initialData ? "Edit Akun" : "Tambah Akun Baru"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kode">Kode Akun *</Label>
              <Input
                id="kode"
                value={formData.kode}
                onChange={(e) => updateFormData("kode", e.target.value)}
                placeholder="Contoh: 1100"
                className={errors.kode ? "border-red-500" : ""}
              />
              {errors.kode && <p className="text-sm text-red-500 mt-1">{errors.kode}</p>}
            </div>
            <div>
              <Label htmlFor="nama">Nama Akun *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => updateFormData("nama", e.target.value)}
                placeholder="Contoh: Kas dan Bank"
                className={errors.nama ? "border-red-500" : ""}
              />
              {errors.nama && <p className="text-sm text-red-500 mt-1">{errors.nama}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jenis">Jenis Akun *</Label>
              <Select value={formData.jenis} onValueChange={(value) => updateFormData("jenis", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASET">Aset</SelectItem>
                  <SelectItem value="KEWAJIBAN">Kewajiban</SelectItem>
                  <SelectItem value="MODAL">Modal</SelectItem>
                  <SelectItem value="PENDAPATAN">Pendapatan</SelectItem>
                  <SelectItem value="BEBAN">Beban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="kategori">Kategori *</Label>
              <Select value={formData.kategori} onValueChange={(value) => updateFormData("kategori", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {getKategoriOptions(formData.jenis).map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategori && <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentId">Parent Akun</Label>
              <Select value={formData.parentId} onValueChange={(value) => updateFormData("parentId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih parent akun (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada parent</SelectItem>
                  {filteredParentAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.kode} - {account.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="saldoNormal">Saldo Normal</Label>
              <Select value={formData.saldoNormal} onValueChange={(value) => updateFormData("saldoNormal", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="KREDIT">Kredit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isGroup"
              checked={formData.isGroup}
              onCheckedChange={(checked) => updateFormData("isGroup", checked)}
            />
            <Label htmlFor="isGroup">Akun Grup (dapat memiliki sub akun)</Label>
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => updateFormData("deskripsi", e.target.value)}
              placeholder="Deskripsi opsional untuk akun ini"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : (initialData ? "Perbarui" : "Simpan")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
