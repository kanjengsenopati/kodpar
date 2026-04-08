
import { Card, CardContent } from "@/components/ui/card";
import { Variable } from "lucide-react";

interface ReadOnlyVariableCardProps {
  variable: {
    id: string;
    name: string;
    description: string;
    valueType: string;
    value: number;
  };
}
export function ReadOnlyVariableCard({ variable }: ReadOnlyVariableCardProps) {
  return (
    <Card className="bg-muted/10 border-sky-300 border">
      <CardContent className="pt-2 pb-2 pl-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Variable className="h-4 w-4 text-primary" />
          <span className="font-medium">{variable.name}</span>
          <span className="ml-2 text-xs bg-sky-100 px-2 py-0.5 rounded text-sky-700">Distribusi SHU</span>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground items-center">
          <span>
            <span className="font-semibold">{variable.valueType === "persentase" ? `${variable.value}%` : variable.value}</span>
            {variable.valueType === "persentase" ? " dari total SHU" : ""}
          </span>
          <span className="italic">{variable.description}</span>
        </div>
        <p className="text-xs text-muted-foreground opacity-60">ID: {variable.id}</p>
      </CardContent>
    </Card>
  );
}
