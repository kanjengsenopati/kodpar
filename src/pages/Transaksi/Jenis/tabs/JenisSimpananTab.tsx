
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JenisTable } from "../components/JenisTable";
import { JenisSimpananDialog } from "../components/dialogs/JenisSimpananDialog";
import { JenisSimpanan } from "@/types/jenis";
import { getJenisByType } from "@/services/jenisService";
import { useToast } from "@/hooks/use-toast";
import { getAllTransaksi } from "@/services/transaksiService";

export function JenisSimpananTab() {
  const { toast } = useToast();
  const [jenisList, setJenisList] = useState<JenisSimpanan[]>(() => 
    getJenisByType("Simpanan") as JenisSimpanan[]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisSimpanan | null>(null);
  const [jenisUsage, setJenisUsage] = useState<Record<string, number>>({});

  // Load jenis data and usage statistics
  useEffect(() => {
    loadJenisData();
    calculateJenisUsage();
  }, []);

  const loadJenisData = () => {
    setJenisList(getJenisByType("Simpanan") as JenisSimpanan[]);
  };

  // Calculate how many transactions use each jenis
  const calculateJenisUsage = () => {
    const transaksiList = getAllTransaksi();
    const simpananTransaksi = transaksiList.filter(t => t.jenis === "Simpan");
    
    const usage: Record<string, number> = {};
    simpananTransaksi.forEach(transaksi => {
      if (transaksi.kategori) {
        usage[transaksi.kategori] = (usage[transaksi.kategori] || 0) + 1;
      }
    });
    
    setJenisUsage(usage);
  };

  const handleRefreshData = () => {
    loadJenisData();
    calculateJenisUsage();
  };

  const handleEdit = (jenis: JenisSimpanan) => {
    setSelectedJenis(jenis);
    setIsDialogOpen(true);
  };

  const handleSuccessAction = (action: "create" | "update" | "delete") => {
    handleRefreshData();
    let message = "";
    switch (action) {
      case "create":
        message = "Jenis simpanan berhasil ditambahkan";
        break;
      case "update":
        message = "Jenis simpanan berhasil diperbarui";
        break;
      case "delete":
        message = "Jenis simpanan berhasil dihapus";
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
      header: "Bunga (%)",
      accessorKey: "bungaPersen",
      cell: (row: any) => {
        const bunga = row.getValue() as number | undefined;
        return bunga !== undefined ? `${bunga}%` : "0%";
      }
    },
    { 
      header: "Wajib", 
      accessorKey: "wajib",
      cell: (row: any) => row.getValue() ? "Ya" : "Tidak"
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
        return `${count} transaksi`;
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Jenis Simpanan</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jenis Simpanan
        </Button>
      </div>

      <JenisSimpananDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccessAction}
        initialData={selectedJenis}
      />

      <JenisTable
        data={jenisList}
        columns={columns}
        onEdit={(jenis) => handleEdit(jenis as JenisSimpanan)}
        onRefresh={handleRefreshData}
        onSuccess={handleSuccessAction}
      />
    </div>
  );
}
