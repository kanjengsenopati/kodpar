
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code, ListTree, Calculator } from "lucide-react";
import { FormulaInput } from "./FormulaInput";
import { FormulaPreview } from "./FormulaPreview";
import { FormulaGuidance } from "./FormulaGuidance";
import { FormulaInserterActions } from "./FormulaInserterActions";
import { Pengaturan } from "@/types";

interface FormulaEditorContentProps {
  formulaInput: string;
  isEditing: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  previewResult: number;
  isValid: boolean;
  variables: { id: string; label: string; description: string; value: number }[];
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  handleFormulaChange: (value: string) => void;
  handleSave: () => void;
  resetFormula: () => void;
  handleCursorChange: (e: React.MouseEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  handleInsertVariable: (variable: string) => void;
  handleInsertOperator: (operator: string) => void;
  handleInsertConstant: (constant: string) => void;
  handleUseFormula: (formula: string) => void;
}

export function FormulaEditorContent({
  formulaInput,
  isEditing,
  isSaving,
  errorMessage,
  previewResult,
  isValid,
  variables,
  settings,
  setSettings,
  handleFormulaChange,
  handleSave,
  resetFormula,
  handleCursorChange,
  handleInsertVariable,
  handleInsertOperator,
  handleInsertConstant,
  handleUseFormula
}: FormulaEditorContentProps) {
  return (
    <CardContent className="space-y-4">
      <FormulaInput 
        formulaInput={formulaInput}
        onFormulaChange={handleFormulaChange}
        onSave={handleSave}
        onReset={resetFormula}
        isEditing={isEditing}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onCursorChange={handleCursorChange}
      />
      
      <Tabs defaultValue="builder" className="mt-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <ListTree className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Bantuan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="pt-4">
          <FormulaInserterActions
            variables={variables}
            onInsertVariable={handleInsertVariable}
            onInsertOperator={handleInsertOperator}
            onInsertConstant={handleInsertConstant}
            onUseFormula={handleUseFormula}
            settings={settings}
            setSettings={setSettings}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="pt-4">
          <FormulaPreview 
            previewResult={previewResult}
            isValid={isValid}
            formula={formulaInput}
          />
        </TabsContent>
        
        <TabsContent value="help" className="pt-4">
          <FormulaGuidance errorMessage={errorMessage} />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}
