
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { SHUManager } from "@/services/transaksi/financialOperations/SHUManager";

interface SHUCardProps {
  totalSHU: number;
  anggotaId?: string;
  onRefresh?: (newValue: number) => void;
}

export function SHUCardEnhanced({ totalSHU, anggotaId, onRefresh }: SHUCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshSHU = () => {
    if (!anggotaId) return;
    
    setIsRefreshing(true);
    try {
      // Force recalculation by clearing cache first
      localStorage.removeItem(`shu_result_${anggotaId}`);
      
      // Then call the service to calculate
      const newSHU = SHUManager.calculateForMember(anggotaId);
      
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
            <div className="flex items-center mb-1 gap-2">
              <p className="text-sm text-muted-foreground">SHU</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-xs">Sisa Hasil Usaha adalah keuntungan yang dibagikan kepada anggota berdasarkan formula yang ditetapkan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
