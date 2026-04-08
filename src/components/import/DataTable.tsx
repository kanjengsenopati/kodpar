
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

interface DataTableProps {
  data: any[];
  headers: string[];
}

export function DataTable({ data, headers }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Format cell values for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    // Handle numeric values - format currency if likely to be money amounts
    if (typeof value === 'number') {
      // If it's likely to be a currency value (large number)
      if (value >= 1000) {
        return new Intl.NumberFormat('id-ID', { 
          style: 'currency', 
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
      return value.toString();
    }
    
    // Handle date strings
    if (typeof value === 'string' && 
        (value.match(/^\d{4}-\d{2}-\d{2}$/) || 
         value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))) {
      return new Date(value).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Default string handling
    return value.toString();
  };
  
  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-auto scrollbar-none">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="font-medium bg-muted">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center py-6 text-muted-foreground">
                  Tidak ada data yang dapat ditampilkan
                </TableCell>
              </TableRow>
            ) : (
              currentRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/30">
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex} className="py-3">
                      {formatCellValue(row[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="border-t p-3 flex justify-center bg-muted/30">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                let pageNumber: number;
                
                // Logic to show page numbers around current page
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else {
                  if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                }
                
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
