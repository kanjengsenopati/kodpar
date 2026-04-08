
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { getCurrentSHUFormula, getSHUVariableExplanations } from "@/services/transaksi/financialOperations/shuOperations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SHUFormulaInfo() {
  // Get current formula and variables explanation
  const currentFormula = getCurrentSHUFormula();
  const variableExplanations = getSHUVariableExplanations();
  
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-blue-700">
          Formula SHU dikonfigurasikan oleh administrator koperasi dan digunakan untuk menghitung
          pembagian Sisa Hasil Usaha untuk setiap anggota.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="pt-4">
          <h3 className="text-lg font-medium">Formula Saat Ini</h3>
          <code className="block bg-muted p-3 rounded-md mt-2 text-sm">
            {currentFormula}
          </code>
          
          <h4 className="text-md font-medium mt-4">Keterangan Variabel</h4>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Variabel</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variableExplanations.map((variable) => (
                <TableRow key={variable.name}>
                  <TableCell className="font-mono">{variable.name}</TableCell>
                  <TableCell>{variable.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
