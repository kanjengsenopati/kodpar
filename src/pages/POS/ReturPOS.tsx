
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, RotateCcw, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatRupiah, formatDate } from "@/lib/utils";

interface ItemRetur {
  produkId: string;
  namaProduk: string;
  jumlah: number;
  hargaSatuan: number;
  alasan: string;
}

interface Retur {
  id: string;
  nomorRetur: string;
  tanggal: string;
  pelanggan: string;
  nomorTransaksiAsli: string;
  items: ItemRetur[];
  totalRetur: number;
  status: "pending" | "disetujui" | "ditolak";
  alasanRetur: string;
  createdAt: string;
}

const sampleRetur: Retur[] = [
  {
    id: "1",
    nomorRetur: "RTR-001",
    tanggal: "2024-12-12",
    pelanggan: "Ahmad Subagio",
    nomorTransaksiAsli: "TXN-001",
    items: [
      {
        produkId: "1",
        namaProduk: "Indomie Goreng",
        jumlah: 2,
        hargaSatuan: 3500,
        alasan: "Kemasan rusak"
      }
    ],
    totalRetur: 7000,
    status: "pending",
    alasanRetur: "Kemasan produk rusak saat diterima",
    createdAt: "2024-12-12T10:30:00"
  },
  {
    id: "2",
    nomorRetur: "RTR-002", 
    tanggal: "2024-12-11",
    pelanggan: "Siti Nurhaliza",
    nomorTransaksiAsli: "TXN-005",
    items: [
      {
        produkId: "2",
        namaProduk: "Teh Botol Sosro",
        jumlah: 1,
        hargaSatuan: 4000,
        alasan: "Kadaluarsa"
      }
    ],
    totalRetur: 4000,
    status: "disetujui",
    alasanRetur: "Produk sudah kadaluarsa",
    createdAt: "2024-12-11T14:20:00"
  }
];

export default function ReturPOS() {
  const { toast } = useToast();
  const [returList, setReturList] = useState<Retur[]>(sampleRetur);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRetur, setSelectedRetur] = useState<Retur | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredRetur = returList.filter(retur => {
    const matchesSearch = searchQuery ? (
      retur.nomorRetur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retur.pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retur.nomorTransaksiAsli.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;
    
    const matchesStatus = statusFilter === "all" || retur.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (returId: string, newStatus: "disetujui" | "ditolak") => {
    setReturList(prev => prev.map(retur => 
      retur.id === returId ? { ...retur, status: newStatus } : retur
    ));
    
    toast({
      title: "Status Diperbarui",
      description: `Retur ${newStatus === "disetujui" ? "disetujui" : "ditolak"} berhasil`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "disetujui": return "bg-green-100 text-green-800";
      case "ditolak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Menunggu";
      case "disetujui": return "Disetujui";
      case "ditolak": return "Ditolak";
      default: return status;
    }
  };

  return (
    <Layout pageTitle="Retur POS">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Retur Penjualan</h1>
            <p className="text-muted-foreground">Kelola retur dan pengembalian produk</p>
          </div>
          
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Retur
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari nomor retur, pelanggan, atau transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Retur List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRetur.map((retur) => (
            <Card key={retur.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{retur.nomorRetur}</CardTitle>
                    <CardDescription>
                      Transaksi: {retur.nomorTransaksiAsli} • {retur.pelanggan}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(retur.status)}>
                    {getStatusText(retur.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Tanggal Retur</div>
                    <div className="font-medium">{formatDate(retur.tanggal)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Retur</div>
                    <div className="font-medium text-lg">{formatRupiah(retur.totalRetur)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Jumlah Item</div>
                    <div className="font-medium">{retur.items.length} item</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRetur(retur);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                    {retur.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(retur.id, "disetujui")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Setujui
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusUpdate(retur.id, "ditolak")}
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRetur.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {searchQuery || statusFilter !== "all" ? "Retur tidak ditemukan" : "Belum ada retur"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" ? "Coba ubah filter pencarian" : "Retur akan muncul di sini"}
            </p>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Retur {selectedRetur?.nomorRetur}</DialogTitle>
            </DialogHeader>
            {selectedRetur && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nomor Transaksi Asli</Label>
                    <div className="font-medium">{selectedRetur.nomorTransaksiAsli}</div>
                  </div>
                  <div>
                    <Label>Pelanggan</Label>
                    <div className="font-medium">{selectedRetur.pelanggan}</div>
                  </div>
                  <div>
                    <Label>Tanggal Retur</Label>
                    <div className="font-medium">{formatDate(selectedRetur.tanggal)}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedRetur.status)}>
                      {getStatusText(selectedRetur.status)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label>Alasan Retur</Label>
                  <div className="text-sm bg-muted p-3 rounded">{selectedRetur.alasanRetur}</div>
                </div>

                <div>
                  <Label>Item yang Diretur</Label>
                  <div className="space-y-2 mt-2">
                    {selectedRetur.items.map((item, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.namaProduk}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.jumlah} x {formatRupiah(item.hargaSatuan)}
                            </div>
                            <div className="text-sm text-red-600">Alasan: {item.alasan}</div>
                          </div>
                          <div className="font-medium">
                            {formatRupiah(item.jumlah * item.hargaSatuan)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Retur:</span>
                    <span className="text-lg font-bold">{formatRupiah(selectedRetur.totalRetur)}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Retur Dialog - Placeholder */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Retur Baru</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8 text-muted-foreground">
              <RotateCcw className="h-12 w-12 mx-auto mb-4" />
              <p>Form retur akan diimplementasikan sesuai kebutuhan spesifik</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
