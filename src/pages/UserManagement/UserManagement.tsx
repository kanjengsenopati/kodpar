
import { useState } from "react";
import { User } from "@/types/user";
import Layout from "@/components/layout/Layout";
import { UserTable } from "@/components/user-management/UserTable";
import { UserGrid } from "@/components/user-management/UserGrid";
import { UserForm } from "@/components/user-management/UserForm";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/userManagementService";
import { UserPlus, Grid, Table as TableIcon } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { toast } = useToast();

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleAddUser = () => {
    setCurrentUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleDeletePrompt = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      const success = deleteUser(userToDelete);
      if (success) {
        toast({
          title: "Pengguna berhasil dihapus",
          description: "Pengguna telah dihapus dari sistem.",
        });
        refreshUsers();
      } else {
        toast({
          title: "Gagal menghapus pengguna",
          description: "Terjadi kesalahan saat menghapus pengguna.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSubmitUser = (userData: any) => {
    try {
      if (userData.id) {
        // Update existing user
        const result = updateUser(userData.id, userData);
        if (result) {
          toast({
            title: "Pengguna berhasil diperbarui",
            description: `Data pengguna ${userData.nama} telah diperbarui.`,
          });
        }
      } else {
        // Create new user
        createUser(userData);
        toast({
          title: "Pengguna berhasil ditambahkan",
          description: `Pengguna baru ${userData.nama} telah ditambahkan.`,
        });
      }
      setIsFormOpen(false);
      refreshUsers();
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data pengguna.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout pageTitle="Manajemen Pengguna">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <div className="flex space-x-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'grid')}>
              <TabsList>
                <TabsTrigger value="table" className="flex items-center gap-1">
                  <TableIcon size={16} />
                  <span>Tabel</span>
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center gap-1">
                  <Grid size={16} />
                  <span>Grid</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleAddUser} className="flex items-center gap-1">
              <UserPlus size={16} />
              <span>Tambah Pengguna</span>
            </Button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeletePrompt} />
        ) : (
          <UserGrid users={users} onEdit={handleEditUser} onDelete={handleDeletePrompt} />
        )}

        {/* User Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
            </DialogHeader>
            <UserForm user={currentUser} onSubmit={handleSubmitUser} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
