
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductionPlanById, updateProductionPlan } from '@/services/manufaktur/productionPlanService';
import { getWorkOrderById } from '@/services/manufaktur/workOrderService';
import { ProductionPlan, PPStatus } from '@/types/manufaktur';
import { ArrowLeft, Edit, Calendar, User, Target, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<PPStatus, string> = {
  'Draft': 'bg-muted text-muted-foreground',
  'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'In Production': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const nextStatus: Record<string, PPStatus | null> = {
  'Draft': 'Confirmed', 'Confirmed': 'In Production', 'In Production': 'Completed', 'Completed': null, 'Cancelled': null,
};

export default function ProductionPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<ProductionPlan | null>(null);

  useEffect(() => {
    if (id) {
      const p = getProductionPlanById(id);
      if (p) setPlan(p);
      else { toast.error('Plan tidak ditemukan'); navigate('/manufaktur/production-plans'); }
    }
  }, [id]);

  if (!plan) return null;

  const handleAdvanceStatus = () => {
    const next = nextStatus[plan.status];
    if (!next) return;
    const updated = updateProductionPlan(plan.id, { status: next });
    if (updated) { setPlan(updated); toast.success(`Status diubah ke ${next}`); }
  };

  const linkedWOs = plan.workOrderIds.map(woId => getWorkOrderById(woId)).filter(Boolean);
  const progress = plan.targetOutput > 0 ? Math.round((plan.actualOutput / plan.targetOutput) * 100) : 0;

  return (
    <Layout pageTitle={`Production Plan ${plan.code}`}>
      <div className="space-y-6 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/manufaktur/production-plans')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>

        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold">{plan.code} — {plan.name}</h2>
          <Badge className={statusColors[plan.status]}>{plan.status}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{plan.startDate} — {plan.endDate}</span></div>
              <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /><span>Supervisor: {plan.supervisor || '-'}</span></div>
              <div className="flex items-center gap-2 text-sm"><Target className="h-4 w-4 text-muted-foreground" /><span>Shift: {plan.shift || '-'}</span></div>
              {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm"><span>Target Output</span><span className="font-bold">{plan.targetOutput} {plan.outputUnit}</span></div>
              <div className="flex justify-between text-sm"><span>Aktual Output</span><span className="font-bold">{plan.actualOutput} {plan.outputUnit}</span></div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">{progress}% tercapai</p>
            </CardContent>
          </Card>
        </div>

        {/* Linked Work Orders */}
        <Card>
          <CardHeader><CardTitle className="text-base">Work Orders Terkait ({linkedWOs.length})</CardTitle></CardHeader>
          <CardContent>
            {linkedWOs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada WO terkait</p>
            ) : (
              <div className="space-y-2">
                {linkedWOs.map(wo => wo && (
                  <div key={wo.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 cursor-pointer hover:bg-accent" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}`)}>
                    <div className="flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-mono text-sm">{wo.code}</span>
                        <span className="text-sm ml-2">{wo.productName}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{wo.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {nextStatus[plan.status] && (
            <Button onClick={handleAdvanceStatus}>Ubah ke {nextStatus[plan.status]}</Button>
          )}
          <Button variant="outline" onClick={() => navigate(`/manufaktur/production-plans/${plan.id}/edit`)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>
    </Layout>
  );
}
