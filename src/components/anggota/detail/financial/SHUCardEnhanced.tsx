
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { SHUManager } from "@/services/transaksiService";
import * as Text from "@/components/ui/text";
import { formatCurrency } from "@/utils/formatters";

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
    <Card className="hover:shadow-md transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden">
      {/* Top-Right Action Cluster */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {anggotaId && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-slate-50 transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              refreshSHU();
            }}
            disabled={isRefreshing}
            title="Refresh nilai SHU"
          >
            <RefreshCw size={18} strokeWidth={2} className={`text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-1 gap-2">
              <Text.Label>SHU</Text.Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] rounded-xl border-none shadow-xl">
                    <Text.Caption className="text-[10px] leading-tight text-white not-italic">
                      Sisa Hasil Usaha adalah keuntungan yang dibagikan kepada anggota berdasarkan formula yang ditetapkan
                    </Text.Caption>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Text.Amount className="text-xl block">{formatCurrency(totalSHU)}</Text.Amount>
          </div>
          <div className="rounded-2xl bg-purple-50 p-3 ml-3">
            <BadgeDollarSign className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


