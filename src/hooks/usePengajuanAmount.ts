
import { useState, useEffect } from "react";
import { isValidAmountRange } from "@/utils/formatters";
import { calculateTotalSimpanan } from "@/services/transaksiService";

interface AmountRules {
  minAmount: number;
  maxAmount: number;
  warningThreshold?: number;
  errorMessage?: string;
  warningMessage?: string;
}

interface UsePengajuanAmountProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  anggotaId?: string;
  initialAmount?: number;
}

export interface AmountValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export function usePengajuanAmount({ 
  jenis, 
  anggotaId, 
  initialAmount = 0 
}: UsePengajuanAmountProps) {
  const [validation, setValidation] = useState<AmountValidation>({ isValid: true });
  const [maxBalance, setMaxBalance] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (jenis === "Penarikan" && anggotaId) {
        setLoading(true);
        try {
          const balance = await calculateTotalSimpanan(anggotaId);
          setMaxBalance(balance);
        } catch (error) {
          console.error("Error fetching balance for penarikan:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setMaxBalance(Number.MAX_SAFE_INTEGER);
      }
    }
    fetchBalance();
  }, [jenis, anggotaId]);

  // Define rules for each pengajuan type
  const getAmountRules = (type: "Simpan" | "Pinjam" | "Penarikan"): AmountRules => {
    switch (type) {
      case "Simpan":
        return {
          minAmount: 1000,
          maxAmount: Number.MAX_SAFE_INTEGER,
          warningThreshold: 100000000,
          warningMessage: "Jumlah simpanan sangat besar, pastikan data sudah benar"
        };
      
      case "Pinjam":
        return {
          minAmount: 1000,
          maxAmount: Number.MAX_SAFE_INTEGER,
          warningThreshold: 1000000000,
          warningMessage: "Jumlah pinjaman sangat besar, akan memerlukan persetujuan khusus"
        };
      
      case "Penarikan":
        return {
          minAmount: 1000,
          maxAmount: maxBalance,
          errorMessage: "Jumlah penarikan melebihi saldo tersedia"
        };
      
      default:
        return {
          minAmount: 0,
          maxAmount: Number.MAX_SAFE_INTEGER
        };
    }
  };

  // Get placeholder text based on type
  const getPlaceholder = (): string => {
    switch (jenis) {
      case "Simpan":
        return "500.000.000";
      case "Pinjam":
        return "5.000.000.000";
      case "Penarikan":
        return "1.000.000.000";
      default:
        return "0";
    }
  };

  // Get help text based on type
  const getHelpText = (): string => {
    const rules = getAmountRules(jenis);
    const minFormatted = rules.minAmount.toLocaleString('id-ID');
    
    switch (jenis) {
      case "Simpan":
        return `Minimal simpanan Rp ${minFormatted} (tidak ada batas maksimal)`;
      case "Pinjam":
        return `Minimal pinjaman Rp ${minFormatted} (tidak ada batas maksimal)`;
      case "Penarikan":
        if (anggotaId) {
          const maxFormatted = maxBalance.toLocaleString('id-ID');
          return `Minimal penarikan Rp ${minFormatted}, maksimal Rp ${maxFormatted} (sesuai saldo)`;
        }
        return `Minimal penarikan Rp ${minFormatted}`;
      default:
        return "Masukkan jumlah (tidak ada batas maksimal)";
    }
  };

  return {
    validation,
    placeholder: getPlaceholder(),
    helpText: getHelpText(),
    isValid: validation.isValid,
    error: validation.error,
    warning: validation.warning,
    loading
  };
}
