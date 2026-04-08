
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { getPengaturan } from "@/services/pengaturanService";
import { calculateSHUDistribution } from "@/services/transaksi/financialOperations";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface SHUDistributionProps {
  totalSHU: number;
}

// Distribution explanations
const distributionExplanations: Record<string, string> = {
  rekening_penyimpan: "Bagian yang didistribusikan kepada anggota berdasarkan jumlah simpanan",
  rekening_berjasa: "Bagian yang didistribusikan kepada anggota berdasarkan transaksi & jasa",
  pengurus: "Bagian untuk pengurus koperasi sebagai insentif pengelolaan",
  dana_karyawan: "Dana untuk kesejahteraan karyawan koperasi",
  dana_pendidikan: "Dana untuk meningkatkan pendidikan dan keterampilan anggota",
  dana_pembangunan_daerah: "Kontribusi koperasi untuk pembangunan ekonomi daerah",
  dana_sosial: "Dana untuk kegiatan sosial dan bantuan bencana",
  cadangan: "Dana cadangan untuk pengembangan usaha koperasi"
};

export function SHUDistribution({ totalSHU }: SHUDistributionProps) {
  // Get SHU distribution percentages from settings
  const settings = getPengaturan();
  const distribution = settings.shu?.distribution || {
    rekening_penyimpan: 25,       // 25%
    rekening_berjasa: 25,         // 25%
    pengurus: 10,                 // 10%
    dana_karyawan: 5,             // 5%
    dana_pendidikan: 10,          // 10%
    dana_pembangunan_daerah: 2.5, // 2.5%
    dana_sosial: 2.5,             // 2.5%
    cadangan: 20                  // 20%
  };

  // Distribution colors
  const colors = {
    rekening_penyimpan: "bg-blue-500",
    rekening_berjasa: "bg-green-500",
    pengurus: "bg-amber-500",
    dana_karyawan: "bg-purple-500",
    dana_pendidikan: "bg-indigo-500",
    dana_pembangunan_daerah: "bg-pink-500",
    dana_sosial: "bg-red-500",
    cadangan: "bg-slate-500"
  };

  // Calculate the monetary values for each distribution item
  const distributionValues = calculateSHUDistribution(totalSHU);
  
  // Get display names
  const getDisplayName = (key: string) => {
    switch (key) {
      case "rekening_penyimpan": return "Rekening anggota penyimpan";
      case "rekening_berjasa": return "Rekening anggota berjasa";
      case "pengurus": return "Pengurus";
      case "dana_karyawan": return "Dana Karyawan";
      case "dana_pendidikan": return "Dana pendidikan";
      case "dana_pembangunan_daerah": return "Dana Pembangunan Daerah";
      case "dana_sosial": return "Dana sosial";
      case "cadangan": return "Cadangan";
      default: return key.replace(/_/g, " ");
    }
  };
  
  // Create the distribution items array for rendering
  const distributionItems = Object.keys(distribution).map(key => {
    const typedKey = key as keyof typeof distribution;
    return {
      id: key,
      name: getDisplayName(key),
      percentage: distribution[typedKey],
      value: distributionValues[typedKey as keyof typeof distributionValues],
      color: colors[typedKey as keyof typeof colors],
      explanation: distributionExplanations[key]
    };
  });

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="text-lg font-medium mb-4">Distribusi SHU</h3>
        <div className="space-y-3">
          {distributionItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium flex items-center gap-1">
                  {item.name} ({item.percentage}%)
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-3">
                        <p>{item.explanation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span>{formatCurrency(item.value)}</span>
              </div>
              <Progress 
                value={item.percentage} 
                className={`h-2 ${item.color}`} 
                max={100}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
