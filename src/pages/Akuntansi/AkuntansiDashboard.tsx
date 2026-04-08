import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, TreePine, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllJurnalEntries } from "@/services/akuntansi/jurnalService";
import { getAllChartOfAccounts } from "@/services/akuntansi/coaService";
import { Button } from "@/components/ui/button";

export default function AkuntansiDashboard() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const journalData = getAllJurnalEntries();
    setJournals(journalData);

    const accountData = getAllChartOfAccounts();
    setAccounts(accountData);
  };

  const menuItems = [
    {
      title: "Jurnal Umum",
      description: "Catat dan kelola jurnal entry harian",
      icon: BookOpen,
      path: "/akuntansi/jurnal-umum",
      color: "bg-blue-500",
      stats: `${journals.length} jurnal`
    },
    {
      title: "Buku Besar",
      description: "Lihat ringkasan akun dan saldo",
      icon: FileText,
      path: "/akuntansi/buku-besar",
      color: "bg-green-500",
      stats: `${accounts.length} akun`
    },
    {
      title: "Chart of Accounts",
      description: "Kelola daftar akun keuangan",
      icon: TreePine,
      path: "/akuntansi/chart-of-accounts",
      color: "bg-purple-500",
      stats: `${accounts.length} akun`
    },
    {
      title: "Laporan Keuangan",
      description: "Generate laporan keuangan lengkap",
      icon: BarChart3,
      path: "/akuntansi/laporan-keuangan",
      color: "bg-orange-500",
      stats: "4 laporan"
    }
  ];

  return (
    <Layout pageTitle="Akuntansi">
      <div className="container mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className={`mt-4 text-sm font-medium ${item.color}`}>
                  {item.stats}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
