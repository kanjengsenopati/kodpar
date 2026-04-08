
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Settings, Sparkles, Calculator } from "lucide-react";

interface Variable {
  id: string;
  label: string;
  description: string;
}

interface CustomVariable {
  id: string;
  name: string;
  description: string;
  valueType: "jumlah" | "persentase";
  value: number;
}

interface VariableSelectorProps {
  availableVariables: Variable[];
  customVariables: CustomVariable[];
  onVariableInsert: (variableId: string) => void;
}

export function VariableSelector({ 
  availableVariables, 
  customVariables, 
  onVariableInsert 
}: VariableSelectorProps) {
  return (
    <Card className="border-2 border-muted/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Variabel Tersedia
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Klik variabel untuk menambahkan ke formula perhitungan
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Variables */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
              <Settings className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Variabel Sistem</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {availableVariables.length} tersedia
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableVariables.map(variable => (
              <Button
                key={variable.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group border-2"
                onClick={() => onVariableInsert(variable.id)}
                title={variable.description}
              >
                <div className="flex items-center gap-2 w-full">
                  <Calculator className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  <code className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-800 group-hover:bg-blue-200">
                    {variable.id}
                  </code>
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm text-gray-900 group-hover:text-blue-900">
                    {variable.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {variable.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Custom Variables */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Variabel Custom</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {customVariables.length} tersedia
            </Badge>
          </div>
          
          {customVariables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customVariables.map(variable => (
                <Button
                  key={variable.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group border-2"
                  onClick={() => onVariableInsert(variable.id)}
                  title={`${variable.description} - Nilai: ${variable.valueType === "jumlah" ? variable.value.toLocaleString('id-ID') : `${variable.value}%`}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Sparkles className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                    <code className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-800 group-hover:bg-blue-200">
                      {variable.id}
                    </code>
                  </div>
                  <div className="text-left w-full">
                    <div className="font-medium text-sm text-gray-900 group-hover:text-blue-900">
                      {variable.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {variable.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {variable.valueType === "jumlah" ? "Rupiah" : "Persen"}
                      </Badge>
                      <span className="text-xs font-mono text-blue-600">
                        {variable.valueType === "jumlah" 
                          ? `Rp ${variable.value.toLocaleString('id-ID')}` 
                          : `${variable.value}%`
                        }
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg bg-muted/20">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground mb-1">Belum ada variabel custom</p>
              <p className="text-xs text-muted-foreground">
                Buat variabel custom di tab "Variabel" untuk menambahkan parameter khusus
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
