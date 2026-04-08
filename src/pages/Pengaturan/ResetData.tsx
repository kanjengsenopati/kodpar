
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { resetAllMonetaryValues } from "@/services/resetDataService";
import { downloadBackup, restoreFromBackup, completeReset } from "@/services/backupResetService";
import { ResetDataSettings } from "@/components/pengaturan/ResetDataSettings";

export default function ResetData() {
  const [isResetting, setIsResetting] = useState(false);
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
      await completeReset();
      toast({
        title: "Reset Lengkap Berhasil",
        description: "Semua data, cache, dan cookies telah dihapus. Halaman akan dimuat ulang.",
      });
      setTimeout(() => window.location.reload(), 2000);
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

  return (
    <Layout pageTitle="Reset Data">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-koperasi-dark">Reset Data & Backup</h1>
            <p className="text-muted-foreground">
              Kelola data koperasi dengan fitur reset, backup, dan restore
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Backup Data */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Download className="h-5 w-5" />
                Backup Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Buat cadangan semua data untuk keamanan sebelum melakukan reset.
              </p>
              <Button 
                onClick={handleDownloadBackup}
                disabled={isBackingUp}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isBackingUp ? "Membuat Backup..." : "Download Backup"}
              </Button>
            </CardContent>
          </Card>

          {/* Restore Data */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Upload className="h-5 w-5" />
                Restore Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Kembalikan data dari file backup yang telah disimpan sebelumnya.
              </p>
              <Button 
                onClick={handleRestoreFromFile}
                disabled={isRestoring}
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isRestoring ? "Mengembalikan..." : "Pilih File Backup"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Reset Data Component */}
        <ResetDataSettings />

        {/* Complete System Reset */}
        <Card className="border-red-200 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <HardDrive className="h-5 w-5" />
              Reset Sistem Lengkap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <strong>PERINGATAN KERAS:</strong> Reset sistem lengkap akan menghapus 
                SEMUA data aplikasi, cache browser, cookies, dan pengaturan. 
                Aplikasi akan kembali ke kondisi awal seperti baru diinstall.
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={isCompleteReset}
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  {isCompleteReset ? "Mereset Sistem..." : "Reset Sistem Lengkap"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Konfirmasi Reset Sistem Lengkap
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>PERINGATAN: Tindakan ini SANGAT BERBAHAYA dan TIDAK DAPAT DIBATALKAN!</strong>
                    <br /><br />
                    Reset sistem lengkap akan:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Menghapus SEMUA data aplikasi</li>
                      <li>Membersihkan cache browser</li>
                      <li>Menghapus semua cookies</li>
                      <li>Mereset aplikasi ke kondisi awal</li>
                      <li>Menghapus semua pengaturan pengguna</li>
                    </ul>
                    <br />
                    <strong>Pastikan Anda telah membuat backup sebelum melanjutkan!</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCompleteReset}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ya, Reset Sistem Lengkap
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Information */}
        <Card className="border-gray-200 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Database className="h-5 w-5" />
              Informasi Penting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p><strong>Reset Data Transaksi:</strong> Menghapus data transaksi Simpan/Pinjam/Angsuran dan mereset nilai nominal ke null</p>
              </div>
              <div className="flex items-start gap-2">
                <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p><strong>Backup:</strong> Selalu buat backup sebelum melakukan operasi reset untuk keamanan data</p>
              </div>
              <div className="flex items-start gap-2">
                <Upload className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p><strong>Restore:</strong> Gunakan file backup JSON untuk mengembalikan data yang telah dihapus</p>
              </div>
              <div className="flex items-start gap-2">
                <HardDrive className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p><strong>Reset Lengkap:</strong> Hanya gunakan jika Anda benar-benar ingin menghapus semua data dan memulai dari awal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
