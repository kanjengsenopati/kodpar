
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { createProductionPlan, getProductionPlanById, updateProductionPlan } from '@/services/manufaktur/productionPlanService';
import { getAllWorkOrders } from '@/services/manufaktur/workOrderService';
import { PP_STATUSES, MATERIAL_UNITS } from '@/types/manufaktur';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

export default function ProductionPlanForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '', status: 'Draft' as any,
    targetOutput: 0, actualOutput: 0, outputUnit: 'pcs', shift: '', supervisor: '', notes: '',
    workOrderIds: [] as string[],
  });

  const workOrders = getAllWorkOrders();

  useEffect(() => {
    if (isEdit && id) {
      const plan = getProductionPlanById(id);
      if (plan) setForm({ name: plan.name, description: plan.description || '', startDate: plan.startDate, endDate: plan.endDate, status: plan.status, targetOutput: plan.targetOutput, actualOutput: plan.actualOutput, outputUnit: plan.outputUnit, shift: plan.shift || '', supervisor: plan.supervisor || '', notes: plan.notes || '', workOrderIds: plan.workOrderIds });
      else { toast.error('Plan tidak ditemukan'); navigate('/manufaktur/production-plans'); }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Nama plan wajib diisi'); return; }
    if (isEdit && id) {
      updateProductionPlan(id, form);
      toast.success('Production plan diperbarui');
    } else {
      createProductionPlan(form);
      toast.success('Production plan dibuat');
    }
    navigate('/manufaktur/production-plans');
  };

  const toggleWO = (woId: string) => {
    setForm(prev => ({
      ...prev,
      workOrderIds: prev.workOrderIds.includes(woId)
        ? prev.workOrderIds.filter(i => i !== woId)
        : [...prev.workOrderIds, woId],
    }));
  };

  return (
    <Layout pageTitle={isEdit ? 'Edit Production Plan' : 'Buat Production Plan'}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Button type="button" variant="ghost" onClick={() => navigate('/manufaktur/production-plans')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>

        <Card>
          <CardHeader><CardTitle>Informasi Plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Nama Plan *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PP_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Tanggal Mulai</Label><Input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
              <div><Label>Tanggal Selesai</Label><Input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              <div><Label>Target Output</Label><Input type="number" value={form.targetOutput} onChange={e => setForm({...form, targetOutput: Number(e.target.value)})} /></div>
              <div><Label>Satuan</Label>
                <Select value={form.outputUnit} onValueChange={v => setForm({...form, outputUnit: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MATERIAL_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {isEdit && <div><Label>Output Aktual</Label><Input type="number" value={form.actualOutput} onChange={e => setForm({...form, actualOutput: Number(e.target.value)})} /></div>}
              <div><Label>Shift</Label><Input value={form.shift} onChange={e => setForm({...form, shift: e.target.value})} placeholder="Pagi / Siang / Malam" /></div>
              <div><Label>Supervisor</Label><Input value={form.supervisor} onChange={e => setForm({...form, supervisor: e.target.value})} /></div>
            </div>
            <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><Label>Catatan</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Work Orders Terkait</CardTitle></CardHeader>
          <CardContent>
            {workOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada work order</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {workOrders.map(wo => (
                  <label key={wo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <Checkbox checked={form.workOrderIds.includes(wo.id)} onCheckedChange={() => toggleWO(wo.id)} />
                    <span className="font-mono text-sm">{wo.code}</span>
                    <span className="text-sm">{wo.productName}</span>
                    <span className="text-xs text-muted-foreground">({wo.status})</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit"><Save className="h-4 w-4 mr-1" /> {isEdit ? 'Update' : 'Simpan'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/manufaktur/production-plans')}>Batal</Button>
        </div>
      </form>
    </Layout>
  );
}
