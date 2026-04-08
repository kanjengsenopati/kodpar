
import { useState } from "react";
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
import { JenisPengajuan } from "@/types/jenis";
import { createJenis, updateJenis } from "@/services/jenisService";

interface JenisPengajuanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (action: "create" | "update" | "delete") => void;
  initialData?: JenisPengajuan | null;
}

const formSchema = z.object({
  nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  keterangan: z.string().optional(),
  persyaratan: z.array(z.string()).optional(),
  persyaratanInput: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function JenisPengajuanDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: JenisPengajuanDialogProps) {
  const isEditing = !!initialData;
  const [persyaratanList, setPersyaratanList] = useState<string[]>(
    initialData?.persyaratan || []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: initialData?.nama || "",
      keterangan: initialData?.keterangan || "",
      persyaratan: initialData?.persyaratan || [],
      persyaratanInput: "",
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  const handleAddPersyaratan = () => {
    const persyaratanInput = form.getValues("persyaratanInput");
    if (persyaratanInput.trim()) {
      setPersyaratanList([...persyaratanList, persyaratanInput.trim()]);
      form.setValue("persyaratanInput", "");
    }
  };

  const handleRemovePersyaratan = (index: number) => {
    setPersyaratanList(persyaratanList.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: FormValues) => {
    const jenisData = {
      nama: values.nama,
      jenisTransaksi: "Pengajuan" as const,
      keterangan: values.keterangan,
      persyaratan: persyaratanList,
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Jenis Pengajuan" : "Tambah Jenis Pengajuan"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jenis Pengajuan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contoh: Pengajuan Simpanan" />
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
                        placeholder="Deskripsi tentang jenis pengajuan ini"
                        rows={2}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormLabel>Persyaratan</FormLabel>

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="persyaratanInput"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Contoh: KTP, Formulir, dsb."
                      className="flex-1"
                    />
                  )}
                />
                <Button type="button" onClick={handleAddPersyaratan}>
                  Tambah
                </Button>
              </div>

              <div className="max-h-[150px] overflow-y-auto pr-2">
                {persyaratanList.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {persyaratanList.map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePersyaratan(index)}
                        >
                          Hapus
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Belum ada persyaratan yang ditambahkan
                  </p>
                )}
              </div>
            </div>

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
                    <FormLabel>Status Aktif</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Jenis pengajuan ini dapat dipilih di formulir pengajuan
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
