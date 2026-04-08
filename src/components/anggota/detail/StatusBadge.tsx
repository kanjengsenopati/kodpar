
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  count: number;
  type: "dokumen" | "keluarga";
}

export function StatusBadge({ count, type }: StatusBadgeProps) {
  if (count === 0) return null;
  
  const variant = type === "dokumen" ? "success" : "info";
  const label = type === "dokumen" ? "Dokumen" : "Anggota Keluarga";
  
  return (
    <Badge variant={variant}>
      {count} {label}
    </Badge>
  );
}
