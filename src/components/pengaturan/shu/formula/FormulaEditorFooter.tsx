
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface FormulaEditorFooterProps {
  onSave: () => boolean | void;
  isValid: boolean;
  isSaving: boolean;
}

export function FormulaEditorFooter({ onSave, isValid, isSaving }: FormulaEditorFooterProps) {
  const handleSave = () => {
    const result = onSave();
    
    // Only show success toast if not explicitly returning false
    // This allows the parent component to control the toast display
    if (result !== false) {
      toast.success("Formula SHU berhasil disimpan dan akan diterapkan pada perhitungan SHU anggota");
    }
  };

  return (
    <CardFooter className="flex justify-end">
      <Button
        onClick={handleSave}
        disabled={!isValid || isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Menyimpan..." : "Simpan Formula"}
      </Button>
    </CardFooter>
  );
}
