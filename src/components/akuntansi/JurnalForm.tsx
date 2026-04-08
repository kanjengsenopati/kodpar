
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Calendar } from "lucide-react";
import { ChartOfAccount, JurnalEntry } from "@/types/akuntansi";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";

const jurnalDetailSchema = z.object({
  coaId: z.string().min(1, "Akun harus dipilih"),
  debit: z.number().min(0, "Debit tidak boleh negatif"),
  kredit: z.number().min(0, "Kredit tidak boleh negatif"),
  keterangan: z.string().optional()
});

const jurnalSchema = z.object({
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi harus diisi"),
  referensi: z.string().optional(),
  details: z.array(jurnalDetailSchema).min(2, "Minimal 2 detail jurnal")
}).refine((data) => {
  const totalDebit = data.details.reduce((sum, detail) => sum + detail.debit, 0);
  const totalKredit = data.details.reduce((sum, detail) => sum + detail.kredit, 0);
  return Math.abs(totalDebit - totalKredit) < 0.01;
}, {
  message: "Total debit dan kredit harus seimbang",
  path: ["details"]
});

type JurnalFormData = z.infer<typeof jurnalSchema>;

interface JurnalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JurnalFormData) => void;
  initialData?: JurnalEntry;
  accounts: ChartOfAccount[];
}

export function JurnalForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  accounts 
}: JurnalFormProps) {
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);

  const form = useForm<JurnalFormData>({
    resolver: zodResolver(jurnalSchema),
    defaultValues: {
      tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
      deskripsi: initialData?.deskripsi || "",
      referensi: initialData?.referensi || "",
      details: initialData?.details?.map(detail => ({
        coaId: detail.coaId,
        debit: detail.debit,
        kredit: detail.kredit,
        keterangan: detail.keterangan || ""
      })) || [
        { coaId: "", debit: 0, kredit: 0, keterangan: "" },
        { coaId: "", debit: 0, kredit: 0, keterangan: "" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details"
  });

  const watchedDetails = form.watch("details");

  React.useEffect(() => {
    const debitTotal = watchedDetails.reduce((sum, detail) => sum + (detail.debit || 0), 0);
    const kreditTotal = watchedDetails.reduce((sum, detail) => sum + (detail.kredit || 0), 0);
    setTotalDebit(debitTotal);
    setTotalKredit(kreditTotal);
  }, [watchedDetails]);

  const handleSubmit = (data: JurnalFormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const addDetail = () => {
    append({ coaId: "", debit: 0, kredit: 0, keterangan: "" });
  };

  const removeDetail = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    } else {
      toast.error("Minimal 2 detail jurnal diperlukan");
    }
  };

  const getAccountName = (coaId: string) => {
    const account = accounts.find(acc => acc.id === coaId);
    return account ? `${account.kode} - ${account.nama}` : "";
  };

  const isBalanced = Math.abs(totalDebit - totalKredit) < 0.01;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Edit Jurnal" : "Buat Jurnal Baru"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referensi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referensi (opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="No. Ref" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-end">
                <div className="text-sm">
                  <div className={`font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {isBalanced ? 'Seimbang' : 'Tidak Seimbang'}
                  </div>
                  <div className="text-gray-600">
                    Selisih: {formatCurrency(Math.abs(totalDebit - totalKredit))}
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi jurnal..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Journal Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Detail Jurnal</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Detail
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name={`details.${index}.coaId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Akun</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-xs">
                                    <SelectValue placeholder="Pilih akun" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts.filter(acc => !acc.isGroup).map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                      {account.kode} - {account.nama}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`details.${index}.debit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Debit</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`details.${index}.kredit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Kredit</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`details.${index}.keterangan`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Keterangan</FormLabel>
                              <FormControl>
                                <Input placeholder="Keterangan..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeDetail(index)}
                          disabled={fields.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Total Debit</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(totalDebit)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Total Kredit</div>
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(totalKredit)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Status</div>
                      <Badge variant={isBalanced ? "default" : "destructive"}>
                        {isBalanced ? "Seimbang" : "Tidak Seimbang"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit" disabled={!isBalanced}>
                {initialData ? "Perbarui" : "Simpan"} Jurnal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
