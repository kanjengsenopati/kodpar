import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Kasir, User as UserType } from "@/types";
import { getAllKasir, createKasir, updateKasir, deleteKasir, initSampleKasirData } from "@/services/kasirService";
import { getUsers } from "@/services/userManagementService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export default function NamaKasir() {
  const { toast } = useToast();
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredKasir, setFilteredKasir] = useState<Kasir[]>([]);
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    noHp: "",
    username: "",
    userId: "",
    role: "kasir" as "admin" | "kasir"
  });

  // Load kasir and users on component mount
  useEffect(() => {
    initSampleKasirData(); // Initialize sample data if needed
    loadKasirAndUsers();
  }, []);

  // Filter kasir when search query or kasir list changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredKasir(kasirList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = kasirList.filter(
        (kasir) =>
          kasir.nama.toLowerCase().includes(query) ||
          kasir.username.toLowerCase().includes(query) ||
          kasir.noHp.includes(query)
      );
      setFilteredKasir(filtered);
    }
  }, [searchQuery, kasirList]);

  const loadKasirAndUsers = () => {
    const allKasir = getAllKasir();
    const allUsers = getUsers();
    setKasirList(allKasir);
    setFilteredKasir(allKasir);
    setUsers(allUsers);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle user selection change
  const handleUserSelect = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setFormData({
        ...formData,
        userId: selectedUser.id,
        username: selectedUser.username,
        nama: selectedUser.nama
      });
    }
  };

  // Handle role selection change
  const handleRoleSelect = (role: string) => {
    setFormData({
      ...formData,
      role: role as "admin" | "kasir"
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create new kasir
      createKasir({
        nama: formData.nama,
        noHp: formData.noHp,
        username: formData.username,
        role: formData.role,
        aktif: true
      });
      
      // Reset form and reload data
      setFormData({
        nama: "",
        noHp: "",
        username: "",
        userId: "",
        role: "kasir"
      });
      
      setIsDialogOpen(false);
      loadKasirAndUsers();
      
      toast({
        title: "Sukses",
        description: "Kasir berhasil ditambahkan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan kasir",
        variant: "destructive",
      });
    }
  };

  // Toggle kasir active status
  const toggleKasirStatus = (id: string, currentStatus: boolean) => {
    try {
      updateKasir(id, { aktif: !currentStatus });
      loadKasirAndUsers();
      
      toast({
        title: "Sukses",
        description: `Kasir berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status kasir",
        variant: "destructive",
      });
    }
  };

  // Delete kasir
  const handleDeleteKasir = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kasir ini?")) {
      try {
        deleteKasir(id);
        loadKasirAndUsers();
        
        toast({
          title: "Sukses",
          description: "Kasir berhasil dihapus",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus kasir",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout 
      pageTitle="Nama Kasir"
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" /> Tambah Kasir
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[24px]">
            <DialogHeader>
              <DialogTitle><Text.H2>Tambah Kasir Baru</Text.H2></DialogTitle>
              <DialogDescription>
                <Text.Body className="text-slate-400">Isi informasi kasir baru di bawah ini.</Text.Body>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Text.Label className="block">Pilih User</Text.Label>
                <Select onValueChange={handleUserSelect} value={formData.userId}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11">
                    <SelectValue placeholder="Pilih user dari sistem" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="rounded-lg mb-1">{user.nama} ({user.username})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Text.Label className="block">Nama Kasir</Text.Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kasir"
                  required
                  className="rounded-xl bg-slate-50 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <Text.Label className="block">Nomor HP</Text.Label>
                <Input
                  id="noHp"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor HP"
                  required
                  className="rounded-xl bg-slate-50 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <Text.Label className="block">Username</Text.Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  required
                  className="rounded-xl bg-slate-50 border-none h-11"
                />
              </div>
              <div className="space-y-2">
                <Text.Label className="block">Role</Text.Label>
                <Select onValueChange={handleRoleSelect} defaultValue={formData.role}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                    <SelectItem value="kasir" className="rounded-lg">Kasir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full rounded-xl py-6 font-bold shadow-blue-600/10 hover:shadow-lg transition-all">Simpan Data Kasir</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="px-5 pb-10">
        <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none overflow-hidden">
          <CardHeader className="pb-0 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" strokeWidth={2} />
                </div>
                <Text.H2>Manajemen Kasir</Text.H2>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2} />
                <Input
                  placeholder="Cari data kasir..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 rounded-xl bg-slate-50 border-none h-10 text-sm font-medium focus-visible:ring-blue-600/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {kasirList.length === 0 ? (
              <Alert className="rounded-[20px] bg-blue-50/50 border-none">
                <AlertDescription>
                  <Text.Body>Belum ada data kasir. Klik tombol 'Tambah Kasir' untuk menambahkan kasir baru.</Text.Body>
                </AlertDescription>
              </Alert>
            ) : filteredKasir.length === 0 ? (
              <Alert className="rounded-[20px] bg-slate-50 border-none">
                <AlertDescription>
                  <Text.Body>Tidak ada data kasir yang cocok dengan pencarian Anda.</Text.Body>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-2xl border border-slate-50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-50">
                      <TableHead><Text.Label>Nama</Text.Label></TableHead>
                      <TableHead><Text.Label>Username</Text.Label></TableHead>
                      <TableHead><Text.Label>Nomor HP</Text.Label></TableHead>
                      <TableHead><Text.Label>Role</Text.Label></TableHead>
                      <TableHead><Text.Label>Status</Text.Label></TableHead>
                      <TableHead className="text-right"><Text.Label>Aksi</Text.Label></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKasir.map((kasir) => (
                      <TableRow key={kasir.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                        <TableCell><Text.Body className="font-bold text-slate-900">{kasir.nama}</Text.Body></TableCell>
                        <TableCell><Text.Body className="text-slate-500">{kasir.username}</Text.Body></TableCell>
                        <TableCell><Text.Body className="text-slate-500">{kasir.noHp}</Text.Body></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "rounded-lg px-2.5 py-0.5 border-none font-bold text-[10px] uppercase tracking-wider",
                            kasir.role === "admin" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                          )}>
                            {kasir.role === "admin" ? "Admin" : "Kasir"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "rounded-lg px-2.5 py-0.5 border-none font-bold text-[10px] uppercase tracking-wider",
                            kasir.aktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          )}>
                            {kasir.aktif ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleKasirStatus(kasir.id, kasir.aktif)}
                              className={cn(
                                "rounded-lg text-xs font-bold transition-all",
                                kasir.aktif ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"
                              )}
                            >
                              {kasir.aktif ? "Nonaktif" : "Aktifkan"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteKasir(kasir.id)}
                              className="rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all p-2"
                            >
                              Hapus
                            </Button>
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
      </div>
    </Layout>
  );
}
