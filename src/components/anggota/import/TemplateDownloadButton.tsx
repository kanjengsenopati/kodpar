
import { Button } from "@/components/ui/button";
import { generateAnggotaTemplate } from "@/utils/excelUtils";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TemplateDownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Generate template file
      const blob = generateAnggotaTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Template_Anggota.xlsx');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Template berhasil diunduh");
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Gagal mengunduh template");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isGenerating} 
      className="flex items-center gap-1"
    >
      <FileText className="h-4 w-4" />
      <span>Download Template</span>
    </Button>
  );
}
