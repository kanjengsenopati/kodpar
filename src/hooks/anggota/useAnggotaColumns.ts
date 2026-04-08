
import { useState } from "react";

interface Column {
  id: string;
  label: string;
  isVisible: boolean;
}

export function useAnggotaColumns() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "id", label: "ID Anggota", isVisible: true },
    { id: "nama", label: "Nama", isVisible: true },
    { id: "nip", label: "NIP", isVisible: false },
    { id: "noHp", label: "No HP", isVisible: false },
    { id: "jenisKelamin", label: "Jenis Kelamin", isVisible: false },
    { id: "unitKerja", label: "Unit Kerja", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "totalSimpanan", label: "Total Simpanan", isVisible: true },
    { id: "totalPinjaman", label: "Total Pinjaman", isVisible: true },
    { id: "totalSHU", label: "Total SHU", isVisible: true },
    { id: "petugas", label: "Petugas", isVisible: false },
    { id: "tanggalBergabung", label: "Tanggal Bergabung", isVisible: false },
  ]);

  const handleToggleColumn = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => 
        column.id === columnId 
        ? { ...column, isVisible: !column.isVisible } 
        : column
      )
    );
  };

  return {
    columns,
    handleToggleColumn
  };
}
