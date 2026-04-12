
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/manufaktur/bom")} className="rounded-xl text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/manufaktur/bom")} className="rounded-xl border-slate-200">Batal</Button>
            <Button type="submit" className="rounded-xl shadow-lg shadow-blue-100 px-6">
              <Save className="h-4 w-4 mr-1" /> {isEdit ? "Simpan Perubahan" : "Buat BOM"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Column 1: Informasi Produk */}
          <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
            <CardHeader className="pb-2">
              <Text.H2>Informasi Produk</Text.H2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-slate-500 ml-1">Nama Produk *</Label>
                <Input value={form.productName} onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))} placeholder="Meja Kayu Jati" className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Kode Produk</Label>
                  <Input value={form.productCode} onChange={(e) => setForm((f) => ({ ...f, productCode: e.target.value }))} placeholder="PRD-001" className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as BOM["status"] }))}>
                    <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-slate-500 ml-1">Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BOM_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Output Qty</Label>
                  <Input type="number" min={1} value={form.outputQuantity} onChange={(e) => setForm((f) => ({ ...f, outputQuantity: Number(e.target.value) }))} className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all font-semibold text-blue-600 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Unit</Label>
                  <Select value={form.outputUnit} onValueChange={(v) => setForm((f) => ({ ...f, outputUnit: v }))}>
                    <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-100 h-10 focus:bg-white focus:border-blue-400 transition-all text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MATERIAL_UNITS.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-slate-500 ml-1">Deskripsi</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 transition-all resize-none text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Column 2: Material / Bahan Baku */}
          <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Text.H2>Material</Text.H2>
              <Button type="button" size="sm" variant="outline" onClick={addItem} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-8 px-3 text-xs font-bold">
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah
              </Button>
            </CardHeader>
            <CardContent className="px-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200/50">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                    <Plus className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Kosong</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-3.5 rounded-[22px] bg-slate-50/80 border border-white shadow-sm relative group transition-all hover:bg-white hover:shadow-md">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-500 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg" 
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-1 pr-6">
                          <Label className="text-[10px] font-bold text-slate-400 ml-0.5">Nama Material</Label>
                          <Input 
                            value={item.materialName} 
                            onChange={(e) => updateItem(idx, "materialName", e.target.value)} 
                            placeholder="Kayu Jati" 
                            className="h-9 rounded-xl bg-white border border-slate-100 focus:border-blue-400 transition-all font-semibold text-sm px-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 ml-0.5">Kode</Label>
                            <Input 
                              value={item.materialCode} 
                              onChange={(e) => updateItem(idx, "materialCode", e.target.value)} 
                              placeholder="MTR-001" 
                              className="h-9 rounded-xl bg-white border border-slate-100 focus:border-blue-400 transition-all text-xs px-3"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 ml-0.5">Satuan</Label>
                            <Select value={item.unit} onValueChange={(v) => updateItem(idx, "unit", v)}>
                              <SelectTrigger className="h-9 rounded-xl bg-white border border-slate-100 focus:border-blue-400 transition-all text-xs px-3"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {MATERIAL_UNITS.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 ml-0.5">Qty</Label>
                            <Input 
                              type="number" min={0} 
                              value={item.quantity} 
                              onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} 
                              className="h-9 rounded-xl bg-white border border-slate-100 focus:border-blue-400 transition-all font-bold text-sm text-blue-600 px-3"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 ml-0.5">Harga / Unit</Label>
                            <Input 
                              type="text" 
                              value={formatNumberInput(item.unitCost)} 
                              onChange={(e) => updateItem(idx, "unitCost", cleanNumberInput(e.target.value))} 
                              className="h-9 rounded-xl bg-white border border-slate-100 focus:border-blue-400 transition-all font-bold text-sm px-3" 
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2 mt-0.5 border-t border-slate-200/50 flex justify-between items-center px-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Subtotal</span>
                          <span className="font-bold text-blue-600 text-[13px]">Rp {item.totalCost.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column 3: Ringkasan Biaya */}
          <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
            <CardHeader className="pb-2">
              <Text.H2>Biaya Tambahan</Text.H2>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Biaya Overhead (Rp)</Label>
                  <Input 
                    type="text" 
                    value={formatNumberInput(form.overheadCost)} 
                    onChange={(e) => setForm((f) => ({ ...f, overheadCost: cleanNumberInput(e.target.value) }))} 
                    className="h-10 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 transition-all font-bold text-base px-4"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 ml-1">Biaya Tenaga Kerja (Rp)</Label>
                  <Input 
                    type="text" 
                    value={formatNumberInput(form.laborCost)} 
                    onChange={(e) => setForm((f) => ({ ...f, laborCost: cleanNumberInput(e.target.value) }))} 
                    className="h-10 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-400 transition-all font-bold text-base px-4"
                  />
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-[28px] p-5 border border-white shadow-inner">
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between items-center pb-2 border-dashed border-b border-slate-200/60">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Material</p>
                    <p className="font-bold text-slate-700 text-[13px]">Rp {formatNumberInput(totalMaterial)}</p>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-dashed border-b border-slate-200/60">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Overhead</p>
                    <p className="font-bold text-slate-700 text-[13px]">Rp {formatNumberInput(form.overheadCost)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Tenaga Kerja</p>
                    <p className="font-bold text-slate-700 text-[13px]">Rp {formatNumberInput(form.laborCost)}</p>
                  </div>
                </div>
                
                <div className="text-center pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Biaya Produksi</p>
                  <Text.Amount className="text-2xl text-blue-600 block">Rp {formatNumberInput(totalCost)}</Text.Amount>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[22px] p-4 text-white shadow-lg shadow-blue-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Unit Cost Estimate</p>
                  <p className="text-lg font-bold">Rp {formatNumberInput(totalCost / (form.outputQuantity || 1))}</p>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <Save className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Layout>
  );
}
