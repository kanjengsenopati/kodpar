
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Plus, Minus, X, Divide, Parentheses } from "lucide-react";

interface FormulaEditorProps {
  formula: string;
  onFormulaChange: (formula: string) => void;
  availableVariables: Array<{id: string; label: string}>;
}

const operators = [
  { symbol: "+", label: "Tambah", icon: Plus },
  { symbol: "-", label: "Kurang", icon: Minus },
  { symbol: "*", label: "Kali", icon: X },
  { symbol: "/", label: "Bagi", icon: Divide },
  { symbol: "(", label: "Kurung Buka", icon: Parentheses },
  { symbol: ")", label: "Kurung Tutup", icon: Parentheses },
];

export function FormulaEditor({ formula, onFormulaChange, availableVariables }: FormulaEditorProps) {
  const insertOperator = (operator: string) => {
    onFormulaChange(formula + ` ${operator} `);
  };

  const insertVariable = (variableId: string) => {
    onFormulaChange(formula + variableId);
  };

  const clearFormula = () => {
    onFormulaChange("");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="formula-input" className="text-sm font-medium flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Formula Kustom
        </Label>
        <Input
          id="formula-input"
          value={formula}
          onChange={(e) => onFormulaChange(e.target.value)}
          placeholder="Masukkan formula atau gunakan editor di bawah..."
          className="mt-1 font-mono text-sm"
        />
      </div>

      {/* Operators */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Operator Matematika</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {operators.map((operator) => {
              const IconComponent = operator.icon;
              return (
                <Button
                  key={operator.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => insertOperator(operator.symbol)}
                  className="h-8 text-xs flex items-center gap-1"
                  title={operator.label}
                >
                  <IconComponent className="h-3 w-3" />
                  <span className="font-mono">{operator.symbol}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Variables - Full width single column layout */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Variabel Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {availableVariables.map((variable) => (
              <Button
                key={variable.id}
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable.id)}
                className="h-auto p-3 justify-start text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {variable.id}
                  </Badge>
                  <span className="truncate text-sm">{variable.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFormula}
          className="text-xs"
        >
          Bersihkan
        </Button>
      </div>
    </div>
  );
}
