
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface OperatorsPanelProps {
  operators: { symbol: string; name: string; Icon: any }[];
  constants: number[];
  onInsertOperator: (operator: string) => void;
  onInsertConstant: (constant: string) => void;
}

export function OperatorsPanel({ operators, constants, onInsertOperator, onInsertConstant }: OperatorsPanelProps) {
  // Get constant description based on value
  const getConstantDescription = (value: number): string => {
    switch (value) {
      case 0.05:
        return "5% dari nilai variabel";
      case 0.1:
        return "10% dari nilai variabel";
      case 0.15:
        return "15% dari nilai variabel";
      case 0.2:
        return "20% dari nilai variabel";
      case 0.25:
        return "25% dari nilai variabel";
      case 0.5:
        return "50% dari nilai variabel";
      case 0.75:
        return "75% dari nilai variabel";
      case 1:
        return "100% dari nilai variabel";
      default:
        return `${value * 100}% dari nilai variabel`;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Operator</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {operators.map((op) => (
            <Button
              key={op.symbol}
              variant="outline"
              size="sm"
              onClick={() => onInsertOperator(op.symbol)}
              className="justify-center"
            >
              <op.Icon className="h-4 w-4 mr-2" />
              {op.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          Konstanta
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="p-2">
                <p className="text-xs">Nilai konstanta dalam desimal untuk digunakan dalam formula</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {constants.map((constant) => (
            <TooltipProvider key={constant}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInsertConstant(constant.toString())}
                    className="relative"
                  >
                    {constant}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <p className="text-xs">{getConstantDescription(constant)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
