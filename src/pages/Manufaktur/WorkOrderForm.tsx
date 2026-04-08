
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createWorkOrder, getWorkOrderById, updateWorkOrder } from "@/services/manufaktur/workOrderService";
import { getAllBOM } from "@/services/manufaktur/bomService";
import { BOM, WO_PRIORITIES, WOStatus, WOPriority } from "@/types/manufaktur";
import { toast } from "sonner";

export default function WorkOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [bomList, setBomList] = useState<BOM[]>([]);
  const [form, setForm] = useState({
    bomId: "",
    quantity: 1,
    status: "Draft" as WOStatus,
    priority: "Medium" as WOPriority,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    assignedTo: "",
    notes: "",
    actualCost: 0,
  });

  useEffect(() => {
    setBomList(getAllBOM().filter((b) => b.status === "Active"));
    if (id) {
      const wo = getWorkOrderById(id);
      if (wo) {
        setForm({
          bomId: wo.bomId,
          quantity: wo.quantity,
          status: wo.status,
          priority: wo.priority,
          startDate: wo.startDate,
          dueDate: wo.dueDate,
          assignedTo: wo.assignedTo || "",
          notes: wo.notes || "",
          actualCost: wo.actualCost || 0,
        });
        // For edit, include all BOMs (not just active)
        setBomList(getAllBOM());
      }
    }
  }, [id]);

  const selectedBOM = bomList.find((b) => b.id === form.bomId);
  const estimatedCost = selectedBOM ? selectedBOM.totalCost * form.quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bomId) {
      toast.error("Pilih BOM terlebih dahulu");
      return;
    }
    if (!form.dueDate) {
      toast.error("Tanggal target wajib diisi");
      return;
    }

    if (isEdit && id) {
      updateWorkOrder(id, form);
      toast.success("Work Order berhasil diperbarui");
    } else {
      const wo = createWorkOrder(form);
      if (wo) {
        toast.success(`Work Order ${wo.code} berhasil dibuat`);
      } else {
        toast.error("Gagal membuat Work Order");
        return;
      }
    }
    navigate("/manufaktur/work-orders");
  };

  return (
    <Layout pageTitle={isEdit ? "Edit Work Order" : "Buat Work Order"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/manufaktur/work-orders")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Work Order</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Bill of Materials (BOM) *</Label>
              <Select value={form.bomId} onValueChange={(v) => setForm((f) => ({ ...f, bomId: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih BOM..." /></SelectTrigger>
                <SelectContent>
                  {bomList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.code} — {b.productName} ({b.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bomList.length === 0 && (
                <p className="text-xs text-muted-foreground">Belum ada BOM dengan status Active. Buat dan aktifkan BOM terlebih dahulu.</p>
              )}
            </div>

            {selectedBOM && (
              <div className="sm:col-span-2 bg-muted rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-muted-foreground">Produk:</span> <span className="font-medium">{selectedBOM.productName}</span></p>
                <p><span className="text-muted-foreground">Material:</span> {selectedBOM.items.length} item</p>
                <p><span className="text-muted-foreground">Biaya per unit:</span> Rp {selectedBOM.totalCost.toLocaleString("id-ID")} / {selectedBOM.outputQuantity} {selectedBOM.outputUnit}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Jumlah Produksi *</Label>
              <Input type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Prioritas</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as WOPriority }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WO_PRIORITIES.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Target *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </div>

            {isEdit && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as WOStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isEdit && (
              <div className="space-y-2">
                <Label>Biaya Aktual (Rp)</Label>
                <Input type="number" min={0} value={form.actualCost} onChange={(e) => setForm((f) => ({ ...f, actualCost: Number(e.target.value) }))} />
              </div>
            )}

            <div className="space-y-2">
              <Label>Ditugaskan Kepada</Label>
              <Input value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))} placeholder="Nama penanggung jawab" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Catatan</Label>
              <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
            </div>

            {selectedBOM && (
              <div className="sm:col-span-2 flex justify-between items-center bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground">
                  {form.quantity} × Rp {selectedBOM.totalCost.toLocaleString("id-ID")}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estimasi Total Biaya</p>
                  <p className="text-2xl font-bold text-primary">Rp {estimatedCost.toLocaleString("id-ID")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/manufaktur/work-orders")}>Batal</Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-1" /> {isEdit ? "Simpan Perubahan" : "Buat Work Order"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
