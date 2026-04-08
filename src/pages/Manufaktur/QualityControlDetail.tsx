
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { getQualityControlById, updateQualityControl } from '@/services/manufaktur/qualityControlService';
import { QualityControl, QCStatus } from '@/types/manufaktur';
import { ArrowLeft, Edit, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<QCStatus, string> = {
  'Pending': 'bg-muted text-muted-foreground',
  'Passed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Conditional': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
};

export default function QualityControlDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qc, setQc] = useState<QualityControl | null>(null);

  useEffect(() => {
    if (id) {
      const data = getQualityControlById(id);
      if (data) setQc(data);
      else { toast.error('QC tidak ditemukan'); navigate('/manufaktur/quality-control'); }
    }
  }, [id]);

  if (!qc) return null;

  const passedCount = qc.checkItems.filter(i => i.passed).length;
  const failedCount = qc.checkItems.filter(i => !i.passed).length;

  const handleSetStatus = (status: QCStatus) => {
    const updated = updateQualityControl(qc.id, { status });
    if (updated) { setQc(updated); toast.success(`Status diubah ke ${status}`); }
  };

  return (
    <Layout pageTitle={`Inspeksi ${qc.code}`}>
      <div className="space-y-6 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/manufaktur/quality-control')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>

        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold">{qc.code}</h2>
          <Badge className={statusColors[qc.status]}>{qc.status}</Badge>
          <Badge variant="outline">{qc.type}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Produk</span><span className="font-medium">{qc.productName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Kode Produk</span><span>{qc.productCode || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span>{qc.batchNumber || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Work Order</span>
                {qc.workOrderCode ? (
                  <span className="font-mono cursor-pointer text-primary" onClick={() => navigate(`/manufaktur/work-orders/${qc.workOrderId}`)}>{qc.workOrderCode}</span>
                ) : <span>-</span>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tanggal Inspeksi</span><span>{qc.inspectionDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Inspektur</span><span>{qc.inspector}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ukuran Sampel</span><span>{qc.sampleSize}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Defect</span><span className={failedCount > 0 ? 'text-destructive font-bold' : ''}>{failedCount}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Check Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Checklist ({passedCount} Lulus, {failedCount} Gagal)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Standar</TableHead>
                  <TableHead>Aktual</TableHead>
                  <TableHead>Hasil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qc.checkItems.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Tidak ada item checklist</TableCell></TableRow>
                ) : qc.checkItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.parameter}</TableCell>
                    <TableCell>{item.standard}</TableCell>
                    <TableCell>{item.actual}</TableCell>
                    <TableCell>
                      {item.passed ? (
                        <div className="flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /> Lulus</div>
                      ) : (
                        <div className="flex items-center gap-1 text-destructive"><XCircle className="h-4 w-4" /> Gagal</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {qc.overallNotes && (
          <Card>
            <CardHeader><CardTitle className="text-base">Catatan</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{qc.overallNotes}</p></CardContent>
          </Card>
        )}

        <div className="flex gap-3 flex-wrap">
          {qc.status === 'Pending' && (
            <>
              <Button onClick={() => handleSetStatus('Passed')} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" /> Tandai Lulus
              </Button>
              <Button variant="destructive" onClick={() => handleSetStatus('Failed')}>
                <XCircle className="h-4 w-4 mr-1" /> Tandai Gagal
              </Button>
              <Button variant="outline" onClick={() => handleSetStatus('Conditional')}>Conditional</Button>
            </>
          )}
          <Button variant="outline" onClick={() => navigate(`/manufaktur/quality-control/${qc.id}/edit`)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>
    </Layout>
  );
}
