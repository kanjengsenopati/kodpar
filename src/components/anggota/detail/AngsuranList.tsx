import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  getTransaksiById, 
  calculateTotalSimpanan
} from "@/services/transaksi";

import { 
  getRemainingLoanAmount, 
  generateInstallmentSchedule 
} from "@/services/transaksi/loanOperations";

import { AngsuranListProps } from "./angsuran/types";
import { LoanSelector } from "./angsuran/LoanSelector";
import { LoanSummary } from "./angsuran/LoanSummary";
import { AngsuranTable } from "./angsuran/AngsuranTable";
import { PaymentDialog } from "./angsuran/PaymentDialog";

export interface ExtendedAngsuranListProps extends AngsuranListProps {
  disableSelfPayment?: boolean;
}

export function AngsuranList({ pinjamanTransaksi, disableSelfPayment = false }: ExtendedAngsuranListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPinjaman, setSelectedPinjaman] = useState<string>(
    pinjamanTransaksi.length > 0 ? pinjamanTransaksi[0].id : ""
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentAngsuran, setCurrentAngsuran] = useState<any>(null);
  
  // Structured Data State
  const [loanDetails, setLoanDetails] = useState<{ sisaPinjaman: number } | null>(null);
  const [angsuranDetails, setAngsuranDetails] = useState<any[]>([]);
  const [simpananBalance, setSimpananBalance] = useState(0);

  useEffect(() => {
    async function loadLoanData() {
      if (!selectedPinjaman) return;
      
      const [remaining, schedule, balance] = await Promise.all([
        getRemainingLoanAmount(selectedPinjaman),
        generateInstallmentSchedule(selectedPinjaman),
        calculateTotalSimpanan(pinjamanTransaksi[0].anggotaId)
      ]);
      
      setLoanDetails({ sisaPinjaman: remaining });
      setAngsuranDetails(schedule);
      setSimpananBalance(balance);
    }
    
    loadLoanData();
  }, [selectedPinjaman]);

  const handleBayarAngsuran = (pinjamanId: string) => {
    navigate("/transaksi/angsuran/tambah", { state: { pinjamanId } });
  };

  const handlePayWithSimpanan = (angsuran: any) => {
    setCurrentAngsuran(angsuran);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    // Force reload
    setSelectedPinjaman(selectedPinjaman);
  };

  if (pinjamanTransaksi.length === 0) {
    return (
      <Card className="mt-6 rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardHeader>
          <CardTitle>Riwayat Angsuran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Anggota ini tidak memiliki pinjaman aktif.</p>
        </CardContent>
      </Card>
    );
  }

  const selectedLoan = getTransaksiById(selectedPinjaman);

  return (
    <Card className="mt-6 rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-xl font-bold text-slate-900">Riwayat Angsuran</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <LoanSelector 
          pinjamanTransaksi={pinjamanTransaksi}
          selectedPinjaman={selectedPinjaman}
          onLoanSelect={setSelectedPinjaman}
        />

        {selectedLoan && loanDetails && (
          <LoanSummary 
            selectedLoan={selectedLoan}
            remainingAmount={loanDetails.sisaPinjaman}
            simpananBalance={simpananBalance}
            onBayarAngsuran={handleBayarAngsuran}
            selectedPinjaman={selectedPinjaman}
            disableSelfPayment={disableSelfPayment}
          />
        )}

        <AngsuranTable 
          angsuranDetails={angsuranDetails}
          selectedPinjaman={selectedPinjaman}
          onBayarAngsuran={handleBayarAngsuran}
          onPayWithSimpanan={handlePayWithSimpanan}
          simpananBalance={simpananBalance}
          disableSelfPayment={disableSelfPayment}
        />
        
        {!disableSelfPayment && (
          <PaymentDialog
            isOpen={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            currentAngsuran={currentAngsuran}
            selectedPinjaman={selectedPinjaman}
            simpananBalance={simpananBalance}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
