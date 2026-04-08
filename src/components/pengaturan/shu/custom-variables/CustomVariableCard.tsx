
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Variable } from "lucide-react";
import { CustomVariable } from "@/types";

interface CustomVariableCardProps {
  variable: CustomVariable;
  onUpdate: (id: string, value: number) => void;
  onEdit: (variable: CustomVariable) => void;
  onDelete: (id: string) => void;
}

export function CustomVariableCard({ 
  variable, 
  onUpdate, 
  onEdit, 
  onDelete 
}: CustomVariableCardProps) {
  return (
    <Card key={variable.id} className="bg-muted/30">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <Variable className="h-4 w-4 mr-2 text-primary" />
              <h4 className="font-medium">{variable.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{variable.description}</p>
            <p className="text-xs bg-muted px-1.5 py-0.5 rounded inline-block">ID: {variable.id}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-40">
              <div className="flex items-center">
                <Input
                  type="number"
                  value={variable.value.toString()}
                  onChange={(e) => onUpdate(variable.id, parseFloat(e.target.value) || 0)}
                  className="h-8"
                />
                <span className="ml-2 text-sm font-medium min-w-8">
                  {variable.valueType === 'jumlah' ? 'Rp' : '%'}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(variable)}
              className="text-blue-600 hover:text-blue-600 hover:bg-blue-600/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(variable.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
