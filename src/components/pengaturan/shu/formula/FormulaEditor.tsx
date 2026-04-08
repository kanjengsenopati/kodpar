
import { useState } from "react";
import { Pengaturan } from "@/types";
import { FormulaEditorCard } from "./FormulaEditorCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface FormulaEditorProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variables: { id: string; label: string; description: string; value: number }[];
}

export function FormulaEditor({ settings, setSettings, variables }: FormulaEditorProps) {
  const [showGuidance, setShowGuidance] = useState(true);
  
  return (
    <div className="space-y-4">
      {showGuidance && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-sm text-blue-700">
                Formula SHU digunakan untuk menghitung Sisa Hasil Usaha anggota berdasarkan 
                variabel yang tersedia. Gunakan variabel dan operator untuk membuat formula yang akan 
                digunakan dalam kalkulasi SHU untuk setiap anggota.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
      
      <FormulaEditorCard 
        settings={settings} 
        setSettings={setSettings} 
        variables={variables} 
      />
    </div>
  );
}
