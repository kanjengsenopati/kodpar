
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JenisTable } from "../components/JenisTable";
import { JenisPengajuanDialog } from "../components/dialogs/JenisPengajuanDialog"; 
import { JenisPengajuan } from "@/types/jenis";
import { getJenisByType } from "@/services/jenisService";
import { useToast } from "@/hooks/use-toast";
import { getPengajuanList } from "@/services/pengajuanService";

export function JenisPengajuanTab() {
  const { toast } = useToast();
  const [jenisList, setJenisList] = useState<JenisPengajuan[]>(() => 
    getJenisByType("Pengajuan") as JenisPengajuan[]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisPengajuan | null>(null);
  const [jenisUsage, setJenisUsage] = useState<Record<string, number>>({});

  // Load jenis data and usage statistics
  useEffect(() => {
    loadJenisData();
    calculateJenisUsage();
  }, []);

  const loadJenisData = () => {
    setJenisList(getJenisByType("Pengajuan") as JenisPengajuan[]);
  };

  // Calculate how many pengajuan use each jenis
  const calculateJenisUsage = () => {
    const pengajuanList = getPengajuanList();
    
    const usage: Record<string, number> = {};
    pengajuanList.forEach(pengajuan => {
      if (pengajuan.kategori) {
        usage[pengajuan.kategori] = (usage[pengajuan.kategori] || 0) + 1;
      }
    });
    
    setJenisUsage(usage);
  };

  const handleRefreshData = () => {
    loadJenisData();
    calculateJenisUsage();
  };

  const handleEdit = (jenis: JenisPengajuan) => {
    setSelectedJenis(jenis);
    setIsDialogOpen(true);
  };

  const handleSuccessAction = (action: "create" | "update" | "delete") => {
    handleRefreshData();
    let message = "";
    switch (action) {
      case "create":
        message = "Jenis pengajuan berhasil ditambahkan";
        break;
      case "update":
        message = "Jenis pengajuan berhasil diperbarui";
        break;
      case "delete":
        message = "Jenis pengajuan berhasil dihapus";
        break;
    }
    
    toast({
      title: "Berhasil",
      description: message,
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedJenis(null);
  };

  const columns = [
    { header: "Nama", accessorKey: "nama" },
    { header: "Keterangan", accessorKey: "keterangan" },
    { 
      header: "Persyaratan", 
      accessorKey: "persyaratan",
      cell: (row: any) => {
        const persyaratan = row.getValue() as string[] | undefined;
        if (!persyaratan || persyaratan.length === 0) return "-";
        return persyaratan.join(", ");
      }
    },
    { 
      header: "Status", 
      accessorKey: "isActive",
      cell: (row: any) => row.getValue() ? "Aktif" : "Tidak Aktif"
    },
    {
      header: "Penggunaan",
      accessorKey: "id",
      cell: (row: any) => {
        const jenis = row.row.original;
        const count = jenisUsage[jenis.nama] || 0;
        return `${count} pengajuan`;
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Jenis Pengajuan</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jenis Pengajuan
        </Button>
      </div>

      <JenisPengajuanDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccessAction}
        initialData={selectedJenis}
      />

      <JenisTable
        data={jenisList}
        columns={columns}
        onEdit={(jenis) => handleEdit(jenis as JenisPengajuan)}
        onRefresh={handleRefreshData}
        onSuccess={handleSuccessAction}
      />
    </div>
  );
}
