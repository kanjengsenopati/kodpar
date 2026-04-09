
import { useState } from "react";
import { Pengaturan } from "@/types";
import { updatePengaturan } from "@/services/pengaturanService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

interface PenarikanSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function PenarikanSettings({ settings, setSettings }: PenarikanSettingsProps) {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings.penarikan || {
    maxWithdrawalType: "percentage",
    maxWithdrawalValue: 100,
    minPreservedBalanceType: "fixed",
    minPreservedBalanceValue: 50000
  });

  const handleSave = () => {
    const updated = updatePengaturan({ penarikan: localSettings });
    setSettings(updated);
    toast({
      title: "Pengaturan disimpan",
      description: "Aturan penarikan simpanan telah berhasil diperbarui.",
    });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Maximum Withdrawal Section */}
      <div className="space-y-4 p-4 border rounded-xl bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <span className="text-lg">📉</span>
          </div>
          <Label className="text-base font-bold text-slate-800">Batas Maksimal Penarikan</Label>
        </div>
        <p className="text-sm text-slate-500">
          Atur nominal maksimal yang diperbolehkan dalam satu kali penarikan.
        </p>
        
        <RadioGroup 
          value={localSettings.maxWithdrawalType} 
          onValueChange={(val: any) => setLocalSettings(prev => ({ ...prev, maxWithdrawalType: val }))}
          className="flex gap-6 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="max-fixed" />
            <Label htmlFor="max-fixed" className="cursor-pointer">Nominal Tetap (Rp)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="max-percent" />
            <Label htmlFor="max-percent" className="cursor-pointer">Persentase (%)</Label>
          </div>
        </RadioGroup>

        <div className="pt-2">
          <div className="relative max-w-[240px]">
            {localSettings.maxWithdrawalType === "fixed" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
            )}
            <Input
              type="number"
              className={localSettings.maxWithdrawalType === "fixed" ? "pl-10" : "pr-10"}
              value={localSettings.maxWithdrawalValue}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, maxWithdrawalValue: Number(e.target.value) }))}
            />
            {localSettings.maxWithdrawalType === "percentage" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            {localSettings.maxWithdrawalType === "percentage" 
              ? "* Anggota dapat menarik maksimal " + localSettings.maxWithdrawalValue + "% dari total saldo mereka."
              : "* Anggota dapat menarik maksimal Rp " + localSettings.maxWithdrawalValue.toLocaleString() + " dalam satu kali pengajuan."}
          </p>
        </div>
      </div>

      {/* Minimum Preserved Balance Section */}
      <div className="space-y-4 p-4 border rounded-xl bg-emerald-50/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <span className="text-lg">🛡️</span>
          </div>
          <Label className="text-base font-bold text-slate-800">Saldo Minimal yang Harus Tersisa</Label>
        </div>
        <p className="text-sm text-slate-500">
          Atur saldo minimal yang wajib ditinggalkan di dalam rekening anggota.
        </p>

        <RadioGroup 
          value={localSettings.minPreservedBalanceType} 
          onValueChange={(val: any) => setLocalSettings(prev => ({ ...prev, minPreservedBalanceType: val }))}
          className="flex gap-6 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="min-fixed" />
            <Label htmlFor="min-fixed" className="cursor-pointer">Nominal Tetap (Rp)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="min-percent" />
            <Label htmlFor="min-percent" className="cursor-pointer">Persentase (%)</Label>
          </div>
        </RadioGroup>

        <div className="pt-2">
          <div className="relative max-w-[240px]">
            {localSettings.minPreservedBalanceType === "fixed" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
            )}
            <Input
              type="number"
              className={localSettings.minPreservedBalanceType === "fixed" ? "pl-10" : "pr-10"}
              value={localSettings.minPreservedBalanceValue}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, minPreservedBalanceValue: Number(e.target.value) }))}
            />
            {localSettings.minPreservedBalanceType === "percentage" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            {localSettings.minPreservedBalanceType === "percentage" 
              ? "* Anggota wajib menyisakan minimal " + localSettings.minPreservedBalanceValue + "% dari total saldo mereka."
              : "* Anggota wajib menyisakan minimal Rp " + localSettings.minPreservedBalanceValue.toLocaleString() + " di rekening mereka."}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="gap-2 bg-slate-900 hover:bg-slate-800">
          <Save size={16} />
          Simpan Aturan Penarikan
        </Button>
      </div>
    </div>
  );
}
