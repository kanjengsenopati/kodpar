
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  onApplyFilter: () => void;
}

export function DateRangeFilter({
  dateRange,
  setDateRange,
  onApplyFilter,
}: DateRangeFilterProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filter Periode Laporan</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Label htmlFor="dateRange">Rentang Waktu</Label>
            <DateRangePicker 
              value={dateRange}
              onValueChange={setDateRange}
              className="w-full"
            />
          </div>
          <div className="pt-6">
            <Button variant="default" onClick={onApplyFilter}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
