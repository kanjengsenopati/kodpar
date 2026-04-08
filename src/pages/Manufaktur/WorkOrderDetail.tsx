
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Wrench, ClipboardList } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkOrderById, updateWorkOrder } from "@/services/manufaktur/workOrderService";
import { getBOMById } from "@/services/manufaktur/bomService";
import { WOStatus } from "@/types/manufaktur";
import { toast } from "sonner";

const statusVariant = (s: WOStatus) => {
  switch (s) {
    case "Draft": return "secondary";
    case "In Progress": return "default";
    case "Completed": return "outline";
    case "Cancelled": return "destructive";
    default: return "secondary";
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case "Urgent": return "destructive";
    case "High": return "default";
    default: return "secondary";
  }
};

export default function WorkOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const wo = id ? getWorkOrderById(id) : undefined;

  if (!wo) {
    return (
      <Layout pageTitle="Detail Work Order">
        <div className="text-center py-20 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>Work Order tidak ditemukan</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/manufaktur/work-orders")}>Kembali</Button>
        </div>
      </Layout>
    );
  }

  const bom = getBOMById(wo.bomId);

  const handleStatusChange = (newStatus: WOStatus) => {
    updateWorkOrder(wo.id, { status: newStatus });
    toast.success(`Status diubah menjadi ${newStatus}`);
    navigate(0); // refresh
  };

  const nextStatus: Partial<Record<WOStatus, { label: string; status: WOStatus }>> = {
    Draft: { label: "Mulai Produksi", status: "In Progress" },
    "In Progress": { label: "Selesai Produksi", status: "Completed" },
  };

  const action = nextStatus[wo.status];

  return (
    <Layout pageTitle={`Work Order - ${wo.code}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/manufaktur/work-orders")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
          <div className="flex gap-2">
            {action && (
              <Button size="sm" onClick={() => handleStatusChange(action.status)}>
                {action.label}
              </Button>
            )}
            {wo.status !== "Completed" && wo.status !== "Cancelled" && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}/edit`)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">{wo.code} — {wo.productName}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={statusVariant(wo.status)}>{wo.status}</Badge>
                <Badge variant={priorityColor(wo.priority)}>{wo.priority}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Jumlah Produksi</p>
              <p className="font-bold text-lg">{wo.quantity} {wo.unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tanggal Mulai</p>
              <p className="font-medium">{wo.startDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tanggal Target</p>
              <p className="font-medium">{wo.dueDate || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Selesai</p>
              <p className="font-medium">{wo.completedDate || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ditugaskan</p>
              <p className="font-medium">{wo.assignedTo || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimasi Biaya</p>
              <p className="font-bold text-primary">Rp {wo.estimatedCost.toLocaleString("id-ID")}</p>
            </div>
            {wo.actualCost !== undefined && wo.actualCost > 0 && (
              <div>
                <p className="text-muted-foreground">Biaya Aktual</p>
                <p className="font-bold">Rp {wo.actualCost.toLocaleString("id-ID")}</p>
              </div>
            )}
            {wo.notes && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-muted-foreground">Catatan</p>
                <p>{wo.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked BOM */}
        {bom && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> BOM Terkait
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground">Kode BOM</p>
                  <p className="font-mono font-medium">{bom.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Produk</p>
                  <p className="font-medium">{bom.productName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Material</p>
                  <p>{bom.items.length} item</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Biaya/Unit</p>
                  <p className="font-medium">Rp {bom.totalCost.toLocaleString("id-ID")}</p>
                </div>
              </div>
              <Button variant="link" size="sm" className="mt-2 p-0" onClick={() => navigate(`/manufaktur/bom/${bom.id}`)}>
                Lihat Detail BOM →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {(["Draft", "In Progress", "Completed"] as WOStatus[]).map((s, i) => {
                const isActive = s === wo.status;
                const isPast = ["Draft", "In Progress", "Completed"].indexOf(wo.status) > i;
                return (
                  <React.Fragment key={s}>
                    {i > 0 && <div className={`h-0.5 w-8 ${isPast || isActive ? "bg-primary" : "bg-border"}`} />}
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      isActive ? "bg-primary text-primary-foreground border-primary" :
                      isPast ? "bg-primary/10 text-primary border-primary/30" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>
                      {s}
                    </div>
                  </React.Fragment>
                );
              })}
              {wo.status === "Cancelled" && (
                <>
                  <div className="h-0.5 w-8 bg-destructive" />
                  <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground border border-destructive">
                    Cancelled
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
