
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, Download, Printer } from 'lucide-react';

interface LaporanFiltersProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onFilterApply: () => void;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
  onPrint: () => void;
}

export default function LaporanFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilterApply,
  onPeriodChange,
  onExport,
  onPrint,
}: LaporanFiltersProps) {
  // Function to set predefined period filters
  const setPeriod = (period: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (period) {
      case 'today':
        // Today
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'current-week':
        // Current week (Sunday - Saturday)
        const day = today.getDay(); // 0 is Sunday, 6 is Saturday
        start = new Date(today);
        start.setDate(today.getDate() - day); // Go to beginning of week (Sunday)
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Go to end of week (Saturday)
        break;
      case 'current-month':
        // Current month
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last-month':
        // Last month
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last-3-months':
        // Last 3 months
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'current-year':
        // Current year
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        // Default to current month
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    
    onStartDateChange(start);
    onEndDateChange(end);
    onPeriodChange(period);
    onFilterApply();
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
      {/* Date Range Picker */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, "PPP", { locale: id })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onStartDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span>s/d</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(endDate, "PPP", { locale: id })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && onEndDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={onFilterApply}>Filter</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" onClick={() => setPeriod('today')}>Hari Ini</Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod('current-month')}>Bulan Ini</Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod('last-month')}>Bulan Lalu</Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod('current-year')}>Tahun Ini</Button>
        </div>
      </div>
      
      {/* Export and Print Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
}
