
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById, getRemainingLoanAmount } from "@/services/transaksi";
import { TransaksiReceipt } from "@/components/transaksi/receipt/TransaksiReceipt";
import { useReactToPrint } from "react-to-print";

export default function TransaksiCetak() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      if (transaksiData) {
        setTransaksi(transaksiData);
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Transaksi dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);
  
  // Handle printing - Fixed to return Promise<void>
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${transaksi?.id}`,
    onBeforePrint: () => {
      toast({
        title: "Menyiapkan Cetakan",
        description: "Silakan pilih printer Anda",
      });
      return Promise.resolve();
    },
    onAfterPrint: () => {
      toast({
        title: "Bukti Transaksi Dicetak",
        description: `Bukti transaksi ${transaksi?.id} berhasil dicetak.`,
      });
      return Promise.resolve();
    },
    contentRef: receiptRef,
  });

  // Handle sharing - already returns a Promise
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bukti Transaksi Koperasi",
          text: `Bukti transaksi ${transaksi?.id} di Koperasi Sejahtera`,
        });
      } catch (error) {
        toast({
          title: "Sharing tidak tersedia",
          description: "Fitur share tidak tersedia di perangkat Anda",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing tidak tersedia",
        description: "Fitur share tidak tersedia di perangkat Anda",
        variant: "destructive",
      });
    }
  };
  
  // Calculate remaining amount if it's an angsuran
  const getRemainingAmount = () => {
    if (!transaksi) return undefined;
    
    if (transaksi.jenis === "Angsuran") {
      const pinjamanIdMatch = transaksi.keterangan?.match(/pinjaman #(TR\d+)/);
      if (pinjamanIdMatch && pinjamanIdMatch[1]) {
        return getRemainingLoanAmount(pinjamanIdMatch[1]);
      }
    }
    return undefined;
  };
  
  if (loading) {
    return (
      <Layout pageTitle="Cetak Transaksi">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }
  
  if (!transaksi) {
    return (
      <Layout pageTitle="Cetak Transaksi">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data transaksi tidak ditemukan</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Cetak Bukti Transaksi">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/transaksi/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Cetak Bukti Transaksi</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            Bagikan
          </Button>
          <Button size="sm" onClick={() => {
            // Wrap in Promise to ensure it returns a Promise<void>
            return Promise.resolve(handlePrint());
          }}>
            <Printer size={16} className="mr-2" />
            Cetak
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <TransaksiReceipt 
            ref={receiptRef} 
            transaksi={transaksi} 
            remainingAmount={getRemainingAmount()} 
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
