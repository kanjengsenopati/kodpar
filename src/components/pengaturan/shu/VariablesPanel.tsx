
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface VariablesPanelProps {
  variables: { id: string; label: string; description: string; value: number }[];
  onInsertVariable: (variable: string) => void;
}

export function VariablesPanel({ variables, onInsertVariable }: VariablesPanelProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {variables.map((variable) => (
          <Button
            key={variable.id}
            variant="outline"
            size="sm"
            onClick={() => onInsertVariable(variable.id)}
            className="justify-start overflow-hidden"
          >
            <span className="truncate">{variable.label}</span>
          </Button>
        ))}
      </div>

      <div className="mt-2">
        <Label className="text-xs text-muted-foreground mb-1 block">
          Deskripsi Variabel:
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {variables.map((variable) => (
            <div key={variable.id} className="flex items-center">
              <Badge variant="outline" className="mr-2">{variable.id}</Badge>
              <span className="text-xs">{variable.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
