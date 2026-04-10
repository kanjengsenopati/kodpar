
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface NestedColumn {
  header: string;
  accessor: string;
  className?: string;
  render?: (val: any) => React.ReactNode;
}

interface NestedDetailTableProps {
  title: string;
  columns: NestedColumn[];
  data: any[];
  emptyMessage?: string;
}

export function NestedDetailTable({ title, columns, data, emptyMessage = "Tidak ada rincian data" }: NestedDetailTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Text.H2 className="text-[13px] text-slate-700">{title}</Text.H2>
        <Text.Caption className="not-italic text-slate-400 font-bold">{data.length} Item</Text.Caption>
      </div>
      
      <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm shadow-slate-100/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              {columns.map((col, idx) => (
                <TableHead key={idx} className={cn("h-9", col.className)}>
                  <Text.Label className="text-[10px] text-slate-400">{col.header}</Text.Label>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <Text.Caption className="text-slate-300 italic">{emptyMessage}</Text.Caption>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIdx) => (
                <TableRow key={rowIdx} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className={cn("py-2.5", col.className)}>
                      {col.render ? (
                        col.render(row[col.accessor])
                      ) : (
                        <Text.Body className="text-xs text-slate-600">{row[col.accessor] || "-"}</Text.Body>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
