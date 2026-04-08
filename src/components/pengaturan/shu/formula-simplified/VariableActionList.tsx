
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface VariableActionListProps {
  variables: { id: string; label: string; description: string; value: number }[];
  onUseVariable: (variableId: string) => void;
}

export function VariableActionList({ variables, onUseVariable }: VariableActionListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Variabel Formula</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variabel</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Contoh Nilai</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.map((variable) => (
              <TableRow key={variable.id}>
                <TableCell>
                  <code className="bg-muted px-1 py-0.5 rounded">{variable.id}</code>
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  {variable.label}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] p-3">
                        <p className="text-xs">{variable.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(variable.value)}
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onUseVariable(variable.id)}
                    className="w-full flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Gunakan</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
