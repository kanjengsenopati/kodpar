
import { Button } from "@/components/ui/button";

interface FormulaOperatorsProps {
  onInsertOperator: (operator: string) => void;
  onInsertValue?: (value: string) => void;
}

export function FormulaOperators({ onInsertOperator, onInsertValue }: FormulaOperatorsProps) {
  // Common operators for mathematical operations
  const operators = [
    { label: "+", value: "+" },
    { label: "-", value: "-" },
    { label: "*", value: "*" },
    { label: "/", value: "/" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: ">=", value: ">=" },
    { label: "<=", value: "<=" },
  ];
  
  // Common constant values
  const constants = [
    { label: "0.01 (1%)", value: "0.01" },
    { label: "0.05 (5%)", value: "0.05" },
    { label: "0.10 (10%)", value: "0.10" },
    { label: "0.25 (25%)", value: "0.25" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Operator</h3>
      <div className="flex flex-wrap gap-1">
        {operators.map((op) => (
          <Button
            key={op.value}
            variant="outline"
            size="sm"
            onClick={() => onInsertOperator(op.value)}
            className="min-w-10"
          >
            {op.label}
          </Button>
        ))}
      </div>
      
      {onInsertValue && (
        <>
          <h3 className="text-sm font-medium mt-3">Nilai Umum</h3>
          <div className="flex flex-wrap gap-1">
            {constants.map((constant) => (
              <Button
                key={constant.value}
                variant="outline"
                size="sm"
                onClick={() => onInsertValue(constant.value)}
              >
                {constant.label}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
