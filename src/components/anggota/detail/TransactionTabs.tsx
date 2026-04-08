
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaksi, AnggotaKeluarga } from "@/types";
import { TransactionTable } from "./TransactionTable";
import { SimpananTransactionTable } from "./SimpananTransactionTable";
import { JatuhTempoTable } from "./JatuhTempoTable";
import { TunggakanTable } from "./TunggakanTable";

interface TransactionTabsProps {
  transaksi: Transaksi[];
  simpananTransaksi: Transaksi[];
  pinjamanTransaksi: Transaksi[];
  angsuranTransaksi: Transaksi[];
  jatuhTempo: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysUntilDue: number;
  }[];
  tunggakan: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[];
  keluarga?: AnggotaKeluarga[];
  anggotaId?: string;
}

export function TransactionTabs({
  transaksi,
  simpananTransaksi,
  pinjamanTransaksi,
  angsuranTransaksi,
  jatuhTempo,
  tunggakan,
}: TransactionTabsProps) {
  // Combine simpanan and penarikan transactions for the enhanced view
  const allSimpananTransaksi = transaksi.filter(t => t.jenis === "Simpan" || t.jenis === "Penarikan");

  return (
    <Tabs defaultValue="semua">
      <TabsList className="mb-4">
        <TabsTrigger value="semua">Semua</TabsTrigger>
        <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
        <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
        <TabsTrigger value="angsuran">Angsuran</TabsTrigger>
        <TabsTrigger value="jatuhTempo">Jatuh Tempo</TabsTrigger>
        <TabsTrigger value="tunggakan">Tunggakan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="semua">
        <TransactionTable transaksi={transaksi} />
      </TabsContent>
      <TabsContent value="simpanan">
        <SimpananTransactionTable transaksi={allSimpananTransaksi} />
      </TabsContent>
      <TabsContent value="pinjaman">
        <TransactionTable transaksi={pinjamanTransaksi} />
      </TabsContent>
      <TabsContent value="angsuran">
        <TransactionTable transaksi={angsuranTransaksi} />
      </TabsContent>
      <TabsContent value="jatuhTempo">
        <JatuhTempoTable jatuhTempo={jatuhTempo} />
      </TabsContent>
      <TabsContent value="tunggakan">
        <TunggakanTable tunggakan={tunggakan} />
      </TabsContent>
    </Tabs>
  );
}
