
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, Printer } from "lucide-react";

interface PeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onExport?: () => void;
  onPrint?: () => void;
}

export function PeriodFilter({ selectedPeriod, onPeriodChange, onExport, onPrint }: PeriodFilterProps) {
  const currentYear = new Date().getFullYear();
  const periods = [];
  
  // Generate periods for current and previous year
  for (let year = currentYear; year >= currentYear - 1; year--) {
    for (let month = 12; month >= 1; month--) {
      const monthStr = String(month).padStart(2, '0');
      const periodValue = `${year}-${monthStr}`;
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const periodLabel = `${monthNames[month - 1]} ${year}`;
      periods.push({ value: periodValue, label: periodLabel });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Filter Periode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
