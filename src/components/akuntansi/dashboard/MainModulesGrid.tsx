
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileBarChart,
  BookOpen,
  Book,
  Receipt
} from "lucide-react";

const mainModules = [
  {
    title: "Chart of Accounts",
    description: "Kelola daftar akun dan chart of accounts",
    icon: Book,
    path: "/akuntansi/chart-of-accounts",
    color: "bg-green-500",
    features: ["Tambah Akun", "Edit Akun", "Kategori", "Hirarki"]
  },
  {
    title: "Jurnal Umum",
    description: "Input dan kelola jurnal entry transaksi",
    icon: Receipt,
    path: "/akuntansi/jurnal-umum",
    color: "bg-purple-500",
    features: ["Input Jurnal", "Post Entry", "Reverse", "Validasi"]
  },
  {
    title: "Buku Besar",
    description: "Lihat buku besar per akun dan periode",
    icon: BookOpen,
    path: "/akuntansi/buku-besar",
    color: "bg-orange-500",
    features: ["Per Akun", "Per Periode", "Saldo", "Detail"]
  },
  {
    title: "Laporan Keuangan",
    description: "Generate dan kelola laporan keuangan lengkap",
    icon: FileBarChart,
    path: "/akuntansi/laporan-keuangan",
    color: "bg-blue-500",
    features: ["Neraca", "Laba Rugi", "Arus Kas", "Perubahan Modal"]
  }
];

export default function MainModulesGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mainModules.map((module, index) => (
        <Card key={index} className="group hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`${module.color} rounded-lg p-4 text-white`}>
                  <module.icon className="h-10 w-10" />
                </div>
                <div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {module.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {module.features.map((feature, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate(module.path)}
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              size="lg"
            >
              Akses {module.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
