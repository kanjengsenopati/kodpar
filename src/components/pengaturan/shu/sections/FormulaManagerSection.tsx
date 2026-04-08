
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Gift, Save, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import { Pengaturan } from "@/types";
import { validateFormula } from "@/services/keuangan/formulaEvaluatorService";
import { toast } from "sonner";

interface FormulaManagerSectionProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variablesRecord: Record<string, number>;
  shuFormulaInputRef: React.RefObject<HTMLInputElement>;
  thrFormulaInputRef: React.RefObject<HTMLInputElement>;
}

export function FormulaManagerSection({
  settings,
  setSettings,
  variablesRecord,
  shuFormulaInputRef,
  thrFormulaInputRef
}: FormulaManagerSectionProps) {
  const [shuFormula, setShuFormula] = useState(settings.shu?.formula || "");
  const [thrFormula, setThrFormula] = useState(settings.shu?.thrFormula || "");
  const [shuError, setShuError] = useState<string | null>(null);
  const [thrError, setThrError] = useState<string | null>(null);
  const [shuResult, setShuResult] = useState<number | null>(null);
  const [thrResult, setThrResult] = useState<number | null>(null);

  // Validate and evaluate formula
  const validateAndEvaluate = (formula: string, setError: (error: string | null) => void, setResult: (result: number | null) => void) => {
    if (!formula.trim()) {
      setError("Formula tidak boleh kosong");
      setResult(null);
      return false;
    }

    const validation = validateFormula(formula, variablesRecord);
    
    if (validation.isValid) {
      setError(null);
      setResult(validation.testResult || 0);
      return true;
    } else {
      setError(validation.error || "Formula tidak valid");
      setResult(null);
      return false;
    }
  };

  // Handle SHU formula change
  const handleShuFormulaChange = (newFormula: string) => {
    setShuFormula(newFormula);
    validateAndEvaluate(newFormula, setShuError, setShuResult);
  };

  // Handle THR formula change
  const handleThrFormulaChange = (newFormula: string) => {
    setThrFormula(newFormula);
    validateAndEvaluate(newFormula, setThrError, setThrResult);
  };

  // Save formula
  const saveFormula = (formulaType: 'shu' | 'thr') => {
    const formula = formulaType === 'shu' ? shuFormula : thrFormula;
    const error = formulaType === 'shu' ? shuError : thrError;
    
    if (validateAndEvaluate(formula, formulaType === 'shu' ? setShuError : setThrError, formulaType === 'shu' ? setShuResult : setThrResult)) {
      setSettings({
        ...settings,
        shu: {
          ...(settings.shu || {}),
          [formulaType === 'shu' ? 'formula' : 'thrFormula']: formula
        }
      });
      
      toast.success(`Formula ${formulaType.toUpperCase()} berhasil disimpan`);
      return true;
    } else {
      toast.error(`Formula ${formulaType.toUpperCase()} tidak valid: ${error}`);
      return false;
    }
  };

  // Reset formula
  const resetFormula = (formulaType: 'shu' | 'thr') => {
    const originalFormula = formulaType === 'shu' 
      ? (settings.shu?.formula || "")
      : (settings.shu?.thrFormula || "");
    
    if (formulaType === 'shu') {
      setShuFormula(originalFormula);
      validateAndEvaluate(originalFormula, setShuError, setShuResult);
    } else {
      setThrFormula(originalFormula);
      validateAndEvaluate(originalFormula, setThrError, setThrResult);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Editor Rumus THR & SHU
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="shu" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shu" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Formula SHU
            </TabsTrigger>
            <TabsTrigger value="thr" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Formula THR
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shu" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shu-formula">Formula SHU</Label>
              <Input
                id="shu-formula"
                ref={shuFormulaInputRef}
                value={shuFormula}
                onChange={(e) => handleShuFormulaChange(e.target.value)}
                placeholder="Masukkan formula SHU..."
                className={shuError ? "border-red-500" : ""}
              />
              
              {shuError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {shuError}
                </div>
              )}
              
              {!shuError && shuResult !== null && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Preview: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shuResult)}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => saveFormula('shu')} 
                disabled={!!shuError}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Formula SHU
              </Button>
              <Button 
                variant="outline" 
                onClick={() => resetFormula('shu')}
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="thr" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thr-formula">Formula THR</Label>
              <Input
                id="thr-formula"
                ref={thrFormulaInputRef}
                value={thrFormula}
                onChange={(e) => handleThrFormulaChange(e.target.value)}
                placeholder="Masukkan formula THR..."
                className={thrError ? "border-red-500" : ""}
              />
              
              {thrError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {thrError}
                </div>
              )}
              
              {!thrError && thrResult !== null && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Preview: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(thrResult)}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => saveFormula('thr')} 
                disabled={!!thrError}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Formula THR
              </Button>
              <Button 
                variant="outline" 
                onClick={() => resetFormula('thr')}
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
