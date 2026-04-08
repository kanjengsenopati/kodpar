
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { createQualityControl, getQualityControlById, updateQualityControl } from '@/services/manufaktur/qualityControlService';
import { getAllWorkOrders } from '@/services/manufaktur/workOrderService';
import { QC_STATUSES, QC_TYPES, QCCheckItem } from '@/types/manufaktur';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function QualityControlForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    type: 'Final' as any, workOrderId: '', workOrderCode: '', productName: '', productCode: '',
    batchNumber: '', inspectionDate: new Date().toISOString().split('T')[0], inspector: '',
    sampleSize: 0, defectsFound: 0, status: 'Pending' as any, overallNotes: '',
    checkItems: [] as QCCheckItem[],
  });

  const workOrders = getAllWorkOrders();

  useEffect(() => {
    if (isEdit && id) {
      const qc = getQualityControlById(id);
      if (qc) setForm({ type: qc.type, workOrderId: qc.workOrderId || '', workOrderCode: qc.workOrderCode || '', productName: qc.productName, productCode: qc.productCode, batchNumber: qc.batchNumber || '', inspectionDate: qc.inspectionDate, inspector: qc.inspector, sampleSize: qc.sampleSize, defectsFound: qc.defectsFound, status: qc.status, overallNotes: qc.overallNotes || '', checkItems: qc.checkItems });
      else { toast.error('QC tidak ditemukan'); navigate('/manufaktur/quality-control'); }
    }
  }, [id]);

  const handleWOChange = (woId: string) => {
    const wo = workOrders.find(w => w.id === woId);
    if (wo) setForm(prev => ({ ...prev, workOrderId: wo.id, workOrderCode: wo.code, productName: wo.productName, productCode: '' }));
  };

  const addCheckItem = () => {
    setForm(prev => ({
      ...prev,
      checkItems: [...prev.checkItems, { id: uuidv4(), parameter: '', standard: '', actual: '', passed: false }],
    }));
  };

  const removeCheckItem = (itemId: string) => {
    setForm(prev => ({ ...prev, checkItems: prev.checkItems.filter(i => i.id !== itemId) }));
  };

  const updateCheckItem = (itemId: string, field: keyof QCCheckItem, value: any) => {
    setForm(prev => ({
      ...prev,
      checkItems: prev.checkItems.map(i => i.id === itemId ? { ...i, [field]: value } : i),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName) { toast.error('Produk wajib diisi'); return; }
    if (!form.inspector) { toast.error('Inspektur wajib diisi'); return; }

    // Auto-calculate defects
    const defects = form.checkItems.filter(i => !i.passed).length;
    const finalForm = { ...form, defectsFound: defects };

    if (isEdit && id) {
      updateQualityControl(id, finalForm);
      toast.success('Inspeksi QC diperbarui');
    } else {
      createQualityControl(finalForm);
      toast.success('Inspeksi QC dibuat');
    }
    navigate('/manufaktur/quality-control');
  };

  return (
    <Layout pageTitle={isEdit ? 'Edit Inspeksi QC' : 'Buat Inspeksi QC'}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Button type="button" variant="ghost" onClick={() => navigate('/manufaktur/quality-control')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>

        <Card>
          <CardHeader><CardTitle>Informasi Inspeksi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Tipe Inspeksi</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QC_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Work Order (Opsional)</Label>
                <Select value={form.workOrderId} onValueChange={handleWOChange}>
                  <SelectTrigger><SelectValue placeholder="Pilih WO" /></SelectTrigger>
                  <SelectContent>
                    {workOrders.map(wo => <SelectItem key={wo.id} value={wo.id}>{wo.code} — {wo.productName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Batch Number</Label><Input value={form.batchNumber} onChange={e => setForm({...form, batchNumber: e.target.value})} /></div>
              <div><Label>Nama Produk *</Label><Input value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} /></div>
              <div><Label>Kode Produk</Label><Input value={form.productCode} onChange={e => setForm({...form, productCode: e.target.value})} /></div>
              <div><Label>Tanggal Inspeksi</Label><Input type="date" value={form.inspectionDate} onChange={e => setForm({...form, inspectionDate: e.target.value})} /></div>
              <div><Label>Inspektur *</Label><Input value={form.inspector} onChange={e => setForm({...form, inspector: e.target.value})} /></div>
              <div><Label>Ukuran Sampel</Label><Input type="number" value={form.sampleSize} onChange={e => setForm({...form, sampleSize: Number(e.target.value)})} /></div>
            </div>
            <div><Label>Catatan</Label><Textarea value={form.overallNotes} onChange={e => setForm({...form, overallNotes: e.target.value})} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Checklist Inspeksi</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addCheckItem}><Plus className="h-4 w-4 mr-1" /> Tambah Item</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.checkItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada item checklist</p>
            ) : form.checkItems.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-accent/30">
                <div className="col-span-3"><Label className="text-xs">Parameter</Label><Input value={item.parameter} onChange={e => updateCheckItem(item.id, 'parameter', e.target.value)} placeholder="Warna, Berat, dll" /></div>
                <div className="col-span-3"><Label className="text-xs">Standar</Label><Input value={item.standard} onChange={e => updateCheckItem(item.id, 'standard', e.target.value)} placeholder="Nilai standar" /></div>
                <div className="col-span-3"><Label className="text-xs">Aktual</Label><Input value={item.actual} onChange={e => updateCheckItem(item.id, 'actual', e.target.value)} placeholder="Nilai aktual" /></div>
                <div className="col-span-2 flex items-center gap-2 pb-1">
                  <Checkbox checked={item.passed} onCheckedChange={v => updateCheckItem(item.id, 'passed', !!v)} />
                  <span className="text-xs">{item.passed ? 'Lulus' : 'Gagal'}</span>
                </div>
                <div className="col-span-1 pb-1">
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeCheckItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit"><Save className="h-4 w-4 mr-1" /> {isEdit ? 'Update' : 'Simpan'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/manufaktur/quality-control')}>Batal</Button>
        </div>
      </form>
    </Layout>
  );
}
