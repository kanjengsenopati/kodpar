
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target,
  FileBarChart,
  TrendingUp,
  DollarSign
} from "lucide-react";

const recentActivities = [
  {
    title: "Laporan Neraca Desember 2024 di-generate",
    time: "1 jam yang lalu",
    icon: FileBarChart,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    status: "Balanced"
  },
  {
    title: "Laporan Laba Rugi Desember 2024 telah selesai",
    time: "2 jam yang lalu",
    icon: TrendingUp,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    status: "+15.3%"
  },
  {
    title: "Laporan Arus Kas periode berjalan",
    time: "3 jam yang lalu",
    icon: DollarSign,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    status: "Positive Flow"
  }
];

export default function RecentActivitySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`${activity.bgColor} p-2 rounded-full`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
