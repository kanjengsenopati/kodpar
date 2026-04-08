
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { getLoanDetails } from "@/services/loanDataService";

interface LoanSummaryProps {
  selectedLoan: Transaksi;
  remainingAmount: number;
  simpananBalance: number;
  onBayarAngsuran: (pinjamanId: string) => void;
  selectedPinjaman: string;
  disableSelfPayment?: boolean;
}

export function LoanSummary({
  selectedLoan,
  remainingAmount,
  simpananBalance,
  onBayarAngsuran,
  selectedPinjaman,
  disableSelfPayment = false,
}: LoanSummaryProps) {
  // Get accurate loan details from centralized service
  const loanDetails = getLoanDetails(selectedLoan.id);
  
  if (!loanDetails) {
    return (
      <div className="mt-4 mb-6 bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Data pinjaman tidak valid atau tidak ditemukan</p>
      </div>
    );
  }

  // Get officer name from keterangan if available (format: "Petugas: [NAME]")
  const petugasMatch = selectedLoan.keterangan?.match(/Petugas: ([^.]+)/);
  const petugas = petugasMatch ? petugasMatch[1].trim() : "Tidak tercatat";

  return (
    <div className="mt-4 mb-6 bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Detail Pinjaman</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Pinjaman</p>
          <p className="font-medium">{formatCurrency(loanDetails.jumlahPinjaman)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Tenor</p>
          <p className="font-medium">{loanDetails.tenor} bulan</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Bunga</p>
          <p className="font-medium">{loanDetails.sukuBunga}% per bulan</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Angsuran per Bulan</p>
          <p className="font-medium">{formatCurrency(loanDetails.angsuranPerBulan)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Sisa Pinjaman</p>
          <p className="font-medium">{formatCurrency(loanDetails.sisaPinjaman)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant={loanDetails.status === "Aktif" ? "outline" : "success"}>
            {loanDetails.status}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Simpanan</p>
          <p className="font-medium">{formatCurrency(simpananBalance)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Petugas</p>
          <p className="font-medium">{petugas}</p>
        </div>
      </div>
      
      {!disableSelfPayment && loanDetails.sisaPinjaman > 0 && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => onBayarAngsuran(selectedPinjaman)} size="sm">
            Bayar Angsuran
          </Button>
        </div>
      )}
    </div>
  );
}
