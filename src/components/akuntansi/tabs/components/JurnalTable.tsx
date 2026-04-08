
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { JurnalEntry } from "@/types/akuntansi";

interface JurnalTableProps {
  entries: JurnalEntry[];
  isLoading: boolean;
  onPostJurnal: (id: string) => void;
  onReverseJurnal: (id: string) => void;
  onDeleteJurnal: (id: string) => void;
}

export function JurnalTable({
  entries,
  isLoading,
  onPostJurnal,
  onReverseJurnal,
  onDeleteJurnal
}: JurnalTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Jurnal</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Memuat data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>No. Jurnal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Total Debit</TableHead>
                  <TableHead>Total Kredit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada jurnal yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.tanggal)}</TableCell>
                      <TableCell className="font-mono text-sm">{entry.nomorJurnal}</TableCell>
                      <TableCell>{entry.deskripsi}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(entry.totalDebit)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(entry.totalKredit)}</TableCell>
                      <TableCell>
                        {entry.status === "DRAFT" && <Badge variant="secondary">Draft</Badge>}
                        {entry.status === "POSTED" && <Badge variant="default">Posted</Badge>}
                        {entry.status === "REVERSED" && <Badge variant="destructive">Reversed</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.status === "DRAFT" && (
                          <Button variant="ghost" size="sm" onClick={() => onPostJurnal(entry.id)}>
                            Post
                          </Button>
                        )}
                        {entry.status === "POSTED" && (
                          <Button variant="ghost" size="sm" onClick={() => onReverseJurnal(entry.id)}>
                            Reverse
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => onDeleteJurnal(entry.id)}>
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
