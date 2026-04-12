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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusVariantClass = (s: BOM["status"]) => {
    if (s === "Active") return "bg-emerald-50 text-emerald-600";
    if (s === "Draft") return "bg-slate-50 text-slate-400";
    return "bg-slate-50 text-slate-400";
  };

  return (
    <Layout 
      pageTitle="Bill of Materials"
      actions={
        <Button onClick={() => navigate("/manufaktur/bom/tambah")} className="rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Tambah BOM
        </Button>
      }
    >

      <Card className="overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
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
                    <React.Fragment key={bom.id}>
                      <TableRow className={cn(
                        "group border-slate-50 transition-all hover:bg-slate-50/50",
                        expandedId === bom.id && "bg-slate-50/30"
                      )}>
                        <TableCell className="text-center font-bold text-slate-300 text-xs">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell><Text.Caption className="not-italic font-bold text-slate-400">{bom.code}</Text.Caption></TableCell>
                        <TableCell>
                          <Text.Body className="font-bold text-slate-800">{bom.productName}</Text.Body>
                          <Text.Caption className="not-italic text-slate-400 block">{bom.category}</Text.Caption>
                        </TableCell>
                        <TableCell className="text-right pr-4"><Text.Body className="font-semibold">{bom.items.length} Item</Text.Body></TableCell>
                        <TableCell className="text-right"><Text.Amount className="text-sm font-bold">Rp {bom.totalCost.toLocaleString("id-ID")}</Text.Amount></TableCell>
                        <TableCell>
                          <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusVariantClass(bom.status))}>
                            {bom.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1.5">
                            <Button variant="ghost" size="icon" className={cn(
                              "h-8 w-8 rounded-lg transition-all",
                              expandedId === bom.id ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            )} onClick={() => toggleExpand(bom.id)}>
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
                              <AlertDialogContent className="rounded-[24px] border-none shadow-xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus BOM?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    BOM "{bom.productName}" ({bom.code}) akan dihapus permanen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl border-slate-200">Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(bom.id)} className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100">Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {expandedId === bom.id && (
                        <TableRow className="bg-slate-50/30 border-none hover:bg-slate-50/30">
                          <TableCell colSpan={7} className="p-6 pt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-[24px] p-6 shadow-sm border border-slate-50">
                              {/* Col 1: Profil Produk */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                  <Text.H2 className="text-sm">Profil Produk</Text.H2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kode Produk</p>
                                    <p className="text-sm font-bold text-slate-700">{bom.code}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                                    <p className="text-sm font-bold text-slate-700">{bom.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Output Qty</p>
                                    <p className="text-sm font-bold text-slate-700">{bom.outputQuantity} {bom.outputUnit}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", statusVariantClass(bom.status))}>
                                      {bom.status}
                                    </div>
                                  </div>
                                </div>
                                {bom.description && (
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deskripsi</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{bom.description}</p>
                                  </div>
                                )}
                              </div>

                              {/* Col 2: Bahan Baku */}
                              <div className="lg:border-x border-slate-100 lg:px-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                                    <Text.H2 className="text-sm">Bahan Baku</Text.H2>
                                  </div>
                                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{bom.items.length} Material</span>
                                </div>
                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                  {bom.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-white">
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-700">{item.materialName}</p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">{item.quantity} {item.unit} @ Rp {item.unitCost.toLocaleString("id-ID")}</p>
                                      </div>
                                      <p className="text-xs font-bold text-slate-600">Rp {item.totalCost.toLocaleString("id-ID")}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Col 3: Analisis Biaya */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                  <Text.H2 className="text-sm">Analisis Biaya</Text.H2>
                                </div>
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Beban Material</span>
                                    <span className="font-bold text-slate-700">Rp {(bom.totalCost - bom.overheadCost - bom.laborCost).toLocaleString("id-ID")}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Biaya Overhead</span>
                                    <span className="font-bold text-slate-700">Rp {bom.overheadCost.toLocaleString("id-ID")}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Upah Tenaga Kerja</span>
                                    <span className="font-bold text-slate-700">Rp {bom.laborCost.toLocaleString("id-ID")}</span>
                                  </div>
                                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cost</span>
                                    <Text.Amount className="text-base text-blue-600">Rp {bom.totalCost.toLocaleString("id-ID")}</Text.Amount>
                                  </div>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-3 flex justify-between items-center mt-2 border border-blue-100/50">
                                  <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">HPP Per Unit</p>
                                    <p className="text-base font-bold text-blue-700">Rp {Math.round(bom.totalCost / (bom.outputQuantity || 1)).toLocaleString("id-ID")}</p>
                                  </div>
                                  <div className="h-8 w-8 bg-white/50 rounded-lg flex items-center justify-center">
                                    <ClipboardList className="h-4 w-4 text-blue-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
