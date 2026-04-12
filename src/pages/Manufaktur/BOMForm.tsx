
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createBOM, getBOMById, updateBOM } from "@/services/manufaktur/bomService";
import { BOM, BOMItem, BOM_CATEGORIES, MATERIAL_UNITS } from "@/types/manufaktur";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import * as Text from "@/components/ui/text";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

export default function BOMForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    productName: "",
    productCode: "",
    description: "",
    category: "Lainnya",
    outputQuantity: 1,
    outputUnit: "pcs",
    overheadCost: 0,
    laborCost: 0,
    status: "Draft" as BOM["status"],
  });

  const [items, setItems] = useState<BOMItem[]>([]);

  useEffect(() => {
    if (id) {
      const bom = getBOMById(id);
      if (bom) {
        setForm({
          productName: bom.productName,
          productCode: bom.productCode,
          description: bom.description || "",
          category: bom.category,
          outputQuantity: bom.outputQuantity,
          outputUnit: bom.outputUnit,
          overheadCost: bom.overheadCost,
          laborCost: bom.laborCost,
          status: bom.status,
        });
        setItems(bom.items);
      }
    }
  }, [id]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        bomId: id || "",
        materialName: "",
        materialCode: "",
        quantity: 1,
        unit: "pcs",
        unitCost: 0,
        totalCost: 0,
      },
    ]);
  };

  const updateItem = (idx: number, field: keyof BOMItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      (updated[idx] as any)[field] = value;
      if (field === "quantity" || field === "unitCost") {
        updated[idx].totalCost = updated[idx].quantity * updated[idx].unitCost;
      }
      return updated;
    });
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalMaterial = items.reduce((s, i) => s + i.totalCost, 0);
  const totalCost = totalMaterial + form.overheadCost + form.laborCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (items.length === 0) {
      toast.error("Tambahkan minimal 1 material");
      return;
    }

    if (isEdit && id) {
      updateBOM(id, { ...form, items });
      toast.success("BOM berhasil diperbarui");
    } else {
      createBOM({ ...form, items });
      toast.success("BOM berhasil dibuat");
    }
    navigate("/manufaktur/bom");
  };

  return (
    <Layout pageTitle={isEdit ? "Edit BOM" : "Tambah BOM"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/manufaktur/bom")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
        </div>

        {/* Product Info */}
        <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
          <CardHeader>
            <Text.H2>Informasi Produk</Text.H2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Produk *</Label>
              <Input value={form.productName} onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))} placeholder="Contoh: Meja Kayu Jati" />
            </div>
            <div className="space-y-2">
              <Label>Kode Produk</Label>
              <Input value={form.productCode} onChange={(e) => setForm((f) => ({ ...f, productCode: e.target.value }))} placeholder="Contoh: PRD-001" />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BOM_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as BOM["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Output Quantity</Label>
              <Input type="number" min={1} value={form.outputQuantity} onChange={(e) => setForm((f) => ({ ...f, outputQuantity: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Output Unit</Label>
              <Select value={form.outputUnit} onValueChange={(v) => setForm((f) => ({ ...f, outputUnit: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIAL_UNITS.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Material Items */}
        <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <Text.H2>Material / Bahan Baku</Text.H2>
            <Button type="button" size="sm" variant="outline" onClick={addItem} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
              <Plus className="h-4 w-4 mr-1" /> Tambah Material
            </Button>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">Belum ada material. Klik "Tambah Material" untuk menambahkan.</p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nama Material</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Kode</TableHead>
                      <TableHead className="w-32 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Qty</TableHead>
                      <TableHead className="w-24 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Satuan</TableHead>
                      <TableHead className="w-40 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Harga/Unit</TableHead>
                      <TableHead className="w-32 text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input value={item.materialName} onChange={(e) => updateItem(idx, "materialName", e.target.value)} placeholder="Nama bahan" className="h-10 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500" />
                        </TableCell>
                        <TableCell>
                          <Input value={item.materialCode} onChange={(e) => updateItem(idx, "materialCode", e.target.value)} placeholder="Kode" className="h-10 w-24 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} className="h-10 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 font-semibold" />
                        </TableCell>
                        <TableCell>
                          <Select value={item.unit} onValueChange={(v) => updateItem(idx, "unit", v)}>
                            <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {MATERIAL_UNITS.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="text" 
                            value={formatNumberInput(item.unitCost)} 
                            onChange={(e) => updateItem(idx, "unitCost", cleanNumberInput(e.target.value))} 
                            className="h-10 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 font-semibold" 
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          Rp {item.totalCost.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
          <CardHeader>
            <Text.H2>Ringkasan Biaya</Text.H2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pl-1">Biaya Overhead (Rp)</Label>
              <Input 
                type="text" 
                value={formatNumberInput(form.overheadCost)} 
                onChange={(e) => setForm((f) => ({ ...f, overheadCost: cleanNumberInput(e.target.value) }))} 
                className="h-12 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pl-1">Biaya Tenaga Kerja (Rp)</Label>
              <Input 
                type="text" 
                value={formatNumberInput(form.laborCost)} 
                onChange={(e) => setForm((f) => ({ ...f, laborCost: cleanNumberInput(e.target.value) }))} 
                className="h-12 rounded-xl bg-slate-50/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 font-bold text-lg"
              />
            </div>
            <div className="sm:col-span-2 flex justify-between items-center bg-slate-50/80 rounded-[20px] p-6 border border-white">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <p className="text-slate-500">Material: <span className="font-bold text-slate-800 ml-1">Rp {formatNumberInput(totalMaterial)}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <p className="text-slate-500">Overhead: <span className="font-bold text-slate-800 ml-1">Rp {formatNumberInput(form.overheadCost)}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <p className="text-slate-500">Tenaga Kerja: <span className="font-bold text-slate-800 ml-1">Rp {formatNumberInput(form.laborCost)}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Biaya Produksi</p>
                <Text.Amount className="text-3xl text-blue-600">Rp {formatNumberInput(totalCost)}</Text.Amount>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/manufaktur/bom")}>Batal</Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-1" /> {isEdit ? "Simpan Perubahan" : "Buat BOM"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
