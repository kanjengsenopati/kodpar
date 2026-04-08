
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { calculateSHU } from "@/services/transaksi/financialOperations/shuOperations";

interface SHUCardProps {
  totalSHU: number;
  anggotaId?: string;
  onRefresh?: (newValue: number) => void;
}

export function SHUCard({ totalSHU, anggotaId, onRefresh }: SHUCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshSHU = () => {
    if (!anggotaId) return;
    
    setIsRefreshing(true);
    try {
      // Force recalculation by clearing cache first
      localStorage.removeItem(`shu_result_${anggotaId}`);
      
      // Then call the service to calculate
      const newSHU = calculateSHU(anggotaId);
      
      console.log(`SHU recalculated for ${anggotaId}: ${newSHU}`);
      toast.success("Nilai SHU berhasil diperbarui");
      
      if (onRefresh) {
        onRefresh(newSHU);
      }
    } catch (error) {
      console.error("Error recalculating SHU:", error);
      toast.error("Gagal memperbarui nilai SHU");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">SHU</p>
            <p className="text-xl font-bold">Rp {totalSHU.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-2">
              <BadgeDollarSign className="h-5 w-5 text-purple-600" />
            </div>
            {anggotaId && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={refreshSHU}
                disabled={isRefreshing}
                title="Refresh nilai SHU"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
