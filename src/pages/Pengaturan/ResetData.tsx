
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { 
  AlertTriangle, 
  RotateCcw,
  Database,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  HardDrive
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { downloadBackup, restoreFromBackup, completeReset } from "@/services/backupResetService";
import { ResetDataSettings } from "@/components/pengaturan/ResetDataSettings";
import { cn } from "@/lib/utils";

export default function ResetData() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isCompleteReset, setIsCompleteReset] = useState(false);
  const { toast } = useToast();

  const handleDownloadBackup = () => {
    setIsBackingUp(true);
    try {
      downloadBackup();
      toast({
        title: "Backup Berhasil",
        description: "File backup telah diunduh ke komputer Anda.",
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast({
        title: "Error",
        description: "Gagal membuat backup data.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsRestoring(true);
      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        const success = restoreFromBackup(backupData);
        if (success) {
          toast({
            title: "Restore Berhasil",
            description: "Data berhasil dikembalikan dari backup.",
          });
          setTimeout(() => window.location.reload(), 2000);
        } else {
          throw new Error("Failed to restore data");
        }
      } catch (error) {
        console.error("Error restoring backup:", error);
        toast({
          title: "Error",
          description: "Gagal mengembalikan data dari backup. Pastikan file backup valid.",
          variant: "destructive",
        });
      } finally {
        setIsRestoring(false);
      }
    };
    input.click();
  };

  const handleCompleteReset = async () => {
    setIsCompleteReset(true);
    try {
      // Direct call to industrial reset in business service
      const result = await quickResetPresets.factoryReset();
      if (result.success) {
        toast({
          title: "Reset Lengkap Berhasil",
          description: "Semua data, database, dan cache telah dihapus secara permanen.",
        });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error during complete reset:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan reset lengkap.",
        variant: "destructive",
      });
    } finally {
      setIsCompleteReset(false);
    }
  };

  const cardBaseStyle = "rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden";

  return (
    <Layout pageTitle="Reset Data">
      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto pb-24">
        {/* Header Section */}
        <div className="mb-2">
          <Text.H1>Reset & Backup</Text.H1>
          <Text.Body className="text-slate-500 mt-1">
            Kelola integritas data aplikasi Anda secara mandiri.
          </Text.Body>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Backup Data */}
          <Card className={cardBaseStyle}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-blue-600" />
                <Text.H2>Backup</Text.H2>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <Text.Caption className="block mb-4 not-italic">
                Amankan data ke file JSON lokal.
              </Text.Caption>
              <Button 
                onClick={handleDownloadBackup}
                disabled={isBackingUp}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-10 shadow-md"
              >
                <Download size={16} className="mr-2" />
                {isBackingUp ? "Backup..." : "Download"}
              </Button>
            </CardContent>
          </Card>

          {/* Restore Data */}
          <Card className={cardBaseStyle}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-emerald-600" />
                <Text.H2>Restore</Text.H2>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <Text.Caption className="block mb-4 not-italic">
                Kembalikan data dari backup.
              </Text.Caption>
              <Button 
                onClick={handleRestoreFromFile}
                disabled={isRestoring}
                variant="outline"
                className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-full h-10"
              >
                <Upload size={16} className="mr-2" />
                {isRestoring ? "Restore..." : "Pilih File"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Reset Data Settings Module */}
        <div className="space-y-2">
          <Text.Label className="px-1">Konfigurasi Reset Selektif</Text.Label>
          <ResetDataSettings />
        </div>

        {/* Complete System Reset */}
        <Card className={cn(cardBaseStyle, "bg-red-50 border-red-100")}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HardDrive size={18} className="text-red-600" />
              <Text.H2 className="text-red-700">Zona Bahaya</Text.H2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Text.Body className="text-red-600 text-xs leading-relaxed font-semibold">
              Reset sistem lengkap akan menghapus database IndexedDB secara total. Aplikasi akan kembali ke kondisi awal (kosong).
            </Text.Body>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full rounded-full h-12 bg-red-600 hover:bg-red-700 shadow-lg"
                  disabled={isCompleteReset}
                >
                  <Trash2 size={18} className="mr-2" />
                  {isCompleteReset ? "Mereset..." : "Reset Sistem Lengkap"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle size={20} />
                    <Text.H2 className="text-red-600">Konfirmasi Hapus Total</Text.H2>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus <strong>IndexedDB (Dexie)</strong> dan LocalStorage. 
                    Anda akan kehilangan SEMUA data anggota dan transaksi selamanya.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCompleteReset}
                    className="bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    Ya, Hapus Semua Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Informational Guidance */}
        <div className="flex items-center gap-2 px-2">
          <RefreshCw size={14} className="text-slate-400 animate-spin-slow" />
          <Text.Caption className="text-[11px] font-semibold text-slate-400 not-italic uppercase tracking-wider">
            Sistem Data Terenkripsi Lokal
          </Text.Caption>
        </div>
      </div>
    </Layout>
  );
}
