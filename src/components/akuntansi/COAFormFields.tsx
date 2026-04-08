
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChartOfAccount } from "@/types/akuntansi";

interface COAFormFieldsProps {
  control: Control<any>;
  parentAccounts: ChartOfAccount[];
  watchedJenis: string;
  watchedIsGroup: boolean;
}

export function COAFormFields({ 
  control, 
  parentAccounts, 
  watchedJenis, 
  watchedIsGroup 
}: COAFormFieldsProps) {
  
  const getKategoriOptions = (jenis: string) => {
    const kategoriMap = {
      ASET: [
        "ASET LANCAR",
        "ASET TETAP",
        "ASET TIDAK BERWUJUD",
        "INVESTASI JANGKA PANJANG"
      ],
      KEWAJIBAN: [
        "KEWAJIBAN LANCAR",
        "KEWAJIBAN JANGKA PANJANG"
      ],
      MODAL: [
        "MODAL DISETOR",
        "LABA DITAHAN",
        "MODAL DONASI"
      ],
      PENDAPATAN: [
        "PENDAPATAN OPERASIONAL",
        "PENDAPATAN NON-OPERASIONAL"
      ],
      BEBAN: [
        "BEBAN OPERASIONAL",
        "BEBAN NON-OPERASIONAL",
        "BEBAN ADMINISTRASI",
        "BEBAN PENJUALAN"
      ]
    };
    
    return kategoriMap[jenis as keyof typeof kategoriMap] || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Akun *</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 1100" {...field} />
              </FormControl>
              <FormDescription>
                Kode akun harus berupa angka dan unik
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Akun *</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Kas dan Bank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="jenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Akun *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis akun" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ASET">Aset</SelectItem>
                  <SelectItem value="KEWAJIBAN">Kewajiban</SelectItem>
                  <SelectItem value="MODAL">Modal</SelectItem>
                  <SelectItem value="PENDAPATAN">Pendapatan</SelectItem>
                  <SelectItem value="BEBAN">Beban</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="kategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getKategoriOptions(watchedJenis).map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <FormField
          control={control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Akun Induk</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih akun induk (opsional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Tidak ada induk</SelectItem>
                  {parentAccounts
                    .filter(acc => acc.jenis === watchedJenis)
                    .map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.kode} - {account.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Pilih akun induk jika ini adalah sub akun
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level *</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Header)</SelectItem>
                  <SelectItem value="2">Level 2 (Sub Header)</SelectItem>
                  <SelectItem value="3">Level 3 (Detail)</SelectItem>
                  <SelectItem value="4">Level 4 (Sub Detail)</SelectItem>
                  <SelectItem value="5">Level 5 (Detail Lanjut)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isGroup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Akun Grup</FormLabel>
                <FormDescription>
                  Centang jika ini adalah akun header/grup
                </FormDescription>
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
          control={control}
          name="saldoNormal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Normal *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih saldo normal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="KREDIT">Kredit</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Saldo normal akan diatur otomatis berdasarkan jenis akun
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Full Width Description */}
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Deskripsi akun (opsional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
