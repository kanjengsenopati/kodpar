
import { Role, Permission } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { ActionGrid } from "@/components/ui/action-grid";
import { Badge } from "@/components/ui/badge";

interface RoleTableRowProps {
  role: Role;
  permissions: Permission[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
}

export function RoleTableRow({ 
  role, 
  permissions, 
  onEdit, 
  onDelete, 
  isEditing, 
  startEdit, 
  cancelEdit 
}: RoleTableRowProps) {
  const rolePermissions = permissions.filter(p => 
    role.permissions?.includes(p.id)
  );

  return (
    <TableRow>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>{role.description}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {rolePermissions.slice(0, 3).map((permission) => (
            <Badge key={permission.id} variant="outline" className="text-xs">
              {permission.name}
            </Badge>
          ))}
          {rolePermissions.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{rolePermissions.length - 3} lainnya
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          <ActionGrid
            onEdit={() => onEdit(role)}
            onDelete={() => onDelete(role.id)}
            layout="grid"
            compact={true}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
