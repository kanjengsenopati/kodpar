import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Role } from "@/types";
import { getRoles } from "@/services/userManagementService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  user?: User;
  onSubmit: (data: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  // Get roles for the select dropdown
  const roles = getRoles();
  
  // Define form with default values
  const form = useForm<Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">>({
    defaultValues: {
      username: user?.username || "",
      nama: user?.nama || "",
      email: user?.email || "",
      roleId: user?.roleId || "",
      aktif: user?.aktif ?? true,
    }
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        nama: user.nama,
        email: user.email,
        roleId: user.roleId,
        aktif: user.aktif
      });
    } else {
      form.reset({
        username: "",
        nama: "",
        email: "",
        roleId: "",
        aktif: true
      });
    }
  }, [user, form]);

  // Form submission handler
  const handleSubmit = (data: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username tidak boleh kosong" }}
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
          rules={{ required: "Nama tidak boleh kosong" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          rules={{ 
            required: "Email tidak boleh kosong",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email tidak valid"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleId"
          rules={{ required: "Peran harus dipilih" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peran</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {user ? "Simpan Perubahan" : "Tambah Pengguna"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
