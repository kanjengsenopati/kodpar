
import { useState } from "react";
import { Pengaturan } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { TotalStatisticsSection } from "./TotalStatisticsSection";

interface AdditionalSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function AdditionalSettings({ settings, setSettings }: AdditionalSettingsProps) {
  const [minValue, setMinValue] = useState(settings.shu?.minValue || "0");
  const [maxValue, setMaxValue] = useState(settings.shu?.maxValue || "10000000");
  const [isChanged, setIsChanged] = useState(false);
  
  // Handle min value change
  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(e.target.value);
    setIsChanged(true);
  };
  
  // Handle max value change
  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(e.target.value);
    setIsChanged(true);
  };
  
  // Save changes
  const handleSave = () => {
    try {
      // Parse min and max values to ensure they're valid numbers
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);
      
      if (isNaN(min) || isNaN(max)) {
        toast.error("Nilai minimum dan maksimum harus berupa angka");
        return;
      }
      
      if (min > max) {
        toast.error("Nilai minimum tidak boleh lebih besar dari nilai maksimum");
        return;
      }
      
      // Update settings
      const updatedSettings = {
        ...settings,
        shu: {
          ...(settings.shu || {}),
          minValue: minValue,
          maxValue: maxValue
        }
      };
      
      setSettings(updatedSettings);
      setIsChanged(false);
      toast.success("Pengaturan batas SHU berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan batas SHU");
      console.error("Error saving SHU limit settings:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Total statistics section */}
      <TotalStatisticsSection />
      
      <Separator className="my-6" />
      
      {/* Min/max SHU value settings */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Batas Nilai SHU</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-value">Nilai Minimum (Rp)</Label>
            <Input
              id="min-value"
              type="number"
              value={minValue}
              onChange={handleMinValueChange}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-value">Nilai Maksimum (Rp)</Label>
            <Input
              id="max-value"
              type="number" 
              value={maxValue}
              onChange={handleMaxValueChange}
              placeholder="10000000"
            />
          </div>
        </div>
        
        {isChanged && (
          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </div>
        )}
      </div>
    </div>
  );
}
