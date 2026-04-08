
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTransaksiById } from '@/services/transaksiService';
import { getAnggotaById } from '@/services/anggotaService';
import { Anggota, Transaksi } from '@/types';
import { TransaksiDetailCard } from '@/components/transaksi/detail/TransaksiDetailCard';
import { PrintButton } from '@/components/transaksi/print/PrintButton';
import { PrintableContent } from '@/components/transaksi/print/PrintableContent';

export default function PenarikanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const transaksiData = getTransaksiById(id);
      
      if (transaksiData && transaksiData.jenis === "Penarikan") {
        setTransaksi(transaksiData);
        
        // Load anggota data
        const anggotaData = getAnggotaById(transaksiData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Penarikan dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/penarikan");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleAfterPrint = () => {
    toast({
      title: "Berhasil Dicetak",
      description: "Detail transaksi penarikan berhasil dicetak",
    });
  };

  if (loading) {
    return (
      <Layout pageTitle="Detail Penarikan">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Detail Penarikan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data penarikan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={`Detail Penarikan - ${transaksi.id}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/transaksi/penarikan">
              <Button variant="outline" size="icon">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detail Penarikan</h1>
          </div>
          
          <div className="flex gap-2">
            <PrintButton 
              contentRef={printRef}
              filename={`penarikan-${transaksi.id}`}
              onAfterPrint={handleAfterPrint}
              variant="outline"
            />
            <Button variant="default" className="gap-2">
              <Share2 className="h-4 w-4" />
              Bagikan
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransaksiDetailCard 
              transaksi={transaksi} 
              anggotaNama={anggota?.nama}
            />
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Dokumen Transaksi</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cetak atau bagikan detail transaksi ini
                  </p>
                </div>
                
                <div className="space-y-2">
                  <PrintButton 
                    contentRef={printRef}
                    filename={`penarikan-${transaksi.id}`}
                    onAfterPrint={handleAfterPrint}
                    variant="outline"
                    className="w-full"
                  />
                  
                  <Button variant="secondary" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Bagikan Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden Printable Content */}
        <div className="hidden">
          <PrintableContent 
            ref={printRef}
            transaksi={transaksi}
            anggotaNama={anggota?.nama}
          />
        </div>
      </div>
    </Layout>
  );
}
