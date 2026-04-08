
import { useState } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getUsers, getRoles, createUser, updateUser } from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import { UserTable } from "../UserTable";
import { UserForm } from "./UserForm";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface UserManagementTabProps {
  onDelete: (userId: string, type: 'user') => void;
}

export function UserManagementTab({ onDelete }: UserManagementTabProps) {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const roles = getRoles();

  const handleAddUser = () => {
    setCurrentUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    onDelete(userId, 'user');
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    const result = updateUser(userId, { aktif: isActive }); // Changed from "active" to "aktif"
    if (result) {
      setUsers(getUsers());
      toast({
        title: `Pengguna berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        description: `Status pengguna telah diperbarui.`,
      });
    } else {
      toast({
        title: "Gagal mengubah status pengguna",
        description: "Terjadi kesalahan saat mengubah status pengguna.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitUser = (data: any) => {
    if (currentUser) {
      // Update existing user
      const result = updateUser(currentUser.id, data);
      if (result) {
        setUsers(getUsers());
        setUserDialogOpen(false);
        toast({
          title: "Pengguna berhasil diperbarui",
          description: `Data pengguna ${data.nama} telah diperbarui.`,
        });
      }
    } else {
      // Create new user
      try {
        createUser(data);
        setUsers(getUsers());
        setUserDialogOpen(false);
        toast({
          title: "Pengguna berhasil ditambahkan",
          description: `Pengguna baru ${data.nama} telah ditambahkan.`,
        });
      } catch (error) {
        toast({
          title: "Gagal menambahkan pengguna",
          description: "Terjadi kesalahan saat menambahkan pengguna baru.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Pengguna</h2>
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <UserForm
            isOpen={userDialogOpen}
            onOpenChange={setUserDialogOpen}
            currentUser={currentUser}
            roles={roles}
            onSuccess={() => {
              setUsers(getUsers());
            }}
          />
        </Dialog>
      </div>
          
      <Card>
        <UserTable 
          users={users} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleUserStatus}
        />
      </Card>
    </div>
  );
}
