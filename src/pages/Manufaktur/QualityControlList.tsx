
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { getAllQualityControls, deleteQualityControl } from '@/services/manufaktur/qualityControlService';
import { QualityControl, QCStatus, QC_TYPES } from '@/types/manufaktur';
import { Plus, Search, Eye, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<QCStatus, string> = {
  'Pending': 'bg-muted text-muted-foreground',
  'Passed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Conditional': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

export default function QualityControlList() {
  const navigate = useNavigate();
  const [qcList, setQcList] = useState<QualityControl[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { setQcList(getAllQualityControls()); }, []);

  const filtered = qcList.filter(q => {
    const matchSearch = q.code.toLowerCase().includes(search.toLowerCase()) || q.productName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || q.type === filterType;
    return matchSearch && matchType;
  });

  const handleDelete = (id: string) => {
    if (confirm('Hapus inspeksi QC ini?')) {
      deleteQualityControl(id);
      setQcList(getAllQualityControls());
      toast.success('Inspeksi QC dihapus');
    }
  };

  return (
    <Layout pageTitle="Quality Control">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari inspeksi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {QC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => navigate('/manufaktur/quality-control/tambah')}>
            <Plus className="h-4 w-4 mr-1" /> Buat Inspeksi
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>WO</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Inspektur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Belum ada inspeksi QC</TableCell></TableRow>
                ) : filtered.map(q => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-sm">{q.code}</TableCell>
                    <TableCell><Badge variant="outline">{q.type}</Badge></TableCell>
                    <TableCell className="font-medium">{q.productName}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{q.workOrderCode || '-'}</TableCell>
                    <TableCell className="text-sm">{q.inspectionDate}</TableCell>
                    <TableCell className="text-sm">{q.inspector}</TableCell>
                    <TableCell><Badge className={statusColors[q.status]}>{q.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/manufaktur/quality-control/${q.id}`)}><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/manufaktur/quality-control/${q.id}/edit`)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
