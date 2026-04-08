
import { useState, useEffect } from 'react';
import { Permission } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface RolePermissionsEditorProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

export function RolePermissionsEditor({ 
  permissions, 
  selectedPermissions,
  onChange
}: RolePermissionsEditorProps) {
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  
  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  permissions.forEach(permission => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    permissionsByModule[permission.module].push(permission);
  });

  // Convert module name to display name
  const getModuleDisplayName = (module: string) => {
    const moduleMap: Record<string, string> = {
      'anggota': 'Data Anggota',
      'transaksi': 'Transaksi',
      'laporan': 'Laporan',
      'pos': 'Point of Sales',
      'users': 'Manajemen Pengguna',
      'roles': 'Manajemen Peran',
      'pengaturan': 'Pengaturan',
    };
    return moduleMap[module] || module.charAt(0).toUpperCase() + module.slice(1);
  };

  // Get badge variant for action type
  const getActionBadgeVariant = (action: string) => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      'read': 'info',
      'create': 'success',
      'update': 'warning',
      'delete': 'destructive',
      'all': 'secondary',
    };
    return variantMap[action] || 'default';
  };

  // Initialize permissions from props
  useEffect(() => {
    setEditPermissions(selectedPermissions);
  }, [selectedPermissions]);

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    let updatedPermissions: string[];
    
    if (checked) {
      updatedPermissions = [...editPermissions, permissionId];
    } else {
      updatedPermissions = editPermissions.filter(id => id !== permissionId);
    }
    
    setEditPermissions(updatedPermissions);
    onChange(updatedPermissions);
  };

  return (
    <ScrollArea className="h-80 pr-4 border rounded-md p-2">
      {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
        <div key={module} className="mb-4">
          <h4 className="font-medium text-sm mb-1">{getModuleDisplayName(module)}</h4>
          <Separator className="mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {modulePermissions.map((permission) => (
              <div
                key={permission.id}
                className="flex flex-row items-start space-x-2 space-y-0"
              >
                <Checkbox
                  checked={editPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => 
                    handlePermissionToggle(permission.id, checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <div className="flex items-center gap-1 flex-wrap">
                    <label className="text-sm cursor-pointer">
                      {permission.name}
                    </label>
                    <Badge 
                      variant={getActionBadgeVariant(permission.action)} 
                      className="text-xs"
                    >
                      {permission.action}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
