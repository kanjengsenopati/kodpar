
import React, { useEffect, useState } from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList, Wrench, CalendarRange, CheckSquare, Warehouse,
  AlertTriangle, Plus, TrendingUp, TrendingDown, Activity, ArrowRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getAllBOM } from "@/services/manufaktur/bomService";
import { getAllWorkOrders } from "@/services/manufaktur/workOrderService";
import { getAllProductionPlans } from "@/services/manufaktur/productionPlanService";
import { getAllQualityControls } from "@/services/manufaktur/qualityControlService";
import { getAllInventory, getLowStockItems, getAllStockMovements } from "@/services/manufaktur/inventoryService";
import { BOM, WorkOrder, ProductionPlan, QualityControl, ManufakturInventory, StockMovement } from "@/types/manufaktur";

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--destructive))',
  'hsl(210, 70%, 55%)',
  'hsl(45, 80%, 55%)',
  'hsl(150, 60%, 45%)',
  'hsl(280, 60%, 55%)',
];

export default function ManufakturDashboard() {
  const navigate = useNavigate();
  const [boms, setBoms] = useState<BOM[]>([]);
  const [wos, setWos] = useState<WorkOrder[]>([]);
  const [pps, setPps] = useState<ProductionPlan[]>([]);
  const [qcs, setQcs] = useState<QualityControl[]>([]);
  const [inventory, setInventory] = useState<ManufakturInventory[]>([]);
  const [lowStock, setLowStock] = useState<ManufakturInventory[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    setBoms(getAllBOM());
    setWos(getAllWorkOrders());
    setPps(getAllProductionPlans());
    setQcs(getAllQualityControls());
    setInventory(getAllInventory());
    setLowStock(getLowStockItems());
    setMovements(getAllStockMovements());
  }, []);

  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  // WO status data for chart
  const woStatusData = [
    { name: 'Draft', value: wos.filter(w => w.status === 'Draft').length },
    { name: 'In Progress', value: wos.filter(w => w.status === 'In Progress').length },
    { name: 'Completed', value: wos.filter(w => w.status === 'Completed').length },
    { name: 'Cancelled', value: wos.filter(w => w.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  // QC status data for chart
  const qcStatusData = [
    { name: 'Passed', value: qcs.filter(q => q.status === 'Passed').length },
    { name: 'Failed', value: qcs.filter(q => q.status === 'Failed').length },
    { name: 'Pending', value: qcs.filter(q => q.status === 'Pending').length },
    { name: 'Conditional', value: qcs.filter(q => q.status === 'Conditional').length },
  ].filter(d => d.value > 0);

  // Top 5 inventory by value
  const topInventory = [...inventory]
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 6)
    .map(i => ({ name: i.materialName.length > 12 ? i.materialName.slice(0, 12) + '…' : i.materialName, value: i.totalValue }));

  // Recent activities (combine recent WOs, QCs, movements)
  const recentActivities: { time: string; icon: React.ElementType; text: string; color: string }[] = [];

  wos.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3).forEach(wo => {
    recentActivities.push({
      time: new Date(wo.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      icon: Wrench,
      text: `${wo.code} — ${wo.productName} (${wo.status})`,
      color: wo.status === 'Completed' ? 'text-green-600' : wo.status === 'In Progress' ? 'text-blue-600' : 'text-muted-foreground',
    });
  });

  qcs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 2).forEach(qc => {
    recentActivities.push({
      time: new Date(qc.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      icon: CheckSquare,
      text: `${qc.code} — ${qc.productName} (${qc.status})`,
      color: qc.status === 'Passed' ? 'text-green-600' : qc.status === 'Failed' ? 'text-destructive' : 'text-muted-foreground',
    });
  });

  movements.slice(0, 3).forEach(m => {
    recentActivities.push({
      time: new Date(m.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      icon: Warehouse,
      text: `${m.materialName} — ${m.type} ${m.quantity} (${m.previousStock}→${m.newStock})`,
      color: m.type === 'In' ? 'text-green-600' : m.type === 'Out' ? 'text-destructive' : 'text-muted-foreground',
    });
  });

  const totalInvValue = inventory.reduce((s, i) => s + i.totalValue, 0);
  const totalEstCost = wos.filter(w => w.status === 'In Progress').reduce((s, w) => s + w.estimatedCost, 0);

  return (
    <Layout pageTitle="Dashboard Manufaktur">
      <div className="space-y-6">
        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <Card className="border-destructive bg-destructive/5 cursor-pointer" onClick={() => navigate('/manufaktur/inventory')}>
            <CardContent className="pt-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-bold text-destructive">{lowStock.length} material di bawah stok minimum</p>
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
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><ClipboardList className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">BOM</span>
              </div>
              <p className="text-2xl font-bold">{boms.length}</p>
              <p className="text-xs text-muted-foreground">{boms.filter(b => b.status === 'Active').length} aktif</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/work-orders")}>
            <CardContent className="pt-5 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><Wrench className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">Work Orders</span>
              </div>
              <p className="text-2xl font-bold">{wos.length}</p>
              <p className="text-xs text-muted-foreground">{wos.filter(w => w.status === 'In Progress').length} berjalan</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/production-plans")}>
            <CardContent className="pt-5 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><CalendarRange className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">Planning</span>
              </div>
              <p className="text-2xl font-bold">{pps.length}</p>
              <p className="text-xs text-muted-foreground">{pps.filter(p => p.status === 'In Production').length} produksi</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/quality-control")}>
            <CardContent className="pt-5 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><CheckSquare className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">QC</span>
              </div>
              <p className="text-2xl font-bold">{qcs.length}</p>
              <p className="text-xs text-muted-foreground">{qcs.filter(q => q.status === 'Passed').length} lulus</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate("/manufaktur/inventory")}>
            <CardContent className="pt-5 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><Warehouse className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">Inventory</span>
              </div>
              <p className="text-2xl font-bold">{inventory.length}</p>
              <p className="text-xs text-muted-foreground">{lowStock.length > 0 ? `${lowStock.length} rendah` : 'Stok aman'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center"><TrendingUp className="h-3.5 w-3.5 text-primary" /></div>
                <span className="text-xs font-medium text-muted-foreground">Nilai Inventory</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(totalInvValue)}</p>
              <p className="text-xs text-muted-foreground">total bahan baku</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* WO Status Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Status Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {woStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={woStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
                      {woStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data</div>
              )}
            </CardContent>
          </Card>

          {/* QC Status Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Hasil Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              {qcStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={qcStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
                      {qcStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data</div>
              )}
            </CardContent>
          </Card>

          {/* Top Inventory Bar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Inventory (Nilai)</CardTitle>
            </CardHeader>
            <CardContent>
              {topInventory.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topInventory} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} fontSize={10} />
                    <YAxis type="category" dataKey="name" width={80} fontSize={10} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" /> Aktivitas Terkini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.slice(0, 8).map((act, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-xs text-muted-foreground w-14 flex-shrink-0 pt-0.5">{act.time}</span>
                      <act.icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${act.color}`} />
                      <span className="text-foreground">{act.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Belum ada aktivitas</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start" onClick={() => navigate("/manufaktur/bom/tambah")}>
                <Plus className="h-4 w-4 mr-2" /> Buat BOM Baru
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => navigate("/manufaktur/work-orders/tambah")}>
                <Plus className="h-4 w-4 mr-2" /> Buat Work Order
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => navigate("/manufaktur/production-plans/tambah")}>
                <Plus className="h-4 w-4 mr-2" /> Buat Production Plan
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => navigate("/manufaktur/quality-control/tambah")}>
                <Plus className="h-4 w-4 mr-2" /> Buat Inspeksi QC
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => navigate("/manufaktur/inventory")}>
                <Warehouse className="h-4 w-4 mr-2" /> Kelola Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
