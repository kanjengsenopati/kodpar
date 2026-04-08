
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw, TrendingUp, Download } from "lucide-react";

interface JurnalHeaderProps {
  onRefresh: () => void;
  onBatchSync: () => void;
}

export function JurnalHeader({ onRefresh, onBatchSync }: JurnalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Jurnal Umum
        </h3>
        <p className="text-muted-foreground">
          Lihat dan kelola semua jurnal
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <Button variant="outline" size="sm" onClick={onBatchSync} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Sinkronisasi
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
