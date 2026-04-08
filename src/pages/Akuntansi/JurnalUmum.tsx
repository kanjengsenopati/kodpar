import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Edit, Trash, CheckCircle, XCircle, RotateCcw, Zap, Info, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { JurnalEntry, ChartOfAccount } from "@/types/akuntansi";
import { formatCurrency } from "@/utils/formatters";
import { JurnalForm } from "@/components/akuntansi/JurnalForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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

  // Reload journals when keuangan data updates
  useEffect(() => {
    console.log('Keuangan data updated, refreshing journals...');
    loadJournals();
  }, [lastUpdate]);

  const loadJournals = () => {
    const data = getAllJurnalEntries();
    setJournals(data);
    console.log(`Loaded ${data.length} journal entries`);
  };

  const loadAccounts = () => {
    const data = getAllChartOfAccounts();
    setAccounts(data);
  };

  const handleCreate = (data: any) => {
    try {
      createJurnalEntry({
        ...data,
        totalDebit: data.details.reduce((sum: number, detail: any) => sum + detail.debit, 0),
        totalKredit: data.details.reduce((sum: number, detail: any) => sum + detail.kredit, 0),
        status: 'DRAFT',
        createdBy: 'current_user'
      });
      loadJournals();
      toast.success("Jurnal berhasil dibuat");
    } catch (error) {
      toast.error("Gagal membuat jurnal");
    }
  };

  const handleUpdate = (data: any) => {
    if (!selectedJournal) return;
    
    try {
      updateJurnalEntry(selectedJournal.id, {
        ...data,
        totalDebit: data.details.reduce((sum: number, detail: any) => sum + detail.debit, 0),
        totalKredit: data.details.reduce((sum: number, detail: any) => sum + detail.kredit, 0)
      });
      loadJournals();
      setSelectedJournal(null);
      toast.success("Jurnal berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui jurnal");
    }
  };

  const handleDelete = () => {
    if (!deleteJournal) return;
    
    try {
      deleteJurnalEntry(deleteJournal.id);
      loadJournals();
      setDeleteJournal(null);
      toast.success("Jurnal berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus jurnal");
    }
  };

  const handlePost = (journal: JurnalEntry) => {
    try {
      postJurnalEntry(journal.id);
      loadJournals();
      toast.success("Jurnal berhasil di-post");
    } catch (error) {
      toast.error("Gagal mem-post jurnal");
    }
  };

  const handleReverse = (journal: JurnalEntry) => {
    try {
      reverseJurnalEntry(journal.id);
      loadJournals();
      toast.success("Jurnal berhasil di-reverse");
    } catch (error) {
      toast.error("Gagal me-reverse jurnal");
    }
  };

  const openEditForm = (journal: JurnalEntry) => {
    setSelectedJournal(journal);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setSelectedJournal(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedJournal(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'POSTED':
        return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case 'DRAFT':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'REVERSED':
        return <Badge className="bg-red-100 text-red-800">Reversed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Count auto-synced transactions
  const autoSyncedCount = journals.filter(j => j.createdBy === 'system_auto_sync').length;
  const keuanganSyncedCount = journals.filter(j => j.referensi?.includes('KEUANGAN-')).length;

  return (
    <Layout pageTitle="Jurnal Umum">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jurnal Umum</h1>
            <p className="text-muted-foreground">Kelola jurnal entry dan transaksi akuntansi</p>
          </div>
          <Button onClick={openCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Jurnal Baru
          </Button>
        </div>

        {/* Enhanced Auto-Sync Status Card */}
        {(autoSyncedCount > 0 || keuanganSyncedCount > 0) && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-green-700">
                  <RefreshCw className="h-4 w-4" />
                  <span className="font-medium">Sinkronisasi Real-time Aktif</span>
                </div>
                <div className="flex gap-2">
                  {autoSyncedCount > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Zap className="h-3 w-3 mr-1" />
                      {autoSyncedCount} Transaksi Auto-Sync
                    </Badge>
                  )}
                  {keuanganSyncedCount > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {keuanganSyncedCount} Keuangan Sync
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Data dari Transaksi Koperasi dan Keuangan otomatis tersinkronisasi ke Jurnal Umum secara real-time
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Total Jurnal</h2>
              <p className="text-2xl font-bold mt-1">{journals.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Posted</h2>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {journals.filter(j => j.status === 'POSTED').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Draft</h2>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {journals.filter(j => j.status === 'DRAFT').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Auto-Sync</h2>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {autoSyncedCount + keuanganSyncedCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {journals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum ada jurnal</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Mulai dengan membuat jurnal entry pertama atau buat transaksi untuk auto-sync
                </p>
                <Button onClick={openCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Jurnal Baru
                </Button>
              </CardContent>
            </Card>
          ) : (
            journals.map((journal) => (
              <Card key={journal.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {journal.nomorJurnal}
                        {journal.createdBy === 'system_auto_sync' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Sync
                          </Badge>
                        )}
                        {journal.referensi?.includes('KEUANGAN-') && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Keuangan
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(journal.tanggal), "d MMMM yyyy", { locale: id })}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      {getStatusBadge(journal.status)}
                      <p className="text-sm font-medium">
                        {formatCurrency(journal.totalDebit)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{journal.deskripsi}</p>
                  {journal.referensi && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Ref: {journal.referensi}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Dibuat oleh: {journal.createdBy === 'system_auto_sync' ? 'Sistem Auto-Sync' : journal.createdBy}
                    </p>
                    <div className="flex gap-2">
                      {journal.status === 'DRAFT' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditForm(journal)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handlePost(journal)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Post
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => setDeleteJournal(journal)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {journal.status === 'POSTED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReverse(journal)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reverse
                        </Button>
                      )}
                      {journal.status === 'REVERSED' && (
                        <Button variant="outline" size="sm" disabled>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reversed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <JurnalForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={selectedJournal ? handleUpdate : handleCreate}
          initialData={selectedJournal || undefined}
          accounts={accounts}
        />

        <AlertDialog open={!!deleteJournal} onOpenChange={() => setDeleteJournal(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Jurnal</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus jurnal "{deleteJournal?.nomorJurnal}"? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
