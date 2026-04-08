
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  getTransaksiById, 
  calculateTotalSimpanan
} from "@/services/transaksi";

import { 
  getLoanDetails, 
  generateInstallmentSchedule 
} from "@/services/loanDataService";

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

  const handleBayarAngsuran = (pinjamanId: string) => {
    navigate("/transaksi/angsuran/tambah", { state: { pinjamanId } });
  };

  const handlePayWithSimpanan = (angsuran: any) => {
    setCurrentAngsuran(angsuran);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    // Re-render component with the latest data
    setSelectedPinjaman(selectedPinjaman); // This will force a re-render
  };

  if (pinjamanTransaksi.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Angsuran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Anggota ini tidak memiliki pinjaman aktif.</p>
        </CardContent>
      </Card>
    );
  }

  // Use centralized loan service for accurate data
  const loanDetails = selectedPinjaman ? getLoanDetails(selectedPinjaman) : null;
  const angsuranDetails = selectedPinjaman ? generateInstallmentSchedule(selectedPinjaman) : [];
  
  const selectedLoan = getTransaksiById(selectedPinjaman);
  const remainingAmount = loanDetails ? loanDetails.sisaPinjaman : 0;
  
  // Calculate simpanan balance for payment option
  const simpananBalance = selectedLoan ? calculateTotalSimpanan(selectedLoan.anggotaId) : 0;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Riwayat Angsuran</CardTitle>
      </CardHeader>
      <CardContent>
        <LoanSelector 
          pinjamanTransaksi={pinjamanTransaksi}
          selectedPinjaman={selectedPinjaman}
          onLoanSelect={setSelectedPinjaman}
        />

        {selectedLoan && loanDetails && (
          <LoanSummary 
            selectedLoan={selectedLoan}
            remainingAmount={remainingAmount}
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
