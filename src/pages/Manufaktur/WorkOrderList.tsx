
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllWorkOrders, deleteWorkOrder } from "@/services/manufaktur/workOrderService";
import { WorkOrder, WOStatus } from "@/types/manufaktur";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import * as Text from "@/components/ui/text";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { usePagination } from "@/hooks/ui/usePagination";

const statusVariantClass = (s: WOStatus) => {
  switch (s) {
    case "Draft": return "bg-slate-50 text-slate-400";
    case "In Progress": return "bg-blue-50 text-blue-600";
    case "Completed": return "bg-emerald-50 text-emerald-600";
    case "Cancelled": return "bg-red-50 text-red-600";
    default: return "bg-slate-50 text-slate-400";
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case "Urgent": return "text-red-600 font-bold";
    case "High": return "text-orange-600 font-semibold";
    case "Medium": return "text-slate-800";
    case "Low": return "text-slate-400";
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

  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data: filtered });

  const handleDelete = (id: string) => {
    if (deleteWorkOrder(id)) {
      setWoList(getAllWorkOrders());
      toast.success("Work Order berhasil dihapus");
    }
  };

  return (
    <Layout pageTitle="Work Orders">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={() => navigate("/manufaktur/work-orders/tambah")} className="rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Buat Work Order
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b flex flex-wrap gap-4 items-center justify-between bg-slate-50/10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari produk, kode WO, kode BOM..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-10 rounded-xl" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-10 rounded-xl">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Text.Caption className="not-italic text-slate-400">
            {filtered.length} Work Orders
          </Text.Caption>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[60px] text-center">
                    <Text.Label className="text-slate-500">No</Text.Label>
                  </TableHead>
                  <TableHead><Text.Label className="text-slate-500">Kode WO</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Produk</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Qty</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Prioritas</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Status</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Due Date</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Est. Biaya</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Aksi</Text.Label></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <Wrench className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                      <Text.H2 className="mb-1 text-slate-400">Belum ada data</Text.H2>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((wo, index) => (
                    <TableRow key={wo.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-400 text-xs">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell><Text.Caption className="not-italic font-bold text-slate-400">{wo.code}</Text.Caption></TableCell>
                      <TableCell><Text.Body className="font-bold text-slate-800">{wo.productName}</Text.Body></TableCell>
                      <TableCell className="text-right"><Text.Body className="font-bold">{wo.quantity} {wo.unit}</Text.Body></TableCell>
                      <TableCell><span className={cn("text-xs", priorityColor(wo.priority))}>{wo.priority}</span></TableCell>
                      <TableCell>
                        <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusVariantClass(wo.status))}>
                          {wo.status}
                        </div>
                      </TableCell>
                      <TableCell><Text.Caption className="not-italic text-slate-400">{wo.dueDate || "-"}</Text.Caption></TableCell>
                      <TableCell className="text-right"><Text.Amount className="text-sm">Rp {wo.estimatedCost.toLocaleString("id-ID")}</Text.Amount></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/manufaktur/work-orders/${wo.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[24px]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Work Order?</AlertDialogTitle>
                                <AlertDialogDescription>Work Order "{wo.code}" akan dihapus permanen.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(wo.id)} className="rounded-full bg-red-600 hover:bg-red-700 text-white">Hapus</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <TablePaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalRecords={totalRecords}
            startIndex={startIndex}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            label="work orders"
            className="border-none"
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
