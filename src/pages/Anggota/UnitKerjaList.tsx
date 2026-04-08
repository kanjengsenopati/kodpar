
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, RefreshCcw, Database, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createUnitKerja, updateUnitKerja, deleteUnitKerja, resetUnitKerja } from "@/services/unitKerjaService";
import { UnitKerja } from "@/types/unitKerja";
import { useUnitKerja } from "@/hooks/useUnitKerja";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UnitKerjaList() {
  const { unitKerjaList, isLoading, error, refreshUnitKerja, syncWithAnggota } = useUnitKerja();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setEditId(null);
    setNama("");
    setKeterangan("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleOpenEdit = (unit: UnitKerja) => {
    setEditId(unit.id);
    setNama(unit.nama);
    setKeterangan(unit.keterangan || "");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (nama.trim() === "") {
      toast({title: "Nama Unit Kerja wajib diisi", variant: "destructive"});
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) {
        const result = updateUnitKerja(editId, nama.trim(), keterangan.trim());
        if (result) {
          toast({title: "Unit Kerja berhasil diperbarui"});
        } else {
          throw new Error("Gagal memperbarui unit kerja");
        }
      } else {
        createUnitKerja(nama.trim(), keterangan.trim());
        toast({title: "Unit Kerja berhasil ditambahkan"});
      }
      
      setIsDialogOpen(false);
      refreshUnitKerja();
      resetForm();
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin hapus Unit Kerja ini?")) {
      try {
        const success = deleteUnitKerja(id);
        if (success) {
          toast({title: "Unit Kerja berhasil dihapus"});
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

  const handleReset = async () => {
    if (window.confirm("Reset Unit Kerja ke data dari anggota?")) {
      try {
        resetUnitKerja();
        refreshUnitKerja();
        toast({title: "Unit Kerja direset berdasarkan data anggota"});
      } catch (error) {
        console.error("Error resetting unit kerja:", error);
        toast({
          title: "Error", 
          description: "Gagal mereset unit kerja", 
          variant: "destructive"
        });
      }
    }
  };

  const handleSync = () => {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Master Unit Kerja</h1>
          <p className="text-muted-foreground">
            Kelola data unit kerja dan sinkronisasi dengan data anggota
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isLoading}>
            <Database size={16} className="mr-2" /> 
            Sinkronisasi
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RefreshCcw size={16} className="mr-2" /> 
            Reset Default
          </Button>
          <Button onClick={handleOpenAdd} disabled={isLoading}>
            <Plus size={16} className="mr-2" /> 
            Tambah
          </Button>
        </div>
      </div>
      
      {/* Search field */}
      <div className="mb-4">
        <Input 
          placeholder="Cari unit kerja..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCcw className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat data unit kerja...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  {filteredUnits.length} dari {unitKerjaList.length} unit kerja
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Total: {unitKerjaList.length}
                  </Badge>
                  <Badge variant="secondary">
                    Aktif: {unitKerjaList.filter(u => u.isActive).length}
                  </Badge>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama Unit Kerja</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map(unit => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-mono">{unit.id}</TableCell>
                      <TableCell className="font-medium">{unit.nama}</TableCell>
                      <TableCell>{unit.keterangan || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={unit.isActive ? "default" : "secondary"}>
                          {unit.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(unit.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" onClick={() => handleOpenEdit(unit)}>
                            <Edit size={16}/>
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDelete(unit.id)}>
                            <Trash2 size={16}/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUnits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          {searchQuery ? (
                            <>
                              <p>Tidak ada hasil pencarian</p>
                              <Button variant="outline" onClick={() => setSearchQuery("")}>
                                Hapus Filter
                              </Button>
                            </>
                          ) : (
                            <>
                              <p>Belum ada data unit kerja</p>
                              <div className="flex gap-2">
                                <Button onClick={handleSync} variant="outline">
                                  <Database size={16} className="mr-2" />
                                  Sinkronisasi dari Anggota
                                </Button>
                                <Button onClick={handleOpenAdd}>
                                  <Plus size={16} className="mr-2" />
                                  Tambah Manual
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Unit Kerja" : "Tambah Unit Kerja"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Unit Kerja *</label>
              <Input 
                placeholder="Masukkan nama unit kerja" 
                value={nama} 
                onChange={e => setNama(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Keterangan</label>
              <Input 
                placeholder="Masukkan keterangan (opsional)" 
                value={keterangan} 
                onChange={e => setKeterangan(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
