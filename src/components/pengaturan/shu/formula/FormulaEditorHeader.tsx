
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export function FormulaEditorHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        Editor Formula SHU
      </CardTitle>
      <CardDescription>
        Buat dan edit formula untuk menghitung SHU anggota berdasarkan kontribusi mereka
      </CardDescription>
    </CardHeader>
  );
}
