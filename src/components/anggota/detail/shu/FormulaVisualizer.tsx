
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface FormulaVisualizerProps {
  formula: string;
  variables: { name: string; value: number }[];
  totalSHU: number;
}

/**
 * Constants explanation for SHU calculation
 * These constants are used in different parts of the formula calculation
 */
const percentageExplanations: Record<string, { percent: string; description: string }> = {
  "simpanan_khusus": {
    percent: "40%",
    description: "Dari total simpanan, merepresentasikan simpanan sukarela anggota"
  },
  "simpanan_wajib": {
    percent: "60%",
    description: "Dari total simpanan, merepresentasikan simpanan rutin wajib anggota"
  },
  "simpanan_pokok": {
    percent: "20%",
    description: "Dari total simpanan, merepresentasikan simpanan pokok saat mendaftar"
  },
  "pendapatan": {
    percent: "20%",
    description: "Dari jasa, merepresentasikan pendapatan yang dilaporkan anggota"
  },
  "jasa": {
    percent: "100%",
    description: "Total jasa dari bunga pinjaman"
  },
  "lama_keanggotaan": {
    percent: "-",
    description: "Lama masa keanggotaan dalam tahun, mempengaruhi distribusi SHU"
  },
};

export function FormulaVisualizer({ formula, variables, totalSHU }: FormulaVisualizerProps) {
  // Get display names for variables
  const getDisplayName = (name: string) => {
    switch (name) {
      case "simpanan_khusus":
        return "Simpanan Khusus";
      case "simpanan_wajib": 
        return "Simpanan Wajib";
      case "pendapatan":
        return "Pendapatan";
      case "rekening_berjasa":
        return "Rekening Berjasa";
      case "rekening_penyimpan":
        return "Rekening Penyimpan";
      case "total_pendapatan_bunga":
        return "Pendapatan Bunga";
      case "pendapatan_bunga_perorangan":
        return "Bunga Perorangan";
      case "lama_keanggotaan":
        return "Lama Keanggotaan";
      default:
        return name.replace(/_/g, " ");
    }
  };
  
  // Get variable contribution percentage (simplified estimation)
  const getContribution = (name: string, value: number) => {
    let contribution = 0;
    
    // Simple estimation based on variable value compared to total SHU
    if (totalSHU > 0) {
      contribution = Math.min(100, Math.max(0, (value / totalSHU) * 50));
    }
    
    // Adjust based on variable type
    switch (name) {
      case "simpanan_khusus":
        return contribution * 0.6;
      case "simpanan_wajib":
        return contribution * 0.3;
      case "pendapatan":
        return contribution * 0.2;
      default:
        return contribution * 0.1;
    }
  };
  
  // Get color for variable
  const getColor = (name: string) => {
    switch (name) {
      case "simpanan_khusus":
        return "bg-blue-500";
      case "simpanan_wajib":
        return "bg-green-500";
      case "pendapatan":
        return "bg-amber-500";
      case "rekening_berjasa":
        return "bg-purple-500";
      case "rekening_penyimpan":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-3">
        <p>Formula digunakan: <code className="bg-muted px-1 py-0.5 rounded">{formula}</code></p>
      </div>
      
      {variables.map((variable) => (
        <div key={variable.name} className="space-y-1">
          <div className="flex justify-between text-sm items-center">
            <span className="font-medium flex items-center gap-1">
              {getDisplayName(variable.name)}
              
              {percentageExplanations[variable.name] && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 space-y-2">
                      <p className="font-semibold">
                        {getDisplayName(variable.name)} ({percentageExplanations[variable.name].percent})
                      </p>
                      <p>{percentageExplanations[variable.name].description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
            <span>{formatCurrency(variable.value)}</span>
          </div>
          <Progress 
            value={getContribution(variable.name, variable.value)} 
            className={`h-2 ${getColor(variable.name)}`} 
          />
        </div>
      ))}
      
      <div className="pt-2 mt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm font-semibold">
          <span>Total SHU</span>
          <span>{formatCurrency(totalSHU)}</span>
        </div>
      </div>
    </div>
  );
}
