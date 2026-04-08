
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Printer } from "lucide-react";
import { 
  ExportField, 
  ExportOptions, 
  exportToPDF, 
  exportToExcel, 
  printData 
} from "@/services/exportService";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  fields: ExportField[];
  filename: string;
}

export function ExportDialog({ 
  isOpen, 
  onClose, 
  title, 
  data, 
  fields: initialFields, 
  filename 
}: ExportDialogProps) {
  const [fields, setFields] = useState<ExportField[]>(initialFields);
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldToggle = (fieldKey: string) => {
    setFields(prev => prev.map(field => 
      field.key === fieldKey 
        ? { ...field, selected: !field.selected }
        : field
    ));
  };

  const handleSelectAll = () => {
    const allSelected = fields.every(f => f.selected);
    setFields(prev => prev.map(field => ({ ...field, selected: !allSelected })));
  };

  const handleExport = async (type: 'pdf' | 'excel' | 'print') => {
    const selectedFields = fields.filter(f => f.selected);
    
    if (selectedFields.length === 0) {
      alert('Pilih minimal satu field untuk diekspor');
      return;
    }

    setIsExporting(true);
    
    const options: ExportOptions = {
      title,
      data,
      fields,
      filename
    };

    try {
      switch (type) {
        case 'pdf':
          exportToPDF(options);
          break;
        case 'excel':
          exportToExcel(options);
          break;
        case 'print':
          printData(options);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Terjadi kesalahan saat mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = fields.filter(f => f.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data - {title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Pilih Field ({selectedCount}/{fields.length})
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {fields.every(f => f.selected) ? 'Unselect All' : 'Select All'}
            </Button>
          </div>
          
          <ScrollArea className="h-64 border rounded p-3">
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={field.selected}
                    onCheckedChange={() => handleFieldToggle(field.key)}
                  />
                  <Label
                    htmlFor={field.key}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="text-xs text-muted-foreground">
            {data.length} record(s) akan diekspor
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('print')}
            disabled={isExporting || selectedCount === 0}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting || selectedCount === 0}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={() => handleExport('excel')}
            disabled={isExporting || selectedCount === 0}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
