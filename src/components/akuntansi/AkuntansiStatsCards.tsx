import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";
import { batchSyncTransactionsToAccounting } from "@/services/akuntansi";

export default function AkuntansiStatsCards() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBatchSync = async () => {
    try {
      setIsLoading(true);
      const result = batchSyncTransactionsToAccounting();
      
      toast({
        title: "Sinkronisasi Berhasil",
        description: `${result.successful} transaksi berhasil disinkronkan, ${result.failed} gagal dari total ${result.totalProcessed} transaksi`,
      });
    } catch (error) {
      toast({
        title: "Sinkronisasi Gagal",
        description: "Terjadi kesalahan saat sinkronisasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Akuntansi Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleBatchSync} disabled={isLoading}>
            {isLoading ? "Loading..." : "Sync"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
