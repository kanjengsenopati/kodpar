
import React from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, DollarSign, PieChart } from "lucide-react";

export default function LaporanPage() {
  const laporanItems = [
    {
      title: "Laporan Keuangan",
      description: "Laporan keuangan lengkap koperasi",
      icon: FileText,
      href: "/keuangan/laporan",
      color: "text-blue-600"
    },
    {
      title: "Arus Kas",
      description: "Laporan arus kas masuk dan keluar",
      icon: TrendingUp,
      href: "/keuangan/arus-kas",
      color: "text-green-600"
    },
    {
      title: "Profit & Loss",
      description: "Laporan laba rugi periode",
      icon: DollarSign,
      href: "/keuangan/profit-loss",
      color: "text-purple-600"
    },
    {
      title: "Analisis Keuangan",
      description: "Analisis dan rasio keuangan",
      icon: PieChart,
      href: "/keuangan/analisis",
      color: "text-orange-600"
    }
  ];

  return (
    <Layout pageTitle="Keuangan">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {laporanItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
