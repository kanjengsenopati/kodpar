
import { Button } from "@/components/ui/button";
import { FormulaComponent } from "@/types";
import { CodeXml, Trash2 } from "lucide-react";

interface FormulaComponentItemProps {
  component: FormulaComponent;
  onUse: (formula: string) => void;
  onDelete: (id: string) => void;
}

export function FormulaComponentItem({ 
  component, 
  onUse, 
  onDelete 
}: FormulaComponentItemProps) {
  return (
    <div className="border rounded-md p-3 bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{component.name}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {component.description || 'No description provided'}
          </p>
          <div className="mt-1 bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
            {component.formula}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUse(component.formula)}
            className="text-blue-600"
          >
            <CodeXml className="h-4 w-4 mr-2" />
            Gunakan
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(component.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
