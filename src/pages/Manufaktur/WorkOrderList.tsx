
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllWorkOrders, deleteWorkOrder } from "@/services/manufaktur/workOrderService";
import { WorkOrder, WOStatus } from "@/types/manufaktur";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    case "Urgent": return "text-destructive font-bold";
    case "High": return "text-orange-600 font-semibold";
    case "Medium": return "text-foreground";
    case "Low": return "text-muted-foreground";
    default: return "";
  }
};

export default function WorkOrderList() {
  const navigate = useNavigate();
  const [woList, setWoList] = useState<WorkOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setWoList(getAllWorkOrders());
  }, []);

  const filtered = woList.filter((wo) => {
    const matchSearch =
      wo.productName.toLowerCase().includes(search.toLowerCase()) ||
      wo.code.toLowerCase().includes(search.toLowerCase()) ||
      wo.bomCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || wo.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    if (deleteWorkOrder(id)) {
      setWoList(getAllWorkOrders());
      toast.success("Work Order berhasil dihapus");
    }
  };

  return (
    <Layout pageTitle="Work Orders">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5" />
            Daftar Work Order
          </CardTitle>
          <Button size="sm" onClick={() => navigate("/manufaktur/work-orders/tambah")}>
            <Plus className="h-4 w-4 mr-1" /> Buat Work Order
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari produk, kode WO, kode BOM..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Belum ada Work Order</p>
              <p className="text-sm">Klik "Buat Work Order" untuk membuat perintah kerja baru</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode WO</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>BOM</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Est. Biaya</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell className="font-mono text-sm">{wo.code}</TableCell>
                      <TableCell className="font-medium">{wo.productName}</TableCell>
                      <TableCell className="font-mono text-sm">{wo.bomCode}</TableCell>
                      <TableCell className="text-right">{wo.quantity} {wo.unit}</TableCell>
                      <TableCell><span className={priorityColor(wo.priority)}>{wo.priority}</span></TableCell>
                      <TableCell><Badge variant={statusVariant(wo.status)}>{wo.status}</Badge></TableCell>
                      <TableCell>{wo.dueDate || "-"}</TableCell>
                      <TableCell className="text-right font-medium">Rp {wo.estimatedCost.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Work Order?</AlertDialogTitle>
                                <AlertDialogDescription>Work Order "{wo.code}" akan dihapus permanen.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(wo.id)}>Hapus</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
