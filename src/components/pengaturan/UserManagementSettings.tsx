
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getUsers, getRoles, deleteUser, deleteRole } from "@/services/userManagementService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserManagementTab } from "./user-management/UserManagementTab";
import { RoleManagementTab } from "./user-management/RoleManagementTab";
import { DeleteConfirmationDialog } from "./user-management/DeleteConfirmationDialog";

interface UserManagementSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export function UserManagementSettings({ settings, setSettings }: UserManagementSettingsProps) {
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'role' } | null>(null);
  
  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'user') {
      const success = deleteUser(itemToDelete.id);
      if (success) {
        toast({
          title: "Pengguna berhasil dihapus",
          description: "Pengguna telah dihapus dari sistem.",
        });
      } else {
        toast({
          title: "Gagal menghapus pengguna",
          description: "Terjadi kesalahan saat menghapus pengguna.",
          variant: "destructive",
        });
      }
    } else {
      const success = deleteRole(itemToDelete.id);
      if (success) {
        toast({
          title: "Peran berhasil dihapus",
          description: "Peran telah dihapus dari sistem.",
        });
      } else {
        toast({
          title: "Gagal menghapus peran",
          description: "Peran ini sedang digunakan oleh beberapa pengguna dan tidak dapat dihapus.",
          variant: "destructive",
        });
      }
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Handle delete request from child components
  const handleDelete = (id: string, type: 'user' | 'role') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
          <TabsTrigger value="roles">Manajemen Peran</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UserManagementTab onDelete={handleDelete} />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <RoleManagementTab onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        isOpen={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        itemType={itemToDelete?.type || 'user'}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
