
import { useState, useEffect } from "react";
import { User, Role } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { createUser, updateUser } from "@/services/userManagementService";

interface UserFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  roles: Role[];
  currentUser: User | null;
}

// Extend the schema to include password for new users
const userFormSchema = z.object({
  username: z.string().min(3, "Username harus minimal 3 karakter"),
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  roleId: z.string().min(1, "Role harus dipilih"),
  aktif: z.boolean(), // Changed from "active" to "aktif" to match the User type
  password: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine(data => {
  // Only validate passwords if we're creating a new user or if password is provided
  if (!data.password) return true;
  return data.password === data.confirmPassword;
}, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"]
});

export function UserForm({ isOpen, onOpenChange, onSuccess, roles, currentUser }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      nama: "",
      email: "",
      roleId: "",
      aktif: true, // Changed from "active" to "aktif" to match the User type
      password: "",
      confirmPassword: ""
    }
  });
  
  // Reset form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        nama: currentUser.nama,
        email: currentUser.email,
        roleId: currentUser.roleId,
        aktif: currentUser.aktif, // Changed from "active" to "aktif" to match the User type
        password: "",
        confirmPassword: ""
      });
    } else {
      form.reset({
        username: "",
        nama: "",
        email: "",
        roleId: "",
        aktif: true, // Changed from "active" to "aktif" to match the User type
        password: "",
        confirmPassword: ""
      });
    }
  }, [currentUser, form]);
  
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      if (currentUser) {
        // Update existing user
        await updateUser(currentUser.id, {
          username: values.username,
          nama: values.nama,
          email: values.email,
          roleId: values.roleId,
          aktif: values.aktif,
          // Only include password if provided
          ...(values.password ? { password: values.password } : {})
        });
        toast({
          title: "User berhasil diperbarui",
          description: `User ${values.username} telah diperbarui.`
        });
      } else {
        // Create new user - password is required
        if (!values.password) {
          form.setError("password", {
            type: "manual",
            message: "Password diperlukan untuk user baru"
          });
          return;
        }
        
        await createUser({
          username: values.username,
          nama: values.nama,
          email: values.email,
          roleId: values.roleId,
          aktif: values.aktif,
          password: values.password
        });
        
        toast({
          title: "User baru berhasil dibuat",
          description: `User ${values.username} telah ditambahkan.`
        });
      }
      
      // Close dialog and refresh user list
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>{currentUser ? "Edit User" : "Tambah User Baru"}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="aktif"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>User Aktif</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{currentUser ? "Password Baru (opsional)" : "Password"}</FormLabel>
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={currentUser ? "Kosongkan jika tidak diganti" : "Password"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Konfirmasi password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {currentUser ? "Simpan Perubahan" : "Tambah User"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
