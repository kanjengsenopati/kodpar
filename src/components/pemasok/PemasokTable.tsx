
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pemasok } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ActionGrid } from "@/components/ui/action-grid";

interface PemasokTableProps {
  pemasokList: Pemasok[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PemasokTable({ pemasokList, onEdit, onDelete }: PemasokTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPemasokId, setSelectedPemasokId] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setSelectedPemasokId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedPemasokId) {
      onDelete(selectedPemasokId);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pemasok</TableHead>
            <TableHead>Kontak Person</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead className="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pemasokList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Tidak ada data pemasok
              </TableCell>
            </TableRow>
          ) : (
            pemasokList.map((pemasok) => (
              <TableRow key={pemasok.id}>
                <TableCell className="font-medium">{pemasok.nama}</TableCell>
                <TableCell>{pemasok.kontak}</TableCell>
                <TableCell>{pemasok.telepon}</TableCell>
                <TableCell>{pemasok.email}</TableCell>
                <TableCell className="truncate max-w-[200px]">{pemasok.alamat}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <ActionGrid
                      onEdit={() => onEdit(pemasok.id)}
                      onDelete={() => openDeleteDialog(pemasok.id)}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pemasok ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
