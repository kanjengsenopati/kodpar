
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate } from "./utils";

interface LoanSelectorProps {
  pinjamanTransaksi: any[];
  selectedPinjaman: string;
  onLoanSelect: (loanId: string) => void;
}

export function LoanSelector({ 
  pinjamanTransaksi, 
  selectedPinjaman, 
  onLoanSelect 
}: LoanSelectorProps) {
  if (pinjamanTransaksi.length <= 1) return null;
  
  return (
    <Tabs 
      value={selectedPinjaman} 
      onValueChange={onLoanSelect} 
      className="mb-4"
    >
      <TabsList>
        {pinjamanTransaksi.map((pinjaman) => (
          <TabsTrigger key={pinjaman.id} value={pinjaman.id}>
            {pinjaman.id} ({formatDate(pinjaman.tanggal)})
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
