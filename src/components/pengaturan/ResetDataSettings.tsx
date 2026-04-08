
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertTriangle, 
  RotateCcw,
  Calculator,
  Database,
  Trash2,
  Users,
  DollarSign,
  Store,
  FileText,
  Settings,
  Shield,
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
import { performBulkReset, quickResetPresets, estimateResetImpact, BulkResetOptions } from "@/services/bulkResetService";

export function ResetDataSettings() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetOptions, setResetOptions] = useState<BulkResetOptions>({
    resetTransactions: false,
    resetAnggota: false,
    resetKeuangan: false,
    resetPOS: false,
    resetAkuntansi: false,
    resetPengaturan: false,
    resetAudit: false,
    resetCache: false,
  });
  const { toast } = useToast();

  const handleOptionChange = (option: keyof BulkResetOptions, checked: boolean) => {
    setResetOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleCustomReset = async () => {
    setIsResetting(true);
    try {
      const result = await performBulkReset(resetOptions);
      
      if (result.success) {
        toast({
          title: "Reset Berhasil",
          description: result.message,
        });
        
        // Refresh page after short delay to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error performing reset:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan reset data.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleQuickReset = async (preset: 'financial' | 'allButSettings' | 'factory') => {
    setIsResetting(true);
    try {
      let result;
      switch (preset) {
        case 'financial':
          result = await quickResetPresets.resetFinancialData();
          break;
        case 'allButSettings':
          result = await quickResetPresets.resetAllDataKeepSettings();
          break;
        case 'factory':
          result = await quickResetPresets.factoryReset();
          break;
      }
      
      if (result.success) {
        toast({
          title: "Reset Berhasil",
          description: result.message,
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error performing quick reset:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan reset data.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const resetOptionsData = [
    {
      key: 'resetTransactions' as keyof BulkResetOptions,
      label: 'Data Transaksi',
      description: 'Simpan, Pinjam, Angsuran, Pengajuan',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      key: 'resetAnggota' as keyof BulkResetOptions,
      label: 'Data Anggota',
      description: 'Informasi anggota koperasi',
      icon: Users,
      color: 'text-green-600'
    },
    {
      key: 'resetKeuangan' as keyof BulkResetOptions,
      label: 'Data Keuangan',
      description: 'Pemasukan, pengeluaran, arus kas',
      icon: DollarSign,
      color: 'text-yellow-600'
    },
    {
      key: 'resetPOS' as keyof BulkResetOptions,
      label: 'Data POS/Mart',
      description: 'Produk, penjualan, pembelian',
      icon: Store,
      color: 'text-purple-600'
    },
    {
      key: 'resetAkuntansi' as keyof BulkResetOptions,
      label: 'Data Akuntansi',
      description: 'Jurnal, buku besar, laporan',
      icon: Calculator,
      color: 'text-indigo-600'
    },
    {
      key: 'resetPengaturan' as keyof BulkResetOptions,
      label: 'Pengaturan',
      description: 'Konfigurasi sistem',
      icon: Settings,
      color: 'text-gray-600'
    },
    {
      key: 'resetAudit' as keyof BulkResetOptions,
      label: 'Audit Trail',
      description: 'Log aktivitas sistem',
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      key: 'resetCache' as keyof BulkResetOptions,
      label: 'Cache & Cookies',
      description: 'Data browser dan cache',
      icon: HardDrive,
      color: 'text-red-600'
    }
  ];

  const impact = estimateResetImpact(resetOptions);
  const hasSelectedOptions = Object.values(resetOptions).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Quick Reset Presets */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <RotateCcw className="h-5 w-5" />
            Reset Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50"
                  disabled={isResetting}
                >
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Reset Keuangan</div>
                    <div className="text-xs text-muted-foreground">Transaksi + Akuntansi</div>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Data Keuangan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Menghapus semua data transaksi, keuangan, dan akuntansi. 
                    Data anggota dan pengaturan akan tetap aman.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickReset('financial')}>
                    Reset Keuangan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 border-orange-200 hover:bg-orange-50"
                  disabled={isResetting}
                >
                  <Database className="h-6 w-6 text-orange-600" />
                  <div className="text-center">
                    <div className="font-medium">Reset Semua Data</div>
                    <div className="text-xs text-muted-foreground">Kecuali Pengaturan</div>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Semua Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    Menghapus semua data aplikasi kecuali pengaturan sistem. 
                    Pengaturan akan tetap tersimpan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickReset('allButSettings')}>
                    Reset Semua Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 border-red-200 hover:bg-red-50"
                  disabled={isResetting}
                >
                  <Trash2 className="h-6 w-6 text-red-600" />
                  <div className="text-center">
                    <div className="font-medium">Factory Reset</div>
                    <div className="text-xs text-muted-foreground">Reset Total</div>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Factory Reset</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>PERINGATAN:</strong> Menghapus SEMUA data, pengaturan, cache, dan cookies. 
                    Aplikasi akan kembali ke kondisi awal seperti baru diinstall.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleQuickReset('factory')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Factory Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Custom Reset Options */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Settings className="h-5 w-5" />
            Reset Kustom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pilih kategori data yang ingin direset sesuai kebutuhan Anda.
          </p>
          
          <div className="grid gap-3 md:grid-cols-2">
            {resetOptionsData.map((option) => (
              <div key={option.key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={option.key}
                  checked={resetOptions[option.key] || false}
                  onCheckedChange={(checked) => handleOptionChange(option.key, checked as boolean)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <option.icon className={`h-4 w-4 ${option.color}`} />
                    <label htmlFor={option.key} className="font-medium cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Preview */}
          {hasSelectedOptions && Object.keys(impact).length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Perkiraan Dampak Reset</span>
              </div>
              <div className="grid gap-1 text-sm">
                {Object.entries(impact).map(([key, count]) => (
                  <div key={key} className="text-yellow-700">
                    {key}: {count} item akan dihapus
                  </div>
                ))}
              </div>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={!hasSelectedOptions || isResetting}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isResetting ? "Mereset..." : "Eksekusi Reset Kustom"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Konfirmasi Reset Kustom
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan menghapus data dari kategori yang dipilih. 
                  Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah membuat backup.
                  <br /><br />
                  <strong>Kategori yang akan direset:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {resetOptionsData
                      .filter(option => resetOptions[option.key])
                      .map(option => (
                        <li key={option.key}>{option.label}</li>
                      ))}
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleCustomReset}>
                  Ya, Eksekusi Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Database className="h-5 w-5" />
            Informasi Reset Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Reset Cepat:</strong> Pilihan preset untuk skenario umum</p>
            <p><strong>Reset Kustom:</strong> Kontrol penuh atas kategori data yang direset</p>
            <p><strong>Backup:</strong> Selalu buat backup sebelum melakukan reset</p>
            <p><strong>Restore:</strong> Gunakan fitur restore untuk mengembalikan data</p>
          </div>
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
            <strong>Tips:</strong> Untuk testing atau pembersihan data demo, 
            gunakan "Reset Keuangan". Untuk memulai dari awal, gunakan "Factory Reset".
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
