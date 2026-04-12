import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, RefreshCcw, Database, Edit, Trash2, AlertTriangle, Grid3X3, List } from "lucide-react";
import { useUnitKerja } from "@/hooks/useUnitKerja";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as Text from "@/components/ui/text";
import { usePagination } from "@/hooks/ui/usePagination";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createUnitKerja, updateUnitKerja, deleteUnitKerja } from "@/services/unitKerjaService";
import { UnitKerja } from "@/types/unitKerja";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function UnitKerjaList() {
  const { unitKerjaList, isLoading, error, refreshUnitKerja, syncWithAnggota } = useUnitKerja();
  const { toast } = useToast();
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitKerja | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    keterangan: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleSyncWithAnggota = () => {
    const syncedCount = syncWithAnggota();
    if (syncedCount > 0) {
      toast({
        title: "Sinkronisasi Berhasil",
        description: `${syncedCount} unit kerja baru ditambahkan dari data anggota`,
      });
    } else {
      toast({
        title: "Sinkronisasi Selesai",
        description: "Tidak ada unit kerja baru yang perlu ditambahkan",
      });
    }
  };

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setFormData({ nama: "", keterangan: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (unit: UnitKerja) => {
    setEditingUnit(unit);
    setFormData({
      nama: unit.nama,
      keterangan: unit.keterangan || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama.trim()) {
      toast({
        title: "Error",
        description: "Nama unit kerja wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUnit) {
        const result = updateUnitKerja(editingUnit.id, formData.nama.trim(), formData.keterangan.trim());
        if (result) {
          toast({
            title: "Berhasil",
            description: "Unit kerja berhasil diperbarui"
          });
        } else {
          throw new Error("Gagal memperbarui unit kerja");
        }
      } else {
        createUnitKerja(formData.nama.trim(), formData.keterangan.trim());
        toast({
          title: "Berhasil",
          description: "Unit kerja berhasil ditambahkan"
        });
      }
      
      setIsDialogOpen(false);
      refreshUnitKerja();
    } catch (error) {
      console.error("Error saving unit kerja:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan unit kerja",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (unit: UnitKerja) => {
    if (window.confirm(`Yakin ingin menghapus unit kerja "${unit.nama}"?`)) {
      try {
        const success = deleteUnitKerja(unit.id);
        if (success) {
          toast({
            title: "Berhasil",
            description: "Unit kerja berhasil dihapus"
          });
          refreshUnitKerja();
        } else {
          throw new Error("Gagal menghapus unit kerja");
        }
      } catch (error) {
        console.error("Error deleting unit kerja:", error);
        toast({
          title: "Error",
          description: "Gagal menghapus unit kerja",
          variant: "destructive"
        });
      }
    }
  };

  // Filter units based on search query
  const filteredUnits = unitKerjaList.filter(unit =>
    unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (unit.keterangan && unit.keterangan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Initialize pagination
  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data: filteredUnits });

  if (error) {
    return (
      <Layout pageTitle="Unit Kerja">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button onClick={refreshUnitKerja} variant="outline" size="sm" className="ml-2">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout 
      pageTitle="Unit Kerja"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncWithAnggota} disabled={isLoading} size="sm" className="rounded-full shadow-sm">
            <Database className="h-4 w-4 mr-2" />
            Sinkronisasi
          </Button>
          <Button onClick={refreshUnitKerja} variant="outline" disabled={isLoading} size="sm" className="rounded-full shadow-sm">
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleOpenAdd} size="sm" className="rounded-full shadow-md bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Unit Kerja
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Cari unit kerja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <Text.Body className="text-slate-500 hidden lg:block">
              {filteredUnits.length} dari {unitKerjaList.length} unit
            </Text.Body>
          </div>
          
          <div className="flex bg-slate-50 p-1 rounded-xl shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                "rounded-lg h-8 transition-all px-4",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400"
              )}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              <Text.Label className={viewMode === 'grid' ? "text-blue-600" : "text-slate-400"}>Grid</Text.Label>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('table')}
              className={cn(
                "rounded-lg h-8 transition-all px-4",
                viewMode === 'table' ? "bg-white shadow-sm text-blue-600" : "text-slate-400"
              )}
            >
              <List className="h-4 w-4 mr-2" />
              <Text.Label className={viewMode === 'table' ? "text-blue-600" : "text-slate-400"}>Table</Text.Label>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-slate-50/50 rounded-[24px]">
            <div className="text-center">
              <RefreshCcw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <Text.Body>Memuat data unit kerja...</Text.Body>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((unit) => (
                <Card key={unit.id} className="hover:shadow-md transition-all group overflow-hidden relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-blue-50 p-2.5 rounded-2xl group-hover:scale-110 transition-transform">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex gap-1.5 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                          onClick={() => handleOpenEdit(unit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          onClick={() => handleDelete(unit)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Text.H2 className="block truncate">{unit.nama}</Text.H2>
                      <div className="flex items-center gap-2 mt-1">
                        {unit.isActive && (
                          <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                            Aktif
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-5">
                    <Text.Body className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                      {unit.keterangan || 'Tidak ada keterangan tambahan'}
                    </Text.Body>
                    
                    <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                      <Text.Caption className="not-italic text-slate-300">
                        {new Date(unit.createdAt).toLocaleDateString('id-ID')}
                      </Text.Caption>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {paginatedData.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-20 bg-slate-50/50 rounded-[24px]">
                  <Building2 className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                  <Text.H2 className="mb-2">
                    {searchQuery ? 'Hasil tidak ditemukan' : 'Belum Ada Unit Kerja'}
                  </Text.H2>
                  <Text.Body className="text-slate-400 mb-6">
                    Mulai dengan menambahkan unit kerja baru
                  </Text.Body>
                  {!searchQuery && (
                    <Button onClick={handleOpenAdd} className="rounded-full shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Unit Pertama
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <TablePaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              startIndex={startIndex}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              label="unit kerja"
              className="rounded-[24px] shadow-sm bg-white"
            />
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-[60px] text-center">
                        <Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">No</Text.Label>
                      </TableHead>
                      <TableHead><Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">Nama Unit Kerja</Text.Label></TableHead>
                      <TableHead><Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">Keterangan</Text.Label></TableHead>
                      <TableHead><Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">Status</Text.Label></TableHead>
                      <TableHead><Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">Dibuat</Text.Label></TableHead>
                      <TableHead className="text-right"><Text.Label className="text-slate-500 uppercase tracking-wider text-[10px]">Aksi</Text.Label></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20">
                          <Building2 className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                          <Text.H2 className="mb-2">Data tidak tersedia</Text.H2>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((unit, index) => (
                        <TableRow key={unit.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="text-center">
                            <Text.Caption className="not-italic text-slate-500 font-medium">
                              {startIndex + index + 1}
                            </Text.Caption>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                              <Text.Body className="font-semibold text-slate-700">{unit.nama}</Text.Body>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Text.Body className="text-slate-500 truncate max-w-xs">
                              {unit.keterangan || '-'}
                            </Text.Body>
                          </TableCell>
                          <TableCell>
                            {unit.isActive ? (
                              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                                Aktif
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                Nonaktif
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Text.Caption className="not-italic text-slate-500 font-medium">
                              {new Date(unit.createdAt).toLocaleDateString('id-ID')}
                            </Text.Caption>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                                onClick={() => handleOpenEdit(unit)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                                onClick={() => handleDelete(unit)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                label="unit kerja"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUnit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Unit Kerja *</label>
              <Input
                placeholder="Masukkan nama unit kerja"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Keterangan</label>
              <Input
                placeholder="Masukkan keterangan (opsional)"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
