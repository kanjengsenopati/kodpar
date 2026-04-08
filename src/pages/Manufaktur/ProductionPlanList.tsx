
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { getAllProductionPlans, deleteProductionPlan } from '@/services/manufaktur/productionPlanService';
import { ProductionPlan, PPStatus } from '@/types/manufaktur';
import { Plus, Search, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<PPStatus, string> = {
  'Draft': 'bg-muted text-muted-foreground',
  'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'In Production': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function ProductionPlanList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { setPlans(getAllProductionPlans()); }, []);

  const filtered = plans.filter(p =>
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Hapus production plan ini?')) {
      deleteProductionPlan(id);
      setPlans(getAllProductionPlans());
      toast.success('Production plan dihapus');
    }
  };

  return (
    <Layout pageTitle="Production Planning">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari production plan..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => navigate('/manufaktur/production-plans/tambah')}>
            <Plus className="h-4 w-4 mr-1" /> Buat Plan
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Aktual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Belum ada production plan</TableCell></TableRow>
                ) : filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.code}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.startDate} — {p.endDate}</div>
                    </TableCell>
                    <TableCell>{p.targetOutput} {p.outputUnit}</TableCell>
                    <TableCell>{p.actualOutput} {p.outputUnit}</TableCell>
                    <TableCell><Badge className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/manufaktur/production-plans/${p.id}`)}><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/manufaktur/production-plans/${p.id}/edit`)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
