
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: 'user' | 'role';
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  itemType,
  onConfirm
}: DeleteConfirmationDialogProps) {
  const typeLabel = itemType === 'user' ? 'pengguna' : 'peran';
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {typeLabel}</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus {typeLabel} ini? Tindakan ini tidak dapat dibatalkan.
            {itemType === 'role' && (
              <p className="mt-2 font-medium text-destructive">
                Catatan: Peran yang sedang digunakan oleh pengguna tidak dapat dihapus.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
