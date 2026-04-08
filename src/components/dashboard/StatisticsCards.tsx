
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, CreditCard } from "lucide-react";

interface StatisticsCardsProps {
  totalAnggota: number;
  totalSimpanan: number;
  totalPinjaman: number;
}

export function StatisticsCards({ 
  totalAnggota, 
  totalSimpanan, 
  totalPinjaman 
}: StatisticsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Anggota",
      value: totalAnggota.toString(),
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Simpanan",
      value: formatCurrency(totalSimpanan),
      icon: Wallet,
      gradient: "from-blue-500 to-indigo-600", 
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Pinjaman",
      value: formatCurrency(totalPinjaman),
      icon: CreditCard,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50", 
      borderColor: "border-blue-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`shadow-2xl border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl backdrop-blur-sm`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 truncate">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
