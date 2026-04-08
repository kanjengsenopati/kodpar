
import { Variable } from "lucide-react";

export function EmptyVariableState() {
  return (
    <div className="text-center py-6 border border-dashed rounded-md bg-muted/30">
      <div className="flex justify-center mb-2">
        <Variable className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Tidak ada variabel kustom</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Tambahkan variabel kustom untuk memperkaya formula SHU
      </p>
    </div>
  );
}
