
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Trash2, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllBOM, deleteBOM } from "@/services/manufaktur/bomService";
import { BOM } from "@/types/manufaktur";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

  const handleDelete = (id: string) => {
    if (deleteBOM(id)) {
      setBomList(getAllBOM());
      toast.success("BOM berhasil dihapus");
    }
  };

  const statusColor = (s: BOM["status"]) => {
    if (s === "Active") return "default";
    if (s === "Draft") return "secondary";
    return "outline";
  };

  return (
    <Layout pageTitle="Bill of Materials">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            Daftar BOM
          </CardTitle>
          <Button size="sm" onClick={() => navigate("/manufaktur/bom/tambah")}>
            <Plus className="h-4 w-4 mr-1" /> Tambah BOM
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk, kode, kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Belum ada data BOM</p>
              <p className="text-sm">Klik "Tambah BOM" untuk membuat Bill of Materials baru</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Material</TableHead>
                    <TableHead className="text-right">Total Biaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((bom) => (
                    <TableRow key={bom.id}>
                      <TableCell className="font-mono text-sm">{bom.code}</TableCell>
                      <TableCell className="font-medium">{bom.productName}</TableCell>
                      <TableCell>{bom.category}</TableCell>
                      <TableCell className="text-right">{bom.items.length} item</TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {bom.totalCost.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColor(bom.status)}>{bom.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/manufaktur/bom/${bom.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/manufaktur/bom/${bom.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus BOM?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  BOM "{bom.productName}" ({bom.code}) akan dihapus permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(bom.id)}>Hapus</AlertDialogAction>
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
