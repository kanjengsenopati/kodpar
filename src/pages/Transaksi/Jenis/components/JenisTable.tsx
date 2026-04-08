
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "./dialogs/ConfirmDeleteDialog";
import { Jenis } from "@/types/jenis";
import { deleteJenis } from "@/services/jenisService";
import { ActionGrid } from "@/components/ui/action-grid";

interface Column {
  header: string;
  accessorKey: string;
  cell?: (row: any) => React.ReactNode;
}

interface JenisTableProps {
  data: Jenis[];
  columns: Column[];
  onEdit: (jenis: Jenis) => void;
  onRefresh: () => void;
  onSuccess: (action: "create" | "update" | "delete") => void;
}

export function JenisTable({
  data,
  columns,
  onEdit,
  onRefresh,
  onSuccess,
}: JenisTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Jenis | null>(null);

  const handleDeleteClick = (jenis: Jenis) => {
    setItemToDelete(jenis);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteJenis(itemToDelete.id);
      onSuccess("delete");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
              <TableHead className="w-28 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell({ getValue: () => (item as any)[column.accessorKey], row: { original: item } })
                        : (item as any)[column.accessorKey] || "-"}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Badge
                        variant={item.isActive ? "default" : "outline"}
                        className="font-normal text-xs"
                      >
                        {item.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                      <ActionGrid
                        onEdit={() => onEdit(item)}
                        onDelete={() => handleDeleteClick(item)}
                        layout="grid"
                        compact={true}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
      />
    </div>
  );
}
