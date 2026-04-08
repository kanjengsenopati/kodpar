
import { Button } from "@/components/ui/button";
import { FormActionsProps } from "./types";

export function FormActions({ isSubmitting, isEditMode }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={() => window.history.back()}>
        Batal
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Menyimpan..."
          : isEditMode
          ? "Perbarui Pinjaman"
          : "Simpan Pinjaman"}
      </Button>
    </div>
  );
}
