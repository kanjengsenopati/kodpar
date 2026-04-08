
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionTabs } from "./TransactionTabs";
import { Transaksi } from "@/types";

interface TransactionSectionProps {
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
  anggotaId: string;
}

export function TransactionSection({
  transaksi,
  simpananTransaksi,
  pinjamanTransaksi,
  angsuranTransaksi,
  jatuhTempo,
  tunggakan,
  anggotaId
}: TransactionSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Histori Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionTabs
          transaksi={transaksi}
          simpananTransaksi={simpananTransaksi}
          pinjamanTransaksi={pinjamanTransaksi}
          angsuranTransaksi={angsuranTransaksi}
          jatuhTempo={jatuhTempo}
          tunggakan={tunggakan}
          anggotaId={anggotaId}
        />
      </CardContent>
    </Card>
  );
}
