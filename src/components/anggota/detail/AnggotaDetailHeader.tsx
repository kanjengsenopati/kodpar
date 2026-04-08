
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { DetailPageHeader } from "@/components/pos/detail/DetailPageHeader";

interface AnggotaDetailHeaderProps {
  nama: string;
  keluargaCount: number;
  dokumenCount: number;
  anggotaId: string;
}

export function AnggotaDetailHeader({ 
  nama, 
  keluargaCount, 
  dokumenCount, 
  anggotaId 
}: AnggotaDetailHeaderProps) {
  return (
    <>
      <DetailPageHeader title="Detail Anggota" backLink="/anggota" />
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">{nama}</h1>
        {keluargaCount > 0 && (
          <Badge variant="info" className="ml-2">
            {keluargaCount} Anggota Keluarga
          </Badge>
        )}
        {dokumenCount > 0 && (
          <Badge variant="success" className="ml-2">
            {dokumenCount} Dokumen
          </Badge>
        )}
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link to={`/anggota/edit/${anggotaId}`}>
              <Edit size={16} className="mr-1.5" /> Edit
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
