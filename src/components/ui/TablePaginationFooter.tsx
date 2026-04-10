import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Text from "@/components/ui/text";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationFooterProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalRecords: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  className?: string;
  label?: string;
}

export function TablePaginationFooter({
  currentPage,
  totalPages,
  rowsPerPage,
  totalRecords,
  startIndex,
  onPageChange,
  onRowsPerPageChange,
  className,
  label = "anggota"
}: TablePaginationFooterProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30",
      className
    )}>
      <div className="flex items-center gap-4">
        <Text.Caption className="not-italic text-slate-400">
          Menampilkan <span className="font-bold text-slate-600">{Math.min(totalRecords, startIndex + 1)}</span> - <span className="font-bold text-slate-600">{Math.min(totalRecords, startIndex + rowsPerPage)}</span> dari <span className="font-bold text-slate-600">{totalRecords}</span> {label}
        </Text.Caption>
        
        <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
          <Text.Caption className="not-italic text-slate-400 whitespace-nowrap">Baris:</Text.Caption>
          <Select 
            value={rowsPerPage.toString()} 
            onValueChange={(val) => onRowsPerPageChange(parseInt(val))}
          >
            <SelectTrigger className="h-8 w-16 rounded-lg border-slate-100 bg-white text-[11px] font-bold shadow-sm">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-100 bg-white shadow-sm disabled:opacity-30"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </Button>
        
        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                className={cn(
                  "h-8 w-8 rounded-lg font-bold text-xs p-0 transition-all",
                  currentPage === pageNum 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100/50" 
                    : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                )}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-100 bg-white shadow-sm disabled:opacity-30"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
