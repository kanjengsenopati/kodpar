import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, FileText, Printer, Receipt } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById } from "@/services/transaksiService";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Transaksi } from "@/types";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ReceiptDialog } from "@/components/transaksi/receipt/ReceiptDialog";
import { LoanReceiptDialog } from "@/components/transaksi/receipt/LoanReceiptDialog";

export default function PinjamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isLoanReceiptOpen, setIsLoanReceiptOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      if (transaksiData && transaksiData.jenis === "Pinjam") {
        setTransaksi(transaksiData);
        
        const anggotaData = getAnggotaById(transaksiData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Pinjaman dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/pinjam");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handlePrintReceipt = () => {
    navigate(`/transaksi/${id}/cetak`);
  };
  
  const handleShowReceipt = () => {
    setIsReceiptOpen(true);
  };

  if (loading) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Pinjaman">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pinjaman tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Pinjaman">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/pinjam">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Detail Pinjaman</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsReceiptOpen(true)}>
            <FileText size={16} className="mr-2" />
            Bukti Transaksi
          </Button>
          <Button size="sm" onClick={() => setIsLoanReceiptOpen(true)}>
            <Receipt size={16} className="mr-2" />
            Tanda Terima Pinjaman
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Transaksi Pinjaman #{transaksi.id}</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaksi.status}
                </span>
              </CardTitle>
              <CardDescription>
                Tanggal Transaksi: {formatDate(transaksi.tanggal)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informasi Pinjaman</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Transaksi</p>
                    <p className="font-medium">
                      <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Pinjaman
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(transaksi.jumlah)}
                    </p>
                  </div>
                  {transaksi.kategori && (
                    <div>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <p className="font-medium">{transaksi.kategori}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {anggota && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informasi Anggota</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Anggota</p>
                      <p className="font-medium">{anggota.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Anggota</p>
                      <p className="font-medium">{anggota.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No. Telepon</p>
                      <p className="font-medium">{anggota.noHp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">{anggota.alamat}</p>
                    </div>
                  </div>
                </div>
              )}

              {transaksi.keterangan && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
                    <p className="text-gray-700">{transaksi.keterangan}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>
                Detail transaksi pinjaman
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID Transaksi</p>
                  <p className="font-medium">{transaksi.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(transaksi.createdAt)}</p>
                </div>
                {transaksi.createdAt !== transaksi.updatedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Terakhir Diubah</p>
                    <p className="font-medium">{formatDate(transaksi.updatedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {transaksi && (
        <>
          <ReceiptDialog 
            open={isReceiptOpen} 
            onOpenChange={setIsReceiptOpen} 
            transaksi={transaksi} 
          />
          <LoanReceiptDialog
            open={isLoanReceiptOpen}
            onOpenChange={setIsLoanReceiptOpen}
            transaksi={transaksi}
          />
        </>
      )}
    </Layout>
  );
}
