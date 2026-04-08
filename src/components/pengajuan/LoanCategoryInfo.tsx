
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Percent, Calendar, FileText } from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";

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
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info size={20} className="text-blue-600" />
          Informasi Pinjaman {kategori}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Percent size={16} className="text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Suku Bunga</p>
              <p className="font-semibold text-blue-700">{categoryInfo.interestRate}% per bulan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Tenor</p>
              <p className="font-semibold">{categoryInfo.minTenor} - {categoryInfo.maxTenor} bulan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Maksimal Pinjaman</p>
              <p className="font-semibold">Rp {categoryInfo.maxAmount.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Deskripsi:</p>
          <p className="text-sm">{categoryInfo.description}</p>
        </div>
        
        {/* Requirements */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Persyaratan Dokumen:</p>
          <div className="flex flex-wrap gap-1">
            {categoryInfo.requirements.map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Loan Preview */}
        {loanPreview && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">Simulasi Perhitungan:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-muted-foreground">Angsuran per Bulan</p>
                <p className="font-semibold text-lg">Rp {loanPreview.monthlyPayment.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-muted-foreground">Total Bunga</p>
                <p className="font-semibold text-lg">Rp {loanPreview.totalInterest.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-muted-foreground">Total Pembayaran</p>
                <p className="font-semibold text-lg">Rp {loanPreview.totalPayment.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
