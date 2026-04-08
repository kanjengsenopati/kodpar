
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Binary } from "lucide-react";

export function SheetFormulaHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Binary className="h-5 w-5" />
        Formula SHU Editor (Spreadsheet Style)
      </CardTitle>
    </CardHeader>
  );
}
