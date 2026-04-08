
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Variable } from "lucide-react";

interface SHUDistributionVariable {
  id: string;
  name: string;
  description: string;
  valueType: "persentase";
  value: number;
}

interface SHUDistributionVariableCardProps {
  variable: SHUDistributionVariable;
  onUpdate: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

export function SHUDistributionVariableCard({
  variable,
  onUpdate,
  onDelete,
}: SHUDistributionVariableCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [valueInput, setValueInput] = useState(variable.value.toString());

  const handleSave = () => {
    const newValue = parseFloat(valueInput) || 0;
    onUpdate(variable.id, newValue);
    setEditMode(false);
  };

  return (
    <Card className="bg-muted/10 border-sky-300 border">
      <CardContent className="pt-2 pb-2 pl-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Variable className="h-4 w-4 text-primary" />
          <span className="font-medium">{variable.name}</span>
          <span className="ml-2 text-xs bg-sky-100 px-2 py-0.5 rounded text-sky-700">
            Distribusi SHU
          </span>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground items-center">
          <span>
            {editMode ? (
              <span className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-16 h-7 text-sm mr-2"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="px-2 py-0 h-7 mr-1"
                  onClick={handleSave}
                >
                  Simpan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="px-2 py-0 h-7"
                  onClick={() => {
                    setValueInput(variable.value.toString());
                    setEditMode(false);
                  }}
                >
                  Batal
                </Button>
              </span>
            ) : (
              <span>
                <span className="font-semibold">{variable.value}%</span>
                {" dari total SHU"}
              </span>
            )}
          </span>
          {!editMode && (
            <>
              <Button size="sm" variant="ghost" className="px-2 h-7" onClick={() => setEditMode(true)} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="px-2 h-7 text-destructive"
                onClick={() => onDelete(variable.id)}
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          <span className="italic">{variable.description}</span>
        </div>
        <p className="text-xs text-muted-foreground opacity-60">ID: {variable.id}</p>
      </CardContent>
    </Card>
  );
}
