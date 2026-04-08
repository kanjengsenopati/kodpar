
import { Link } from "react-router-dom";
import { ArrowLeft, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PengajuanHeaderProps {
  id: string;
  onDeleteClick: () => void;
}

export function PengajuanHeader({ id, onDeleteClick }: PengajuanHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Pengajuan #{id}</h1>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="destructive"
          onClick={onDeleteClick}
          className="gap-1"
        >
          <Trash size={16} /> Hapus
        </Button>
      </div>
    </div>
  );
}
