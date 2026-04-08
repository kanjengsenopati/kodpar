
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Layout pageTitle="Nama Kasir">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Nama Kasir</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Kasir
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Kasir Baru</DialogTitle>
                <DialogDescription>
                  Isi informasi kasir baru di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="userId" className="text-sm font-medium">Pilih User</label>
                  <Select onValueChange={handleUserSelect} value={formData.userId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih user dari sistem" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.nama} ({user.username})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="nama" className="text-sm font-medium">Nama Kasir</label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama kasir"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="noHp" className="text-sm font-medium">Nomor HP</label>
                  <Input
                    id="noHp"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor HP"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Masukkan username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <Select onValueChange={handleRoleSelect} defaultValue={formData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="kasir">Kasir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Manajemen Kasir</CardTitle>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kasir..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {kasirList.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada data kasir. Klik tombol 'Tambah Kasir' untuk menambahkan kasir baru.
                </AlertDescription>
              </Alert>
            ) : filteredKasir.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Tidak ada kasir yang cocok dengan pencarian Anda.
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Nomor HP</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKasir.map((kasir) => (
                    <TableRow key={kasir.id}>
                      <TableCell className="font-medium">{kasir.nama}</TableCell>
                      <TableCell>{kasir.username}</TableCell>
                      <TableCell>{kasir.noHp}</TableCell>
                      <TableCell>
                        <Badge variant={kasir.role === "admin" ? "default" : "outline"}>
                          {kasir.role === "admin" ? "Admin" : "Kasir"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={kasir.aktif ? "success" : "destructive"}>
                          {kasir.aktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleKasirStatus(kasir.id, kasir.aktif)}
                        >
                          {kasir.aktif ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteKasir(kasir.id)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
