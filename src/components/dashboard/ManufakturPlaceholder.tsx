
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, ArrowRight, Wrench, CalendarRange, CheckSquare, Warehouse, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllBOM } from "@/services/manufaktur/bomService";
import { getAllWorkOrders } from "@/services/manufaktur/workOrderService";
import { getAllProductionPlans } from "@/services/manufaktur/productionPlanService";
import { getAllQualityControls } from "@/services/manufaktur/qualityControlService";
import { getAllInventory, getLowStockItems } from "@/services/manufaktur/inventoryService";
import { BOM } from "@/types/manufaktur";
import { Badge } from "@/components/ui/badge";

export function ManufakturPlaceholder() {
  const navigate = useNavigate();
  const [bomList, setBomList] = useState<BOM[]>([]);
  const [woStats, setWoStats] = useState({ total: 0, draft: 0, inProgress: 0, completed: 0 });
  const [ppStats, setPpStats] = useState({ total: 0, inProduction: 0 });
  const [qcStats, setQcStats] = useState({ total: 0, passed: 0, failed: 0, pending: 0 });
  const [invStats, setInvStats] = useState({ total: 0, lowStock: 0, totalValue: 0 });

  useEffect(() => {
    setBomList(getAllBOM());
    const wos = getAllWorkOrders();
    setWoStats({
      total: wos.length,
      draft: wos.filter(w => w.status === 'Draft').length,
      inProgress: wos.filter(w => w.status === 'In Progress').length,
      completed: wos.filter(w => w.status === 'Completed').length,
    });
    const pps = getAllProductionPlans();
    setPpStats({ total: pps.length, inProduction: pps.filter(p => p.status === 'In Production').length });
    const qcs = getAllQualityControls();
    setQcStats({ total: qcs.length, passed: qcs.filter(q => q.status === 'Passed').length, failed: qcs.filter(q => q.status === 'Failed').length, pending: qcs.filter(q => q.status === 'Pending').length });
    const inv = getAllInventory();
    const low = getLowStockItems();
    setInvStats({ total: inv.length, lowStock: low.length, totalValue: inv.reduce((s, i) => s + i.totalValue, 0) });
  }, []);

  const activeBOM = bomList.filter(b => b.status === 'Active').length;
  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Manufaktur</h2>
        <p className="text-sm text-muted-foreground">Pengelolaan produksi end-to-end: BOM, Work Orders, Planning, QC & Inventory</p>
      </div>

      {/* Low stock alert */}
      {invStats.lowStock > 0 && (
        <Card className="border-destructive bg-destructive/5 cursor-pointer" onClick={() => navigate('/manufaktur/inventory')}>
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-bold text-destructive">{invStats.lowStock} material di bawah stok minimum</p>
              <p className="text-xs text-muted-foreground">Klik untuk melihat detail inventory</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/bom")}>
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><ClipboardList className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-xs text-muted-foreground">BOM</span>
            <p className="text-2xl font-bold">{bomList.length}</p>
            <p className="text-xs text-muted-foreground">{activeBOM} aktif</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/work-orders")}>
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Wrench className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-xs text-muted-foreground">Work Orders</span>
            <p className="text-2xl font-bold">{woStats.total}</p>
            <p className="text-xs text-muted-foreground">{woStats.inProgress} berjalan</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/production-plans")}>
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><CalendarRange className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-xs text-muted-foreground">Planning</span>
            <p className="text-2xl font-bold">{ppStats.total}</p>
            <p className="text-xs text-muted-foreground">{ppStats.inProduction} produksi</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/quality-control")}>
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><CheckSquare className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-xs text-muted-foreground">QC</span>
            <p className="text-2xl font-bold">{qcStats.total}</p>
            <p className="text-xs text-muted-foreground">{qcStats.passed} lulus, {qcStats.failed} gagal</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/inventory")}>
          <CardContent className="pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Warehouse className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-xs text-muted-foreground">Inventory</span>
            <p className="text-2xl font-bold">{invStats.total}</p>
            <p className="text-xs text-muted-foreground">{invStats.lowStock > 0 ? `${invStats.lowStock} rendah` : 'Stok aman'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Nilai Inventory</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(invStats.totalValue)}</p>
            <p className="text-xs text-muted-foreground">total bahan baku</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle className="text-base">Aksi Cepat</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate("/manufaktur/bom/tambah")}><Plus className="h-4 w-4 mr-1" /> BOM</Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/manufaktur/work-orders/tambah")}><Plus className="h-4 w-4 mr-1" /> Work Order</Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/manufaktur/production-plans/tambah")}><Plus className="h-4 w-4 mr-1" /> Plan</Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/manufaktur/quality-control/tambah")}><Plus className="h-4 w-4 mr-1" /> Inspeksi QC</Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/manufaktur/inventory")}><Warehouse className="h-4 w-4 mr-1" /> Inventory</Button>
        </CardContent>
      </Card>
    </div>
  );
}
