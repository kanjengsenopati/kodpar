
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JenisTable } from "../components/JenisTable";
import { JenisPinjamanDialog } from "../components/dialogs/JenisPinjamanDialog";
import { JenisPinjaman } from "@/types/jenis";
import { getJenisByType } from "@/services/jenisService";
import { useToast } from "@/hooks/use-toast";
import { getAllTransaksi } from "@/services/transaksiService";

export function JenisPinjamanTab() {
  const { toast } = useToast();
  const [jenisList, setJenisList] = useState<JenisPinjaman[]>(() => 
    getJenisByType("Pinjaman") as JenisPinjaman[]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisPinjaman | null>(null);
  const [jenisUsage, setJenisUsage] = useState<Record<string, number>>({});

  // Load jenis data and usage statistics
  useEffect(() => {
    loadJenisData();
    calculateJenisUsage();
  }, []);

  const loadJenisData = () => {
    setJenisList(getJenisByType("Pinjaman") as JenisPinjaman[]);
  };

  // Calculate how many transactions use each jenis
  const calculateJenisUsage = () => {
    const transaksiList = getAllTransaksi();
    const pinjamanTransaksi = transaksiList.filter(t => t.jenis === "Pinjam");
    
    const usage: Record<string, number> = {};
    pinjamanTransaksi.forEach(transaksi => {
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

  const handleEdit = (jenis: JenisPinjaman) => {
    setSelectedJenis(jenis);
    setIsDialogOpen(true);
  };

  const handleSuccessAction = (action: "create" | "update" | "delete") => {
    handleRefreshData();
    let message = "";
    switch (action) {
      case "create":
        message = "Jenis pinjaman berhasil ditambahkan";
        break;
      case "update":
        message = "Jenis pinjaman berhasil diperbarui";
        break;
      case "delete":
        message = "Jenis pinjaman berhasil dihapus";
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
      cell: (row: any) => `${row.getValue()}%`
    },
    { 
      header: "Tenor (bulan)",
      accessorKey: "tenorRange",
      cell: (row: any) => {
        const data = row.row.original;
        return data.tenorMin && data.tenorMax 
          ? `${data.tenorMin} - ${data.tenorMax} bulan` 
          : "Tidak ditentukan";
      }
    },
    { 
      header: "Maks. Pinjaman",
      accessorKey: "maksimalPinjaman",
      cell: (row: any) => {
        const nilai = row.getValue() as number | undefined;
        return nilai 
          ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(nilai)
          : "Tidak dibatasi";
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
        return `${count} transaksi`;
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Jenis Pinjaman</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jenis Pinjaman
        </Button>
      </div>

      <JenisPinjamanDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccessAction}
        initialData={selectedJenis}
      />

      <JenisTable
        data={jenisList}
        columns={columns}
        onEdit={(jenis) => handleEdit(jenis as JenisPinjaman)}
        onRefresh={handleRefreshData}
        onSuccess={handleSuccessAction}
      />
    </div>
  );
}
