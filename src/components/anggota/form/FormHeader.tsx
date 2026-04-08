
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/anggota/detail/StatusBadge";

interface FormHeaderProps {
  title: string;
  dokumenCount: number;
  keluargaCount: number;
  isFormDirty: boolean;
}

export function FormHeader({ 
  title, 
  dokumenCount,
  keluargaCount,
  isFormDirty 
}: FormHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link to="/anggota">
        <Button variant="outline" size="icon">
          <ArrowLeft size={16} />
        </Button>
      </Link>
      <h1 className="page-title">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {dokumenCount > 0 && (
          <StatusBadge count={dokumenCount} type="dokumen" />
        )}
        {keluargaCount > 0 && (
          <StatusBadge count={keluargaCount} type="keluarga" />
        )}
        {isFormDirty && (
          <Badge variant="warning">Belum Disimpan</Badge>
        )}
      </div>
    </div>
  );
}
