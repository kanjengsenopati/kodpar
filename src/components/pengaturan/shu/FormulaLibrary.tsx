
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormulaComponents } from "./FormulaComponents";
import { FormulaSamples } from "./FormulaSamples";
import { Pengaturan } from "@/types";

interface FormulaLibraryProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variables: { id: string; label: string; description: string; value: number }[];
  onUseFormula: (formula: string) => void;
}

export function FormulaLibrary({ settings, setSettings, variables, onUseFormula }: FormulaLibraryProps) {
  return (
    <Tabs defaultValue="components">
      <TabsList className="mb-4 w-full grid grid-cols-2">
        <TabsTrigger value="components">Komponen Formula</TabsTrigger>
        <TabsTrigger value="samples">Contoh Formula</TabsTrigger>
      </TabsList>
      
      <TabsContent value="components">
        <FormulaComponents 
          settings={settings} 
          setSettings={setSettings}
          variables={variables}
          onUseComponent={onUseFormula}
        />
      </TabsContent>
      
      <TabsContent value="samples">
        <FormulaSamples onUseFormula={onUseFormula} />
      </TabsContent>
    </Tabs>
  );
}
