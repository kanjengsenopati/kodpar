import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface YearPickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function YearPicker({ 
  value, 
  onValueChange, 
  placeholder = "Pilih tahun",
  className,
  disabled 
}: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState(parseInt(value || currentYear.toString()));
  const [open, setOpen] = useState(false);

  // Generate years around current display year (5 years before and after)
  const generateYearRange = (centerYear: number) => {
    const years = [];
    for (let i = centerYear - 5; i <= centerYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYearRange(displayYear);

  const handleYearSelect = (year: number) => {
    onValueChange?.(year.toString());
    setOpen(false);
  };

  const handlePreviousYears = () => {
    setDisplayYear(prev => prev - 10);
  };

  const handleNextYears = () => {
    setDisplayYear(prev => prev + 10);
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
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousYears}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">
              {displayYear - 5} - {displayYear + 5}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextYears}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={value === year.toString() ? "default" : "ghost"}
                size="sm"
                onClick={() => handleYearSelect(year)}
                className="text-sm"
              >
                {year}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Tahun custom"
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    const customYear = parseInt(target.value);
                    if (customYear >= 1900 && customYear <= 2100) {
                      handleYearSelect(customYear);
                      target.value = '';
                    }
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tekan Enter untuk memilih tahun custom
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}