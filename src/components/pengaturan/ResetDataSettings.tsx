
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
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
import { cn } from "@/lib/utils";

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
      description: 'Simpan, Pinjam, Angsuran',
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      key: 'resetAnggota' as keyof BulkResetOptions,
      label: 'Data Anggota',
      description: 'Informasi anggota koperasi',
      icon: Users,
      color: 'text-emerald-500'
    },
    {
      key: 'resetKeuangan' as keyof BulkResetOptions,
      label: 'Data Keuangan',
      description: 'Pemasukan, pengeluaran & kas',
      icon: DollarSign,
      color: 'text-amber-500'
    },
    {
      key: 'resetAkuntansi' as keyof BulkResetOptions,
      label: 'Data Akuntansi',
      description: 'Jurnal, COA, Buku Besar',
      icon: Calculator,
      color: 'text-blue-600'
    },
    {
      key: 'resetPOS' as keyof BulkResetOptions,
      label: 'Data POS/Mart',
      description: 'Produk & histori penjualan',
      icon: Store,
      color: 'text-purple-500'
    },
    {
      key: 'resetPengaturan' as keyof BulkResetOptions,
      label: 'Pengaturan',
      description: 'Konfigurasi sistem',
      icon: Settings,
      color: 'text-slate-500'
    },
    {
      key: 'resetAudit' as keyof BulkResetOptions,
      label: 'Audit Trail',
      description: 'Log aktivitas sistem',
      icon: Shield,
      color: 'text-orange-500'
    },
    {
      key: 'resetCache' as keyof BulkResetOptions,
      label: 'Storage & Cache',
      description: 'Hapus total data IndexedDB',
      icon: HardDrive,
      color: 'text-red-500'
    }
  ];

  const impact = estimateResetImpact(resetOptions);
  const hasSelectedOptions = Object.values(resetOptions).some(Boolean);

  const cardBaseStyle = "rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden";

  return (
    <div className="space-y-6">
      {/* Quick Reset Presets */}
      <Card className={cardBaseStyle}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-slate-400" strokeWidth={2} />
            <Text.H2>Reset Cepat</Text.H2>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid gap-4 md:grid-cols-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 rounded-[18px] border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                  disabled={isResetting}
                >
                  <DollarSign size={24} className="text-blue-600" />
                  <div className="text-center">
                    <Text.Body className="font-semibold text-slate-800">Keuangan</Text.Body>
                    <Text.Caption>Transaksi & Jurnal</Text.Caption>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle><Text.H2>Reset Data Keuangan</Text.H2></AlertDialogTitle>
                  <AlertDialogDescription>
                    Menghapus semua data transaksi, keuangan, dan akuntansi. 
                    Data anggota dan pengaturan akan tetap aman.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickReset('financial')} className="bg-blue-600 rounded-full">
                    Konfirmasi Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 rounded-[18px] border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                  disabled={isResetting}
                >
                  <Database size={24} className="text-orange-600" />
                  <div className="text-center">
                    <Text.Body className="font-semibold text-slate-800">Semua Data</Text.Body>
                    <Text.Caption>Kecuali Pengaturan</Text.Caption>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle><Text.H2>Reset Semua Data</Text.H2></AlertDialogTitle>
                  <AlertDialogDescription>
                    Menghapus semua data aplikasi kecuali pengaturan sistem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleQuickReset('allButSettings')} className="bg-orange-600 rounded-full">
                    Ya, Reset Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 rounded-[18px] border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                  disabled={isResetting}
                >
                  <Trash2 size={24} className="text-red-600" />
                  <div className="text-center">
                    <Text.Body className="font-semibold text-slate-800">Factory Reset</Text.Body>
                    <Text.Caption>Hapus Total</Text.Caption>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[24px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600"><Text.H2 className="text-red-600">Factory Reset</Text.H2></AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>PERINGATAN:</strong> Menghapus SEMUA data dari database IndexedDB dan LocalStorage. 
                    Aplikasi akan kembali ke kondisi kosong total.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleQuickReset('factory')}
                    className="bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    Ya, Factory Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Custom Reset Options */}
      <Card className={cardBaseStyle}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-slate-400" strokeWidth={2} />
            <Text.H2>Reset Kustom</Text.H2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <Text.Body className="text-slate-400">
            Pilih kategori data yang akan dihapus secara permanen.
          </Text.Body>
          
          <div className="grid gap-3 md:grid-cols-2">
            {resetOptionsData.map((option) => (
              <div 
                key={option.key} 
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-[18px] border border-slate-50 transition-colors",
                  resetOptions[option.key] ? "bg-slate-50 border-slate-100" : "bg-white"
                )}
              >
                <Checkbox
                  id={option.key}
                  checked={resetOptions[option.key] || false}
                  onCheckedChange={(checked) => handleOptionChange(option.key, checked as boolean)}
                  className="mt-1 rounded-sm border-slate-300 data-[state=checked]:bg-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <option.icon size={18} className={option.color} strokeWidth={2} />
                    <label htmlFor={option.key} className="text-[14px] font-semibold text-slate-800 cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                  <Text.Caption className="block mt-1 leading-tight not-italic">
                    {option.description}
                  </Text.Caption>
                </div>
              </div>
            ))}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={!hasSelectedOptions || isResetting}
                className="w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-lg"
              >
                <RotateCcw size={18} className="mr-2" />
                {isResetting ? "Mereset..." : "Eksekusi Reset Kustom"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[24px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-orange-500" />
                  <Text.H2>Konfirmasi Reset Kustom</Text.H2>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan menghapus data pada kategori terpilih dan tidak dapat dibatalkan.
                  <div className="mt-4 p-3 bg-slate-50 rounded-[18px]">
                    <ul className="space-y-1">
                      {resetOptionsData
                        .filter(option => resetOptions[option.key])
                        .map(option => (
                          <li key={option.key} className="flex items-center gap-2 text-slate-700 font-medium">
                            <option.icon size={14} className={option.color} />
                            {option.label}
                          </li>
                        ))}
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleCustomReset} className="bg-slate-900 rounded-full">
                  Ya, Eksekusi Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className={cn(cardBaseStyle, "bg-slate-50 border-none shadow-none")}>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-slate-400" />
            <Text.H2 className="text-slate-600">Info Reset</Text.H2>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <Text.Body className="text-slate-500 text-xs leading-relaxed">
            Fitur reset akan menghapus data langsung dari database IndexedDB dan LocalStorage browser Anda. 
            Direkomendasikan melakukan <strong>Backup Data</strong> secara berkala sebelum melakukan reset total 
            untuk menghindari kehilangan informasi penting.
          </Text.Body>
        </CardContent>
      </Card>
    </div>
  );
}
