
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  cancelHref: string;
}

export function FormActions({ isSubmitting, isEditMode, cancelHref }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link to={cancelHref}>
        <Button type="button" variant="outline">
          Batal
        </Button>
      </Link>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Data" : "Simpan Data"}
      </Button>
    </div>
  );
}
