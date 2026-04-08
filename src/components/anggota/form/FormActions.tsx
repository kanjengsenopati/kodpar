
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isFormDirty: boolean;
  isEditMode: boolean;
  onCancel: () => void;
}

export function FormActions({ 
  isSubmitting, 
  isFormDirty, 
  isEditMode, 
  onCancel 
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Batal
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || (!isFormDirty && isEditMode)}
      >
        {isSubmitting ? "Menyimpan..." : isEditMode ? "Perbarui" : "Simpan"}
      </Button>
    </div>
  );
}
