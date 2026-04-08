
import { Button } from "@/components/ui/button";

interface UserFormActionsProps {
  isSubmitting?: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export function UserFormActions({ 
  isSubmitting = false,
  isEditMode, 
  onCancel 
}: UserFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? "Perbarui" : "Tambah Pengguna"}
      </Button>
    </div>
  );
}
