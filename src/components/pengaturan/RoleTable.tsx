
import { useState } from 'react';
import { Role, Permission } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleTableRow } from './RoleTableRow';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  permissions?: Permission[]; // Make permissions optional
}

export function RoleTable({ roles, onEdit, onDelete, permissions = [] }: RoleTableProps) {
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  
  const startEdit = (role: Role) => {
    setEditingRoleId(role.id);
  };

  const cancelEdit = () => {
    setEditingRoleId(null);
  };

  const handleEdit = (updatedRole: Role) => {
    onEdit(updatedRole);
    setEditingRoleId(null);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Peran</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Izin Akses</TableHead>
            <TableHead className="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <RoleTableRow 
              key={role.id}
              role={role}
              permissions={permissions}
              onEdit={handleEdit}
              onDelete={onDelete}
              isEditing={editingRoleId === role.id}
              startEdit={() => startEdit(role)}
              cancelEdit={cancelEdit}
            />
          ))}
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                Tidak ada data peran
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
