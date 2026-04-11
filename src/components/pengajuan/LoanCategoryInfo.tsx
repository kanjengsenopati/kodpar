
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Percent, Calendar, FileText } from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";
import { Text } from "@/components/ui/text";
import { formatCurrency } from "@/utils/formatters";

interface LoanCategoryInfoProps {
  kategori: string;
  jumlah?: number;
  tenor?: number;
}

export function LoanCategoryInfo({ kategori, jumlah, tenor }: LoanCategoryInfoProps) {
  const pengaturan = getPengaturan();
  
  if (!kategori) return null;
  
  // Get interest rate for the selected category
  const getInterestRate = (category: string): number => {
    if (pengaturan?.sukuBunga?.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return pengaturan.sukuBunga.pinjamanByCategory[category];
    }
    return pengaturan?.sukuBunga?.pinjaman || 1.5;
  };
  
  // Get category-specific information
  const getCategoryInfo = (category: string) => {
    const baseInfo = {
      interestRate: getInterestRate(category),
      description: "",
      requirements: [] as string[],
      maxAmount: 0,
      minTenor: 0,
      maxTenor: 0
    };
    
    switch (category) {
      case "Reguler":
        return {
          ...baseInfo,
          description: "Pinjaman untuk kebutuhan umum dengan persyaratan standar",
          requirements: [
            "KTP yang masih berlaku",
            "Kartu Keluarga",
            "Slip gaji atau surat keterangan penghasilan",
            "Foto 3x4 terbaru"
          ],
          maxAmount: 50000000,
          minTenor: 6,
          maxTenor: 36
        };
        
      case "Sertifikasi":
        return {
          ...baseInfo,
          description: "Pinjaman khusus untuk pendidikan dan sertifikasi profesi",
          requirements: [
            "KTP yang masih berlaku",
            "Kartu Keluarga",
            "Surat keterangan dari institusi pendidikan",
            "Sertifikat atau dokumen pendukung",
            "Slip gaji atau surat keterangan penghasilan"
          ],
          maxAmount: 25000000,
          minTenor: 3,
          maxTenor: 24
        };
        
      case "Musiman":
        return {
          ...baseInfo,
          description: "Pinjaman untuk kebutuhan musiman seperti hari raya atau panen",
          requirements: [
            "KTP yang masih berlaku",
            "Kartu Keluarga",
            "Surat keterangan usaha (jika ada)",
            "Slip gaji atau surat keterangan penghasilan"
          ],
          maxAmount: 15000000,
          minTenor: 3,
          maxTenor: 12
        };
        
      default:
        return baseInfo;
    }
  };
  
  const categoryInfo = getCategoryInfo(kategori);
  const currentTenor = tenor || pengaturan?.tenor?.defaultTenor || 12;
  
  // Calculate loan preview if amount is provided
  const calculateLoanPreview = () => {
    if (!jumlah || jumlah <= 0) return null;
    
    const monthlyInterest = categoryInfo.interestRate / 100;
    const totalInterest = jumlah * monthlyInterest * currentTenor;
    const totalPayment = jumlah + totalInterest;
    const monthlyPayment = Math.ceil(totalPayment / currentTenor);
    
    return {
      totalInterest,
      totalPayment,
      monthlyPayment
    };
  };
  
  const loanPreview = calculateLoanPreview();
  
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-slate-100 flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Info size={16} className="text-blue-600" />
         </div>
         <Text.H2>Informasi Pinjaman {kategori}</Text.H2>
      </div>

      <div className="space-y-3 px-1">
        {/* Basic Info - STACKED FOR NO OVERFLOW */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <Percent size={14} className="text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <Text.Label className="text-[10px]">Suku Bunga</Text.Label>
              <Text.Body className="font-bold text-blue-700 leading-none">{categoryInfo.interestRate}% per bulan</Text.Body>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <Calendar size={14} className="text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <Text.Label className="text-[10px]">Tenor Tersedia</Text.Label>
              <Text.Body className="font-bold text-slate-700 leading-none">{categoryInfo.minTenor} - {categoryInfo.maxTenor} bulan</Text.Body>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <FileText size={14} className="text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <Text.Label className="text-[10px]">Maksimal Pinjaman</Text.Label>
              <Text.Body className="font-bold text-slate-700 leading-none">{formatCurrency(categoryInfo.maxAmount || 0)}</Text.Body>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
