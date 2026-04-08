
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { UserFormData } from "@/types/user";
import { getRoles } from "@/services/userManagementService";
import { Form } from "@/components/ui/form";
import { PhotoUpload } from "./PhotoUpload";
import { UserFormFields } from "./UserFormFields";
import { UserFormActions } from "./UserFormActions";

// Form validation schema
const userFormSchema = z.object({
  username: z.string().min(3, "Username harus minimal 3 karakter"),
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  jabatan: z.string().optional(),
  noHP: z.string().optional(),
  alamat: z.string().optional(),
  roleId: z.string().min(1, "Hak akses harus dipilih"),
  aktif: z.boolean().default(true),
  foto: z.string().optional(),
  password: z
    .string()
    .min(6, "Password harus minimal 6 karakter")
    .optional()
    .or(z.string().length(0))
});

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [roles] = useState(getRoles());
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(user?.foto);
  const isEditMode = !!user;

  // Initialize form
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: user?.username || "",
      nama: user?.nama || "",
      email: user?.email || "",
      jabatan: user?.jabatan || "",
      noHP: user?.noHP || "",
      alamat: user?.alamat || "",
      roleId: user?.roleId || "",
      aktif: user?.aktif !== undefined ? user.aktif : true,
      foto: user?.foto || "",
      password: "", // Empty for edit mode
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        nama: user.nama || "",
        email: user.email || "",
        jabatan: user.jabatan || "",
        noHP: user.noHP || "",
        alamat: user.alamat || "",
        roleId: user.roleId || "",
        aktif: user.aktif !== undefined ? user.aktif : true,
        foto: user.foto || "",
        password: "", // Empty for edit mode
      });
      setPhotoPreview(user.foto);
    } else {
      form.reset({
        username: "",
        nama: "",
        email: "",
        jabatan: "",
        noHP: "",
        alamat: "",
        roleId: "",
        aktif: true,
        foto: "",
        password: "",
      });
      setPhotoPreview(undefined);
    }
  }, [user, form]);

  // Handle photo upload
  const handlePhotoChange = (photoData: string) => {
    form.setValue("foto", photoData);
    setPhotoPreview(photoData);
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    // If editing and password is empty, remove it
    if (user && (!data.password || data.password.trim() === "")) {
      const { password, ...rest } = data;
      onSubmit({ ...rest, id: user.id });
    } else {
      // For new user or if password is provided
      if (user) {
        onSubmit({ ...data, id: user.id });
      } else {
        onSubmit(data);
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PhotoUpload 
              initialImage={photoPreview} 
              onImageChange={handlePhotoChange}
            />
          </div>

          <div className="space-y-4">
            <UserFormFields 
              control={form.control} 
              roles={roles}
              isEditMode={isEditMode}
            />
          </div>
        </div>

        <UserFormActions 
          isEditMode={isEditMode} 
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}
