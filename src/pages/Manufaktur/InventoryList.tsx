
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAllInventory, deleteInventory, createInventory, addStockMovement, getLowStockItems, getMovementsByInventoryId } from '@/services/manufaktur/inventoryService';
import { ManufakturInventory, INVENTORY_CATEGORIES, MATERIAL_UNITS, StockMovement } from '@/types/manufaktur';
import { Plus, Search, Trash2, Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryList() {
  const [inventory, setInventory] = useState<ManufakturInventory[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showMovement, setShowMovement] = useState<ManufakturInventory | null>(null);
  const [showHistory, setShowHistory] = useState<ManufakturInventory | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [newItem, setNewItem] = useState({ materialCode: '', materialName: '', category: 'Bahan Baku', unit: 'kg', currentStock: 0, minimumStock: 0, unitCost: 0, location: '' });
  const [movementForm, setMovementForm] = useState({ type: 'In' as 'In' | 'Out' | 'Adjustment', quantity: 0, notes: '', performedBy: '' });

  const reload = () => setInventory(getAllInventory());
  useEffect(() => { reload(); }, []);

  const lowStockItems = getLowStockItems();
  const totalValue = inventory.reduce((s, i) => s + i.totalValue, 0);

  const filtered = inventory.filter(i => {
    const matchSearch = i.materialName.toLowerCase().includes(search.toLowerCase()) || i.materialCode.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleAddItem = () => {
    if (!newItem.materialName || !newItem.materialCode) { toast.error('Kode dan nama material wajib diisi'); return; }
    createInventory(newItem);
    reload();
    setShowAdd(false);
    setNewItem({ materialCode: '', materialName: '', category: 'Bahan Baku', unit: 'kg', currentStock: 0, minimumStock: 0, unitCost: 0, location: '' });
    toast.success('Material ditambahkan');
  };

  const handleMovement = () => {
    if (!showMovement || movementForm.quantity <= 0) { toast.error('Jumlah harus lebih dari 0'); return; }
    addStockMovement(showMovement.id, movementForm.type, movementForm.quantity, { notes: movementForm.notes, performedBy: movementForm.performedBy });
    reload();
    setShowMovement(null);
    setMovementForm({ type: 'In', quantity: 0, notes: '', performedBy: '' });
    toast.success('Stok diperbarui');
  };

  const handleViewHistory = (item: ManufakturInventory) => {
    setShowHistory(item);
    setMovements(getMovementsByInventoryId(item.id));
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus material ini?')) { deleteInventory(id); reload(); toast.success('Material dihapus'); }
  };

  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <Layout pageTitle="Inventory Manufaktur">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total Material</p><p className="text-2xl font-bold">{inventory.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total Nilai</p><p className="text-2xl font-bold text-sm">{formatCurrency(totalValue)}</p></CardContent></Card>
          <Card className={lowStockItems.length > 0 ? 'border-destructive' : ''}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">Stok Rendah</p>
              <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
            </CardContent>
          </Card>
          <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Kategori</p><p className="text-2xl font-bold">{new Set(inventory.map(i => i.category)).size}</p></CardContent></Card>
        </div>

        {/* Low stock alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-bold text-destructive">Peringatan Stok Rendah</span></div>
              <div className="flex flex-wrap gap-2">{lowStockItems.map(i => (
                <Badge key={i.id} variant="destructive" className="text-xs">{i.materialName} ({i.currentStock}/{i.minimumStock} {i.unit})</Badge>
              ))}</div>
            </CardContent>
          </Card>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari material..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua</SelectItem>{INVENTORY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Tambah Material</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Tambah Material Baru</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Kode Material</Label><Input value={newItem.materialCode} onChange={e => setNewItem({...newItem, materialCode: e.target.value})} placeholder="MAT-xxx" /></div>
                <div><Label>Nama Material</Label><Input value={newItem.materialName} onChange={e => setNewItem({...newItem, materialName: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kategori</Label><Select value={newItem.category} onValueChange={v => setNewItem({...newItem, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{INVENTORY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Satuan</Label><Select value={newItem.unit} onValueChange={v => setNewItem({...newItem, unit: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MATERIAL_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Stok Awal</Label><Input type="number" value={newItem.currentStock} onChange={e => setNewItem({...newItem, currentStock: Number(e.target.value)})} /></div>
                  <div><Label>Min. Stok</Label><Input type="number" value={newItem.minimumStock} onChange={e => setNewItem({...newItem, minimumStock: Number(e.target.value)})} /></div>
                  <div><Label>Harga/Unit</Label><Input type="number" value={newItem.unitCost} onChange={e => setNewItem({...newItem, unitCost: Number(e.target.value)})} /></div>
                </div>
                <div><Label>Lokasi</Label><Input value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} placeholder="Gudang A" /></div>
                <Button className="w-full" onClick={handleAddItem}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead className="text-right">Harga/Unit</TableHead>
                  <TableHead className="text-right">Nilai</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Belum ada material</TableCell></TableRow>
                ) : filtered.map(item => (
                  <TableRow key={item.id} className={item.currentStock <= item.minimumStock ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-mono text-sm">{item.materialCode}</TableCell>
                    <TableCell className="font-medium">{item.materialName}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">
                      <span className={item.currentStock <= item.minimumStock ? 'text-destructive font-bold' : ''}>{item.currentStock}</span> {item.unit}
                    </TableCell>
                    <TableCell className="text-right">{item.minimumStock} {item.unit}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(item.unitCost)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(item.totalValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" title="Stok Masuk" onClick={() => { setShowMovement(item); setMovementForm({...movementForm, type: 'In'}); }}><ArrowDownToLine className="h-4 w-4 text-green-600" /></Button>
                        <Button size="icon" variant="ghost" title="Stok Keluar" onClick={() => { setShowMovement(item); setMovementForm({...movementForm, type: 'Out'}); }}><ArrowUpFromLine className="h-4 w-4 text-amber-600" /></Button>
                        <Button size="icon" variant="ghost" title="Riwayat" onClick={() => handleViewHistory(item)}><History className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stock Movement Dialog */}
        <Dialog open={!!showMovement} onOpenChange={() => setShowMovement(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{movementForm.type === 'In' ? 'Stok Masuk' : movementForm.type === 'Out' ? 'Stok Keluar' : 'Penyesuaian'} — {showMovement?.materialName}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Stok saat ini: <strong>{showMovement?.currentStock} {showMovement?.unit}</strong></p>
              <div><Label>Tipe</Label>
                <Select value={movementForm.type} onValueChange={v => setMovementForm({...movementForm, type: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In">Masuk</SelectItem>
                    <SelectItem value="Out">Keluar</SelectItem>
                    <SelectItem value="Adjustment">Penyesuaian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Jumlah</Label><Input type="number" value={movementForm.quantity} onChange={e => setMovementForm({...movementForm, quantity: Number(e.target.value)})} /></div>
              <div><Label>Dilakukan oleh</Label><Input value={movementForm.performedBy} onChange={e => setMovementForm({...movementForm, performedBy: e.target.value})} /></div>
              <div><Label>Catatan</Label><Textarea value={movementForm.notes} onChange={e => setMovementForm({...movementForm, notes: e.target.value})} /></div>
              <Button className="w-full" onClick={handleMovement}>Simpan Perubahan Stok</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Movement History Dialog */}
        <Dialog open={!!showHistory} onOpenChange={() => setShowHistory(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Riwayat Stok — {showHistory?.materialName}</DialogTitle></DialogHeader>
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada riwayat</p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {movements.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 text-sm">
                    <div>
                      <Badge variant={m.type === 'In' ? 'default' : m.type === 'Out' ? 'destructive' : 'outline'} className="text-xs mr-2">{m.type}</Badge>
                      <span>{m.type === 'Adjustment' ? `Set ke ${m.newStock}` : `${m.quantity} ${showHistory?.unit}`}</span>
                      {m.referenceCode && <span className="text-muted-foreground ml-2">({m.referenceCode})</span>}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{m.previousStock} → {m.newStock}</div>
                      <div>{new Date(m.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
