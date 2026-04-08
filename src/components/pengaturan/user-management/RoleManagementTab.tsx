
import { useState } from "react";
import { Role } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getRoles, getPermissions, createRole, updateRole } from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import { RoleTable } from "../RoleTable";
import { RoleForm } from "../RoleForm";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldPlus } from "lucide-react";

interface RoleManagementTabProps {
  onDelete: (roleId: string, type: 'role') => void;
}

export function RoleManagementTab({ onDelete }: RoleManagementTabProps) {
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [currentRole, setCurrentRole] = useState<Role | undefined>(undefined);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const permissions = getPermissions();

  const handleAddRole = () => {
    setCurrentRole(undefined);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setRoleDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    onDelete(roleId, 'role');
  };

  const handleSubmitRole = (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    if (currentRole) {
      // Update existing role
      const result = updateRole(currentRole.id, data);
      if (result) {
        setRoles(getRoles());
        setRoleDialogOpen(false);
        toast({
          title: "Peran berhasil diperbarui",
          description: `Peran ${data.name} telah diperbarui.`,
        });
      }
    } else {
      // Create new role
      try {
        createRole(data);
        setRoles(getRoles());
        setRoleDialogOpen(false);
        toast({
          title: "Peran berhasil ditambahkan",
          description: `Peran baru ${data.name} telah ditambahkan.`,
        });
      } catch (error) {
        toast({
          title: "Gagal menambahkan peran",
          description: "Terjadi kesalahan saat menambahkan peran baru.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Peran</h2>
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddRole}>
              <ShieldPlus className="w-4 h-4 mr-2" />
              Tambah Peran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{currentRole ? "Edit Peran" : "Tambah Peran Baru"}</DialogTitle>
              <DialogDescription>
                {currentRole 
                  ? "Perbarui detail dan izin peran yang ada" 
                  : "Buat peran baru dan atur izin akses"}
              </DialogDescription>
            </DialogHeader>
            <RoleForm 
              role={currentRole} 
              permissions={permissions} 
              onSubmit={handleSubmitRole} 
              onCancel={() => setRoleDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <RoleTable 
          roles={roles} 
          onEdit={handleEditRole} 
          onDelete={handleDeleteRole}
          permissions={permissions}
        />
      </Card>
    </div>
  );
}
