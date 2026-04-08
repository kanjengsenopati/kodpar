
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { JenisSimpanan } from "@/types/jenis";
import { createJenis, updateJenis } from "@/services/jenisService";
import { X } from "lucide-react";

interface JenisSimpananInlineFormProps {
  onClose: () => void;
  onSuccess: (action: "create" | "update" | "delete") => void;
  initialData?: JenisSimpanan | null;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  keterangan: z.string().optional(),
  bungaPersen: z.coerce.number().min(0).max(100).default(0),
  wajib: z.boolean().default(false),
  untukPeminjam: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function JenisSimpananInlineForm({
  onClose,
  onSuccess,
  initialData,
}: JenisSimpananInlineFormProps) {
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      keterangan: "",
      bungaPersen: 0,
      wajib: false,
      untukPeminjam: false,
      isActive: true,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        nama: initialData.nama || "",
        keterangan: initialData.keterangan || "",
        bungaPersen: initialData.bungaPersen || 0,
        wajib: initialData.wajib || false,
        untukPeminjam: initialData.untukPeminjam || false,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    } else {
      form.reset({
        nama: "",
        keterangan: "",
        bungaPersen: 0,
        wajib: false,
        untukPeminjam: false,
        isActive: true,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: FormValues) => {
    const jenisData = {
      nama: values.nama,
      jenisTransaksi: "Simpanan" as const,
      keterangan: values.keterangan,
      bungaPersen: values.bungaPersen,
      wajib: values.wajib,
      untukPeminjam: values.untukPeminjam,
      isActive: values.isActive,
    };

    if (isEditing && initialData) {
      updateJenis(initialData.id, jenisData);
      onSuccess("update");
    } else {
      createJenis(jenisData);
      onSuccess("create");
    }

    onClose();
  };

  return (
    <Card className="w-full shadow-lg border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          {isEditing ? "Edit Jenis Simpanan" : "Tambah Jenis Simpanan"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Jenis Simpanan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Simpanan Pokok" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Deskripsi tentang jenis simpanan ini"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bungaPersen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persentase Bunga (%)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="wajib"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Wajib</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Simpanan ini wajib dibayarkan oleh anggota
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="untukPeminjam"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Untuk Peminjam</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Jenis simpanan ini khusus untuk anggota yang memiliki pinjaman
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Status Aktif</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Jenis simpanan ini dapat dipilih di formulir transaksi
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">
                {isEditing ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
