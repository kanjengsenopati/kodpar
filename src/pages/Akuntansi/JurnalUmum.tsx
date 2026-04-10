import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Edit, Trash, CheckCircle, XCircle, RotateCcw, Zap, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { JurnalEntry, ChartOfAccount } from "@/types/akuntansi";
import { formatCurrency } from "@/utils/formatters";
import { JurnalForm } from "@/components/akuntansi/JurnalForm";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAccountingKeuanganSync } from "@/hooks/useKeuanganSync";
import { 
  getAllJurnalEntries, 
  createJurnalEntry, 
  updateJurnalEntry, 
  deleteJurnalEntry,
  postJurnalEntry,
  reverseJurnalEntry
} from "@/services/akuntansi/jurnalService";
import { getAllChartOfAccounts } from "@/services/akuntansi/coaService";
import * as Text from "@/components/ui/text";
import { usePagination } from "@/hooks/ui/usePagination";
import { TablePaginationFooter } from "@/components/ui/TablePaginationFooter";
import { cn } from "@/lib/utils";

export default function JurnalUmum() {
  const [journals, setJournals] = useState<JurnalEntry[]>([]);
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JurnalEntry | null>(null);
  const [deleteJournal, setDeleteJournal] = useState<JurnalEntry | null>(null);
  const { lastUpdate } = useAccountingKeuanganSync();

  useEffect(() => {
    loadJournals();
    loadAccounts();
  }, []);

  useEffect(() => {
    loadJournals();
  }, [lastUpdate]);

  const loadJournals = async () => {
    const data = await getAllJurnalEntries();
    setJournals(data);
  };

  const loadAccounts = () => {
    const data = getAllChartOfAccounts();
    setAccounts(data);
  };

  const {
    paginatedData,
    currentPage,
    rowsPerPage,
    totalRecords,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    startIndex
  } = usePagination({ data: journals });

  const handleCreate = async (data: any) => {
    try {
      const result = await createJurnalEntry({
        ...data,
        totalDebit: data.details.reduce((sum: number, detail: any) => sum + detail.debit, 0),
        totalKredit: data.details.reduce((sum: number, detail: any) => sum + detail.kredit, 0),
        status: 'DRAFT',
        createdBy: 'current_user'
      });

      if (result.success) {
        await loadJournals();
        toast.success("Jurnal berhasil dibuat");
      } else {
        toast.error(result.error || "Gagal membuat jurnal");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem saat membuat jurnal");
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedJournal) return;
    
    try {
      await updateJurnalEntry(selectedJournal.id, {
        ...data,
        totalDebit: data.details.reduce((sum: number, detail: any) => sum + detail.debit, 0),
        totalKredit: data.details.reduce((sum: number, detail: any) => sum + detail.kredit, 0)
      });
      await loadJournals();
      setSelectedJournal(null);
      toast.success("Jurnal berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui jurnal");
    }
  };

  const handleDelete = async () => {
    if (!deleteJournal) return;
    
    try {
      await deleteJurnalEntry(deleteJournal.id);
      await loadJournals();
      setDeleteJournal(null);
      toast.success("Jurnal berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus jurnal");
    }
  };

  const handlePost = async (journal: JurnalEntry) => {
    try {
      await postJurnalEntry(journal.id);
      await loadJournals();
      toast.success("Jurnal berhasil di-post");
    } catch (error) {
      toast.error("Gagal mem-post jurnal");
    }
  };

  const handleReverse = async (journal: JurnalEntry) => {
    try {
      await reverseJurnalEntry(journal.id);
      await loadJournals();
      toast.success("Jurnal berhasil di-reverse");
    } catch (error) {
      toast.error("Gagal me-reverse jurnal");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'POSTED':
        return <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Posted</div>;
      case 'DRAFT':
        return <div className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Draft</div>;
      case 'REVERSED':
        return <div className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider">Reversed</div>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const autoSyncedCount = journals.filter(j => j.createdBy === 'system_auto_sync').length;
  const keuanganSyncedCount = journals.filter(j => j.referensi?.includes('KEUANGAN-')).length;

  return (
    <Layout 
      pageTitle="Jurnal Umum"
      actions={
        <Button onClick={() => setIsFormOpen(true)} className="rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Buat Jurnal Baru
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Enhanced Auto-Sync Status Card */}
        {(autoSyncedCount > 0 || keuanganSyncedCount > 0) && (
          <Card className="border-none bg-emerald-50/30 rounded-[24px]">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <RefreshCw className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <Text.H2 className="text-sm">Sinkronisasi Real-time Aktif</Text.H2>
                    <Text.Caption className="not-italic text-emerald-600/70">Data dari Transaksi dan Keuangan otomatis tersinkronisasi</Text.Caption>
                  </div>
                </div>
                <div className="flex gap-2">
                  {autoSyncedCount > 0 && (
                    <div className="px-2 py-1 rounded-lg bg-emerald-100/50 text-emerald-700 text-[10px] font-bold uppercase flex items-center">
                      <Zap className="h-3 w-3 mr-1" /> {autoSyncedCount} Auto-Sync
                    </div>
                  )}
                  {keuanganSyncedCount > 0 && (
                    <div className="px-2 py-1 rounded-lg bg-blue-100/50 text-blue-700 text-[10px] font-bold uppercase">
                      {keuanganSyncedCount} Keuangan
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Jurnal', value: journals.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Posted', value: journals.filter(j => j.status === 'POSTED').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Draft', value: journals.filter(j => j.status === 'DRAFT').length, icon: FileText, color: 'text-slate-400', bg: 'bg-slate-50' },
            { label: 'Auto-Sync', value: autoSyncedCount + keuanganSyncedCount, icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((stat, i) => (
            <Card key={i} className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className={cn("p-3 rounded-2xl mb-3", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <Text.Label className="text-slate-400 mb-1">{stat.label}</Text.Label>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {paginatedData.length === 0 ? (
            <Card className="rounded-[24px] border-dashed border-2 py-20 flex flex-col items-center text-center">
              <FileText className="h-12 w-12 text-slate-200 mb-4" />
              <Text.H2 className="mb-2">Belum ada jurnal</Text.H2>
              <Text.Body className="text-slate-400 max-w-sm mb-6">
                Mulai dengan membuat jurnal entry pertama atau buat transaksi untuk auto-sync
              </Text.Body>
              <Button onClick={() => setIsFormOpen(true)} className="rounded-full">
                <Plus className="h-4 w-4 mr-2" /> Buat Pertama
              </Button>
            </Card>
          ) : (
            <>
              {paginatedData.map((journal) => (
                <Card key={journal.id} className="rounded-[24px] overflow-hidden group hover:shadow-md transition-all border-none shadow-sm relative">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Text.H2 className="text-base">{journal.nomorJurnal}</Text.H2>
                            {journal.createdBy === 'system_auto_sync' && (
                              <div className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase flex items-center">
                                <Zap className="h-2 w-2 mr-1" /> sync
                              </div>
                            )}
                          </div>
                          <Text.Caption className="not-italic flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(journal.tanggal), "d MMMM yyyy", { locale: id })}
                          </Text.Caption>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="mb-2">{getStatusBadge(journal.status)}</div>
                        <Text.Amount className="text-base">{formatCurrency(journal.totalDebit)}</Text.Amount>
                      </div>
                    </div>
                    
                    <Text.Body className="text-slate-600 mb-4 line-clamp-2">
                      {journal.deskripsi}
                    </Text.Body>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <Text.Caption className="not-italic text-slate-300">
                        Oleh: {journal.createdBy === 'system_auto_sync' ? 'Sistem' : journal.createdBy}
                        {journal.referensi && ` • Ref: ${journal.referensi}`}
                      </Text.Caption>
                      <div className="flex gap-2">
                        {journal.status === 'DRAFT' && (
                          <div className="flex gap-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600" onClick={() => { setSelectedJournal(journal); setIsFormOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600" onClick={() => handlePost(journal)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600" onClick={() => setDeleteJournal(journal)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {journal.status === 'POSTED' && (
                          <Button variant="ghost" className="h-8 px-3 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-orange-600 text-xs font-bold uppercase tracking-wider" onClick={() => handleReverse(journal)}>
                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reverse
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <TablePaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                startIndex={startIndex}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                label="jurnal entry"
                className="rounded-[24px] shadow-sm bg-white"
              />
            </>
          )}
        </div>

        <JurnalForm
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setSelectedJournal(null); }}
          onSubmit={selectedJournal ? handleUpdate : handleCreate}
          initialData={selectedJournal || undefined}
          accounts={accounts}
        />

        <AlertDialog open={!!deleteJournal} onOpenChange={() => setDeleteJournal(null)}>
          <AlertDialogContent className="rounded-[24px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Jurnal</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus jurnal "{deleteJournal?.nomorJurnal}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="rounded-full bg-red-600 hover:bg-red-700 text-white border-none">Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
