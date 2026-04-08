import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  Database,
  Trash2,
  Calculator
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
import { 
  createBackup, 
  downloadBackup, 
  restoreFromBackup, 
  completeReset,
  BackupData 
} from "@/services/backupResetService";
import { ResetDataSettings } from "./ResetDataSettings";

export function BackupResetSettings() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDownloadBackup = () => {
    try {
      downloadBackup();
      toast({
        title: "Backup Berhasil",
        description: "File backup telah diunduh ke komputer Anda.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat backup data.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Pilih file backup terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const fileContent = await selectedFile.text();
      const backupData: BackupData = JSON.parse(fileContent);
      
      const success = restoreFromBackup(backupData);
      
      if (success) {
        toast({
          title: "Restore Berhasil",
          description: "Data telah dipulihkan dari backup. Halaman akan dimuat ulang.",
        });
        
        // Reload page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Gagal restore data dari backup.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "File backup tidak valid atau rusak.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
    }
  };

  const handleCompleteReset = async () => {
    setIsProcessing(true);
    try {
      await completeReset();
      toast({
        title: "Reset Berhasil",
        description: "Semua data telah dihapus. Halaman akan dimuat ulang.",
      });
      
      // Reload page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal melakukan reset data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reset Data Nominal Section */}
      <ResetDataSettings />

      {/* Backup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Buat backup semua data aplikasi untuk keamanan dan pemulihan data.
          </p>
          
          <Button 
            onClick={handleDownloadBackup}
            className="w-full"
            disabled={isProcessing}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Backup
          </Button>
        </CardContent>
      </Card>

      {/* Restore Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Restore Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pulihkan data dari file backup yang telah dibuat sebelumnya.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="backup-file">Pilih File Backup</Label>
            <Input
              id="backup-file"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!selectedFile || isProcessing}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore dari Backup
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Konfirmasi Restore
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Proses restore akan mengganti semua data yang ada dengan data dari backup. 
                  Pastikan Anda telah membuat backup data saat ini sebelum melanjutkan.
                  <br /><br />
                  <strong>Tindakan ini tidak dapat dibatalkan.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRestoreBackup}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Ya, Restore Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Complete Reset Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Reset Lengkap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <strong>Peringatan:</strong> Fitur ini akan menghapus SEMUA data aplikasi 
              secara permanen termasuk data anggota, transaksi, pengaturan, dan semua data lainnya.
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Lengkap Semua Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Konfirmasi Reset Lengkap
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>PERHATIAN: Tindakan ini akan menghapus SEMUA data aplikasi secara permanen!</strong>
                  <br /><br />
                  Data yang akan dihapus meliputi:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Semua data transaksi (simpan, pinjam, angsuran)</li>
                    <li>Data anggota dan pengajuan</li>
                    <li>Data keuangan dan laporan</li>
                    <li>Cache browser dan cookies</li>
                    <li>Pengaturan aplikasi</li>
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
                  Ya, Hapus Semua Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
