
import { CodeXml } from "lucide-react";

export function EmptyComponentState() {
  return (
    <div className="text-center py-6 border border-dashed rounded-md bg-muted/30">
      <div className="flex justify-center mb-2">
        <CodeXml className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Tidak ada komponen formula</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Tambahkan komponen formula untuk mempermudah manajemen rumus SHU
      </p>
    </div>
  );
}
