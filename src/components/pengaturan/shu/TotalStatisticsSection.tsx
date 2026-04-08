
import React from "react";
import { TotalStatisticsCard } from "./TotalStatisticsCard";
import { Coins, Wallet, WalletCards, WalletMinimal } from "lucide-react";

export function TotalStatisticsSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Total Simpanan Koperasi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalStatisticsCard 
          title="Simpanan Wajib"
          type="simpanan_wajib"
          icon={<Wallet className="h-4 w-4" />}
        />
        <TotalStatisticsCard 
          title="Simpanan Pokok"
          type="simpanan_pokok"
          icon={<WalletMinimal className="h-4 w-4" />}
        />
        <TotalStatisticsCard 
          title="Simpanan Khusus"
          type="simpanan_khusus" 
          icon={<WalletCards className="h-4 w-4" />}
        />
        <TotalStatisticsCard 
          title="Total Simpanan"
          type="all"
          icon={<Coins className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
