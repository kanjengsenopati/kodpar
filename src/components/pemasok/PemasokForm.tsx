
import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Pemasok } from "@/types";
import { createPemasok, updatePemasok } from "@/services/pemasokService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PemasokFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentPemasok: Pemasok | null;
}

// Form schema
const pemasokSchema = z.object({
  nama: z.string().min(3, "Nama pemasok harus diisi minimal 3 karakter"),
  alamat: z.string().min(5, "Alamat harus diisi minimal 5 karakter"),
  telepon: z.string().min(5, "Nomor telepon harus diisi"),
  email: z.string().email("Format email tidak valid"),
  kontak: z.string().min(3, "Nama kontak harus diisi")
});

export function PemasokForm({ onOpenChange, onSuccess, currentPemasok }: PemasokFormProps) {
  const form = useForm<z.infer<typeof pemasokSchema>>({
    resolver: zodResolver(pemasokSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      kontak: ""
    }
  });

  // Reset form when currentPemasok changes
  useEffect(() => {
    if (currentPemasok) {
      form.reset({
        nama: currentPemasok.nama,
        alamat: currentPemasok.alamat || "",
        telepon: currentPemasok.telepon || "",
        email: currentPemasok.email || "",
        kontak: currentPemasok.kontak || ""
      });
    } else {
      form.reset({
        nama: "",
        alamat: "",
        telepon: "",
        email: "",
        kontak: ""
      });
    }
  }, [currentPemasok, form]);

  const onSubmit = (values: z.infer<typeof pemasokSchema>) => {
    if (currentPemasok) {
      // Update existing supplier
      const updatedPemasok = updatePemasok(currentPemasok.id, values);
      if (updatedPemasok) {
        toast.success("Data pemasok berhasil diperbarui");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error("Gagal memperbarui data pemasok");
      }
    } else {
      // Create new supplier with required fields
      const newPemasokData = {
        nama: values.nama,
        alamat: values.alamat,
        telepon: values.telepon,
        email: values.email,
        kontak: values.kontak
      };
      
      createPemasok(newPemasokData);
      toast.success("Pemasok baru berhasil ditambahkan");
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>
          {currentPemasok ? "Edit Pemasok" : "Tambah Pemasok Baru"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pemasok</FormLabel>
                <FormControl>
                  <Input placeholder="Nama perusahaan/toko pemasok" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat lengkap pemasok" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor telepon" {...field} />
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
                    <Input placeholder="Email pemasok" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="kontak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kontak Person</FormLabel>
                <FormControl>
                  <Input placeholder="Nama orang yang dapat dihubungi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {currentPemasok ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
