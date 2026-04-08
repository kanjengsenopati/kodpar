
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings2, PieChart, RefreshCcw, Beaker, Calculator, Gift } from "lucide-react";
import { Pengaturan } from "@/types";
import { VariableActionList } from "./formula-simplified/VariableActionList";
import { FormulaDistributionSettings } from "./formula-simplified/FormulaDistributionSettings";
import { useSHUVariables } from "./hooks/useSHUVariables";
import { MaintenanceSection } from "./sections/MaintenanceSection";
import { CustomVariables } from "./CustomVariables";
import { PusatRumus } from "./pusat-rumus/PusatRumus";
import { FormulaManagerSection } from "./sections/FormulaManagerSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimplifiedSHUSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function SimplifiedSHUSettings({ settings, setSettings }: SimplifiedSHUSettingsProps) {
  // Get SHU variables for formula input
  const variables = useSHUVariables();
  
  // Convert variables array to record for evaluation
  const variablesRecord = variables.reduce((acc, v) => {
    acc[v.id] = v.value;
    return acc;
  }, {} as Record<string, number>);
  
  // Add custom variables from settings
  const customVariables = settings.shu?.customVariables || [];
  customVariables.forEach(v => {
    variablesRecord[v.id] = v.value;
  });

  // Reference to the formula inputs
  const shuFormulaInputRef = useRef<HTMLInputElement>(null);
  const thrFormulaInputRef = useRef<HTMLInputElement>(null);
  
  // Handle variable insertion for different formula types
  const handleUseVariable = (variableId: string, formulaType: 'shu' | 'thr' = 'shu') => {
    const inputRef = formulaType === 'shu' ? shuFormulaInputRef.current : thrFormulaInputRef.current;
    
    if (inputRef) {
      const input = inputRef;
      const cursorPos = input.selectionStart || 0;
      
      // Get current formula from settings
      const currentFormula = formulaType === 'shu' 
        ? (settings.shu?.formula || "")
        : (settings.shu?.thrFormula || "");
      
      // Insert variable at cursor position
      const newFormula = 
        currentFormula.substring(0, cursorPos) + 
        variableId + 
        currentFormula.substring(cursorPos);
      
      // Update settings with new formula
      setSettings({
        ...settings,
        shu: {
          ...(settings.shu || {}),
          [formulaType === 'shu' ? 'formula' : 'thrFormula']: newFormula
        }
      });
      
      // Focus and place cursor after the inserted variable
      setTimeout(() => {
        if (input) {
          input.focus();
          const newPos = cursorPos + variableId.length;
          input.setSelectionRange(newPos, newPos);
        }
      }, 10);
    }
  };

  // Handle main formula update from Pusat Rumus
  const handleUpdateMainFormula = (formula: string, formulaType: 'shu' | 'thr' = 'shu') => {
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        [formulaType === 'shu' ? 'formula' : 'thrFormula']: formula
      }
    });
  };

  return (
    <div className="space-y-6">
      <FormulaManagerSection 
        settings={settings} 
        setSettings={setSettings} 
        variablesRecord={variablesRecord}
        shuFormulaInputRef={shuFormulaInputRef}
        thrFormulaInputRef={thrFormulaInputRef}
      />
      
      <Tabs defaultValue="pusat-rumus" className="mt-6">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="pusat-rumus" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Pusat Rumus
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Variabel
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Distribusi SHU
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Pemeliharaan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pusat-rumus" className="space-y-4 mt-4">
          <PusatRumus 
            onUpdateMainFormula={handleUpdateMainFormula}
            onUseVariable={handleUseVariable}
          />
        </TabsContent>
        
        <TabsContent value="variables" className="space-y-4 mt-4">
          <VariableActionList 
            variables={variables} 
            onUseVariable={(variableId) => handleUseVariable(variableId, 'shu')} 
          />
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Variabel Kustom Legacy</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomVariables 
                settings={settings}
                setSettings={setSettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-4">
          <FormulaDistributionSettings 
            settings={settings}
            setSettings={setSettings}
          />
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
