
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileBarChart,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart
} from "lucide-react";

const reportSummary = [
  {
    title: "Neraca",
    description: "Posisi keuangan per 31 Desember 2024",
    icon: BarChart3,
    value: "Balanced",
    status: "success"
  },
  {
    title: "Laba Rugi",
    description: "Performance keuangan bulan ini",
    icon: TrendingUp,
    value: "Profit",
    status: "success"
  },
  {
    title: "Arus Kas",
    description: "Pergerakan kas operasional",
    icon: DollarSign,
    value: "Positive",
    status: "success"
  },
  {
    title: "Perubahan Modal",
    description: "Perubahan ekuitas periode berjalan",
    icon: PieChart,
    value: "Growth",
    status: "success"
  }
];

export default function ReportSummarySection() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileBarChart className="h-6 w-6" />
          Ringkasan Laporan Keuangan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportSummary.map((report, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <report.icon className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold">{report.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {report.description}
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  report.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {report.value}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Updated
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate('/akuntansi/laporan')}
            variant="outline"
            size="lg"
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            Lihat Semua Laporan Keuangan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
