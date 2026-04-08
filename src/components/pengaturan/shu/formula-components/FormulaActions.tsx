
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormulaActionsProps {
  isSaved: boolean;
  isSaving: boolean;
  hasError: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function FormulaActions({
  isSaved,
  isSaving,
  hasError,
  onSave,
  onReset
}: FormulaActionsProps) {
  const handleSave = () => {
    // Call the save function passed as prop
    onSave();
    
    // Dispatch a custom event to notify components about formula change
    const formulaChangeEvent = new CustomEvent('shu-formula-changed', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(formulaChangeEvent);
    
    // Set a trigger in localStorage to notify other components not listening for events
    localStorage.setItem('shu_formula_updated', Date.now().toString());
    
    // Notify with toast
    toast.success("Formula SHU berhasil disimpan. SHU anggota akan diperbarui secara otomatis.");
  };

  return (
    <div className="flex justify-between p-6 pt-2">
      {/* Reset button */}
      <div>
        <Button 
          variant="outline" 
          onClick={onReset}
          disabled={isSaved}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          Reset
        </Button>
      </div>
      
      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaved || hasError || isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Menyimpan..." : "Simpan Formula"}
      </Button>
    </div>
  );
}
