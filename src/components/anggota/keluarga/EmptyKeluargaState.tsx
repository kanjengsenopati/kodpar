
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface EmptyKeluargaStateProps {
  onAddClick: () => void;
}

export function EmptyKeluargaState({ onAddClick }: EmptyKeluargaStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <User className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-1">Belum Ada Data Keluarga</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Klik tombol "Tambah Anggota Keluarga" untuk menambahkan data
      </p>
      <Button onClick={onAddClick}>
        <User size={16} className="mr-1" /> Tambah Anggota Keluarga
      </Button>
    </div>
  );
}
