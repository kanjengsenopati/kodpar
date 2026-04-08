
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Operator {
  symbol: string;
  label: string;
}

interface OperatorSelectorProps {
  operators: Operator[];
  onOperatorInsert: (operator: string) => void;
}

export function OperatorSelector({ operators, onOperatorInsert }: OperatorSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Operator Matematika</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {operators.map(operator => (
            <Button
              key={operator.symbol}
              variant="outline"
              size="sm"
              onClick={() => onOperatorInsert(operator.symbol)}
              className="h-10 w-full"
            >
              <span className="text-lg font-mono">{operator.symbol}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
