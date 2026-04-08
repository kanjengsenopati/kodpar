
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface VariablesTableProps {
  variables: { id: string; label: string; description: string; value: number }[];
  customVariables: { id: string; name: string; description: string; valueType: string; value: number }[];
  onInsertVariable: (variable: string) => void;
}

export function VariablesTable({ variables, customVariables, onInsertVariable }: VariablesTableProps) {
  // Get display label for variable
  const getDisplayLabel = (id: string, label: string) => {
    // Convert camelCase or snake_case to Title Case
    const formattedLabel = label || id.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
    return formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1);
  };
  
  // Get variable explanation
  const getVariableDescription = (id: string, description: string) => {
    if (description) return description;
    
    // Default descriptions for common variables
    switch (id) {
      case "simpanan_pokok":
        return "Simpanan yang wajib dibayarkan anggota saat pertama kali bergabung";
      case "simpanan_wajib":
        return "Simpanan yang wajib dibayarkan anggota secara rutin setiap periode";
      case "simpanan_khusus":
        return "Simpanan sukarela yang bisa ditambahkan oleh anggota";
      case "totalSimpanan":
        return "Total seluruh simpanan anggota (pokok + wajib + khusus)";
      case "pinjaman":
        return "Total nilai pinjaman yang dimiliki anggota";
      case "jasa":
        return "Nilai jasa dari bunga pinjaman yang dibayarkan anggota";
      case "pendapatan":
        return "Pendapatan anggota yang dilaporkan";
      default:
        return "Variabel untuk perhitungan SHU anggota";
    }
  };
  
  // Get percentage explanation for a variable value
  const getPercentageExplanation = (id: string, value: number) => {
    // Generate explanation for percentage values
    const commonPercentages: Record<string, string> = {
      "simpanan_pokok": "20% dari total SHU dialokasikan untuk simpanan pokok",
      "simpanan_wajib": "60% dari total SHU dialokasikan untuk simpanan wajib",
      "simpanan_khusus": "40% dari total SHU dialokasikan untuk simpanan khusus",
      "pendapatan": "20% dari total SHU dialokasikan berdasarkan pendapatan",
      "lama_keanggotaan": "Masa keanggotaan mempengaruhi alokasi SHU"
    };
    
    return commonPercentages[id] || null;
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        Variabel Tersedia
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs">
              <p className="text-xs">
                Variabel berikut dapat digunakan dalam formula SHU.
                Klik tombol "+" untuk menyisipkan variabel ke dalam formula.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variabel</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Nilai Contoh</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.map((variable) => (
              <TableRow key={variable.id}>
                <TableCell className="font-medium">
                  <code>{variable.id}</code>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="cursor-help border-b border-dotted border-gray-400">
                        {getDisplayLabel(variable.id, variable.label)}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{getDisplayLabel(variable.id, variable.label)}</h4>
                        <p className="text-xs text-muted-foreground">
                          {getVariableDescription(variable.id, variable.description)}
                        </p>
                        {getPercentageExplanation(variable.id, variable.value) && (
                          <div className="bg-primary/10 p-2 rounded text-xs mt-2">
                            {getPercentageExplanation(variable.id, variable.value)}
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          {formatCurrency(variable.value)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="p-2">
                        <p className="text-xs">Contoh nilai untuk simulasi perhitungan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onInsertVariable(variable.id)}
                    className="h-8 w-8 p-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Insert</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Custom Variables */}
            {customVariables.map((variable) => (
              <TableRow key={variable.id}>
                <TableCell className="font-medium">
                  <code>{variable.id}</code>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="cursor-help border-b border-dotted border-gray-400">
                        {variable.name} <span className="text-xs text-muted-foreground">(Kustom)</span>
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{variable.name}</h4>
                        <p className="text-xs text-muted-foreground">{variable.description}</p>
                        <div className="bg-secondary/20 p-2 rounded text-xs">
                          Variabel kustom {variable.valueType === "persentase" ? "(persentase)" : "(nilai tetap)"}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          {variable.valueType === "persentase" 
                            ? `${variable.value}%` 
                            : formatCurrency(variable.value)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="p-2">
                        <p className="text-xs">
                          {variable.valueType === "persentase"
                            ? `${variable.value}% - Dalam formula ditulis sebagai ${variable.value/100}`
                            : "Nilai tetap untuk perhitungan"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onInsertVariable(variable.id)}
                    className="h-8 w-8 p-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Insert</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
