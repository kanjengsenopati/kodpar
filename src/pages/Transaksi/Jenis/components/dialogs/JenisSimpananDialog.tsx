
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { JenisSimpanan } from "@/types/jenis";
import { createJenis, updateJenis } from "@/services/jenisService";

interface JenisSimpananDialogProps {
  isOpen: boolean;
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

export function JenisSimpananDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: JenisSimpananDialogProps) {
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      keterangan: initialData?.keterangan || "",
      bungaPersen: initialData?.bungaPersen || 0,
      wajib: initialData?.wajib || false,
      untukPeminjam: (initialData as any)?.untukPeminjam || false,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">
            {isEditing ? "Edit Jenis Simpanan" : "Tambah Jenis Simpanan"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nama Jenis Simpanan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contoh: Simpanan Pokok" className="h-9" />
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
                    <FormLabel className="text-sm font-medium">Keterangan</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Deskripsi tentang jenis simpanan ini"
                        rows={2}
                        className="resize-none text-sm"
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
                    <FormLabel className="text-sm font-medium">Persentase Bunga (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="wajib"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-3 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">Wajib</FormLabel>
                      <p className="text-xs text-muted-foreground">
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-3 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">Untuk Peminjam</FormLabel>
                      <p className="text-xs text-muted-foreground">
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-3 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">Status Aktif</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Jenis simpanan ini dapat dipilih di formulir transaksi
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 border-t bg-muted/30 -mx-6 -mb-6 px-6 pb-6 mt-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                  Batal
                </Button>
                <Button type="submit" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90">
                  {isEditing ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
