
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
  value?: string; // Format: "YYYY-MM"
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MonthYearPicker({ 
  value, 
  onValueChange, 
  placeholder = "Pilih bulan dan tahun",
  className,
  disabled 
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  
  // Parse current value or default to current date
  const parseValue = (val?: string) => {
    if (val && val.includes('-')) {
      const [year, month] = val.split('-');
      return { year: parseInt(year), month: parseInt(month) };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  };

  const { year: currentYear, month: currentMonth } = parseValue(value);
  const [displayYear, setDisplayYear] = useState(currentYear);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleMonthSelect = (month: number) => {
    const formattedValue = `${displayYear}-${month.toString().padStart(2, '0')}`;
    onValueChange?.(formattedValue);
    setOpen(false);
  };

  const formatDisplayValue = (val?: string) => {
    if (!val) return placeholder;
    const { year, month } = parseValue(val);
    return `${months[month - 1]} ${year}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDisplayValue(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayYear(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg">{displayYear}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayYear(prev => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {months.map((monthName, index) => {
              const monthNumber = index + 1;
              const isSelected = displayYear === currentYear && monthNumber === currentMonth;
              
              return (
                <Button
                  key={monthName}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleMonthSelect(monthNumber)}
                  className="text-sm h-8"
                >
                  {monthName}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
