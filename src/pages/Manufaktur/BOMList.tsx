import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllBOM, deleteBOM } from "@/services/manufaktur/bomService";
import { BOM } from "@/types/manufaktur";
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
import { toast } from "sonner";
import * as Text from "@/components/ui/text";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { usePagination } from "@/hooks/ui/usePagination";
import { cn } from "@/lib/utils";

export default function BOMList() {
  const navigate = useNavigate();
  const [bomList, setBomList] = useState<BOM[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setBomList(getAllBOM());
  }, []);

  const filtered = bomList.filter(
    (b) =>
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

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
    if (deleteBOM(id)) {
      setBomList(getAllBOM());
      toast.success("BOM berhasil dihapus");
    }
  };

  const statusVariantClass = (s: BOM["status"]) => {
    if (s === "Active") return "bg-emerald-50 text-emerald-600";
    if (s === "Draft") return "bg-slate-50 text-slate-400";
    return "bg-slate-50 text-slate-400";
  };

  return (
    <Layout pageTitle="Bill of Materials">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={() => navigate("/manufaktur/bom/tambah")} className="rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Tambah BOM
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari produk, kode, kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>
          <Text.Caption className="not-italic text-slate-400">
            {filtered.length} BOM Records
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
                  <TableHead><Text.Label className="text-slate-500">Kode</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Produk</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Material</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Total Biaya</Text.Label></TableHead>
                  <TableHead><Text.Label className="text-slate-500">Status</Text.Label></TableHead>
                  <TableHead className="text-right"><Text.Label className="text-slate-500">Aksi</Text.Label></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <ClipboardList className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                      <Text.H2 className="mb-1 text-slate-400">Belum ada data BOM</Text.H2>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((bom, index) => (
                    <TableRow key={bom.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-400 text-xs">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell><Text.Caption className="not-italic font-bold text-slate-400">{bom.code}</Text.Caption></TableCell>
                      <TableCell>
                        <Text.Body className="font-bold text-slate-800">{bom.productName}</Text.Body>
                        <Text.Caption className="not-italic text-slate-400 block">{bom.category}</Text.Caption>
                      </TableCell>
                      <TableCell className="text-right"><Text.Body>{bom.items.length} item</Text.Body></TableCell>
                      <TableCell className="text-right"><Text.Amount className="text-sm font-bold">Rp {bom.totalCost.toLocaleString("id-ID")}</Text.Amount></TableCell>
                      <TableCell>
                        <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusVariantClass(bom.status))}>
                          {bom.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/manufaktur/bom/${bom.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/manufaktur/bom/${bom.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[24px]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus BOM?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  BOM "{bom.productName}" ({bom.code}) akan dihapus permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(bom.id)} className="rounded-full bg-red-600 hover:bg-red-700 text-white">Hapus</AlertDialogAction>
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
            label="BOM"
            className="border-none"
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
