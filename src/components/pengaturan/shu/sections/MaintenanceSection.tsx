
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { SHUManager } from "@/services/transaksi/financialOperations/SHUManager";
import { toast } from "sonner";

export function MaintenanceSection() {
  // Reset all SHU values
  const handleResetAllSHU = () => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin mereset dan menghitung ulang nilai SHU untuk semua anggota? " +
      "Operasi ini akan menggunakan formula terbaru untuk kalkulasi."
    );
    
    if (confirmed) {
      try {
        const count = SHUManager.resetAllValues();
        toast.success(`${count} nilai SHU berhasil direset dan dihitung ulang`);
      } catch (error) {
        console.error("Error resetting SHU values:", error);
        toast.error("Gagal mereset nilai SHU");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pemeliharaan SHU</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">Reset & Recalculate</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Reset semua nilai SHU dan hitung ulang menggunakan formula terbaru
          </p>
          <Button 
            variant="secondary" 
            onClick={handleResetAllSHU}
            className="mt-2"
          >
            Reset & Hitung Ulang SHU
          </Button>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Refresh Kalkulasi</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Refresh kalkulasi SHU untuk semua anggota
          </p>
          <Button 
            variant="outline" 
            onClick={() => SHUManager.refreshCalculations()}
            className="mt-2"
          >
            Refresh Kalkulasi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
