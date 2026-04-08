
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Role, Permission } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface RoleFormProps {
  role?: Role;
  permissions: Permission[];
  onSubmit: (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function RoleForm({ role, permissions, onSubmit, onCancel }: RoleFormProps) {
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

  // Define form with default values
  const form = useForm<Omit<Role, "id" | "createdAt" | "updatedAt">>({
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissions: role?.permissions || [],
    }
  });

  // Update form values when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      });
    }
  }, [role, form]);

  // Form submission handler
  const handleSubmit = (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Nama peran tidak boleh kosong" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Peran</FormLabel>
              <FormControl>
                <Input placeholder="Nama Peran" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <h3 className="text-base font-medium">Izin Akses</h3>
          <ScrollArea className="h-[320px] w-full border rounded-md p-3">
            <div className="space-y-4">
              {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm text-gray-900">{getModuleDisplayName(module)}</h4>
                    <Separator className="flex-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {modulePermissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={permission.id}
                              className="flex flex-row items-start space-x-3 space-y-0 py-1"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    const currentPermissions = [...(field.value || [])];
                                    if (checked) {
                                      if (!currentPermissions.includes(permission.id)) {
                                        field.onChange([...currentPermissions, permission.id]);
                                      }
                                    } else {
                                      field.onChange(
                                        currentPermissions.filter((value) => value !== permission.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <div className="flex items-center justify-between">
                                  <FormLabel className="cursor-pointer text-sm font-normal">
                                    {permission.name}
                                  </FormLabel>
                                  <Badge variant={getActionBadgeVariant(permission.action)} className="text-xs">
                                    {permission.action}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {role ? "Simpan Perubahan" : "Tambah Peran"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
