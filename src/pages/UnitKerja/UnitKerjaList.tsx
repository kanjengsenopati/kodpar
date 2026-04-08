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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createUnitKerja, updateUnitKerja, deleteUnitKerja } from "@/services/unitKerjaService";
import { UnitKerja } from "@/types/unitKerja";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Layout pageTitle="Unit Kerja">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Master Unit Kerja</h1>
            <p className="text-muted-foreground mt-1">
              Kelola unit kerja dan sinkronisasi dengan data anggota
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSyncWithAnggota} disabled={isLoading}>
              <Database className="h-4 w-4 mr-2" />
              Sinkronisasi
            </Button>
            <Button onClick={refreshUnitKerja} variant="outline" disabled={isLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Unit Kerja
            </Button>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Cari unit kerja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <div className="text-sm text-muted-foreground">
              {filteredUnits.length} dari {unitKerjaList.length} unit kerja
            </div>
          </div>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCcw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Memuat data unit kerja...</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <Card key={unit.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {unit.nama}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {unit.id}
                    </Badge>
                    {unit.isActive && (
                      <Badge variant="success" className="text-xs">
                        Aktif
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unit.keterangan && (
                    <div className="text-sm text-muted-foreground">
                      {unit.keterangan}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Dibuat: {new Date(unit.createdAt).toLocaleDateString('id-ID')}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenEdit(unit)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDelete(unit)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUnits.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum Ada Unit Kerja'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Coba ubah kata kunci pencarian'
                    : 'Mulai dengan menambahkan unit kerja baru atau sinkronisasi dengan data anggota'
                  }
                </p>
                {!searchQuery && (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleSyncWithAnggota} variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Sinkronisasi dari Anggota
                    </Button>
                    <Button onClick={handleOpenAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Manual
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama Unit Kerja</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum Ada Unit Kerja'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery 
                            ? 'Coba ubah kata kunci pencarian'
                            : 'Mulai dengan menambahkan unit kerja baru atau sinkronisasi dengan data anggota'
                          }
                        </p>
                        {!searchQuery && (
                          <div className="flex gap-2 justify-center">
                            <Button onClick={handleSyncWithAnggota} variant="outline">
                              <Database className="h-4 w-4 mr-2" />
                              Sinkronisasi dari Anggota
                            </Button>
                            <Button onClick={handleOpenAdd}>
                              <Plus className="h-4 w-4 mr-2" />
                              Tambah Manual
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUnits.map((unit) => (
                      <TableRow key={unit.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {unit.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            {unit.nama}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {unit.keterangan || '-'}
                        </TableCell>
                        <TableCell>
                          {unit.isActive ? (
                            <Badge variant="success" className="text-xs">
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(unit.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenEdit(unit)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(unit)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
