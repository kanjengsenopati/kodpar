
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Role, Permission } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { 
  getRoles, 
  getPermissions, 
  deleteRole 
} from "@/services/userManagementService";
import { RoleManagementTab } from "@/components/pengaturan/user-management/RoleManagementTab";
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

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [permissions] = useState<Permission[]>(getPermissions());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'role' } | null>(null);

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    const { id, type } = itemToDelete;
    
    if (type === 'role') {
      const result = deleteRole(id);
      
      if (result) {
        setRoles(getRoles());
        toast({
          title: "Peran dihapus",
          description: "Peran berhasil dihapus dari sistem.",
        });
      } else {
        toast({
          title: "Tidak dapat menghapus peran",
          description: "Peran ini sedang digunakan oleh pengguna.",
          variant: "destructive",
        });
      }
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = (id: string, type: 'role') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  return (
    <Layout pageTitle="Manajemen Hak Akses">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Manajemen Hak Akses</h1>
        
        <div className="space-y-6">
          <RoleManagementTab onDelete={handleDelete} />
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
