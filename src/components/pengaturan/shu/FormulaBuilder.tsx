
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VariablesPanel } from "./VariablesPanel";
import { OperatorsPanel } from "./OperatorsPanel";
import { FormulaLibrary } from "./FormulaLibrary";
import { Pengaturan } from "@/types";

interface FormulaBuilderProps {
  variables: { id: string; label: string; description: string; value: number }[];
  onInsertVariable: (variable: string) => void;
  onInsertOperator: (operator: string) => void;
  onInsertConstant: (constant: string) => void;
  onUseFormula?: (formula: string) => void;
  settings?: Pengaturan;
  setSettings?: (settings: Pengaturan) => void;
}

export function FormulaBuilder({ 
  variables, 
  onInsertVariable,
  onInsertOperator,
  onInsertConstant,
  onUseFormula,
  settings,
  setSettings
}: FormulaBuilderProps) {
  // Available operators
  const operators = [
    { symbol: "+", name: "Tambah", Icon: Plus },
    { symbol: "-", name: "Kurang", Icon: Minus },
    { symbol: "*", name: "Kali", Icon: MultiplyIcon },
    { symbol: "/", name: "Bagi", Icon: DivideIcon },
    { symbol: "%", name: "Persen", Icon: Percent },
  ];

  // Constants for quick insertion
  const constants = [0.05, 0.1, 0.15, 0.2, 0.25, 0.5, 0.75, 1];

  return (
    <Tabs defaultValue="variables">
      <TabsList className="mb-4 w-full grid grid-cols-3">
        <TabsTrigger value="variables">Variabel</TabsTrigger>
        <TabsTrigger value="operators">Operator</TabsTrigger>
        <TabsTrigger value="library">Perpustakaan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="variables">
        <div className="p-2 border rounded-md">
          <VariablesPanel 
            variables={variables} 
            onInsertVariable={onInsertVariable} 
          />
        </div>
      </TabsContent>

      <TabsContent value="operators">
        <div className="p-2 border rounded-md">
          <OperatorsPanel 
            operators={operators} 
            constants={constants} 
            onInsertOperator={onInsertOperator} 
            onInsertConstant={value => onInsertConstant(value.toString())}
          />
        </div>
      </TabsContent>

      <TabsContent value="library">
        <div className="p-2 border rounded-md">
          {/* Render library if we have settings and onUseFormula */}
          {settings && setSettings && onUseFormula ? (
            <FormulaLibrary
              settings={settings}
              setSettings={setSettings}
              variables={variables}
              onUseFormula={onUseFormula}
            />
          ) : (
            <div className="text-center p-4">
              <p>Pilih "Komponen Formula" di menu utama untuk menambah atau menggunakan komponen formula yang tersimpan.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Import from lucide-react to avoid errors
import { 
  Plus,
  Minus,
  Percent,
  DivideIcon,
  X as MultiplyIcon,
} from "lucide-react";
