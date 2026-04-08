
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  accept: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
}

export function FileUploader({ 
  accept, 
  maxSize = 5, 
  onFileSelect 
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (selectedFile: File) => {
    // Reset state
    setIsValidating(true);
    setProgress(0);
    
    // Simulate validation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    // Check file type
    const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.replace('.', '').trim());
    
    if (!acceptedTypes.includes(fileType || '')) {
      clearInterval(interval);
      setIsValidating(false);
      setProgress(0);
      toast.error(`Format file tidak didukung. Gunakan format ${accept}`);
      return;
    }
    
    // Check file size
    const fileSize = selectedFile.size / (1024 * 1024); // Convert to MB
    if (fileSize > maxSize) {
      clearInterval(interval);
      setIsValidating(false);
      setProgress(0);
      toast.error(`Ukuran file terlalu besar. Maksimal ${maxSize}MB`);
      return;
    }
    
    // Complete validation
    setTimeout(() => {
      setProgress(100);
      setFile(selectedFile);
      setIsValidating(false);
      onFileSelect(selectedFile);
    }, 500);
  };
  
  const removeFile = () => {
    setFile(null);
  };
  
  return (
    <Card className="border-dashed">
      <CardContent className="p-6">
        {!file ? (
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isValidating ? (
              <div className="w-full max-w-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-6 w-6 text-primary animate-pulse" />
                  <span>Memverifikasi file...</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">
                  Drag & drop file atau klik untuk memilih
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Format yang didukung: {accept}. Maks {maxSize}MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Pilih File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        ) : (
          <div className="p-4 border rounded-lg bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileSpreadsheet className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Format: {file.name.split('.').pop()?.toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
              <div className="text-green-500 mt-0.5"><AlertCircle className="h-4 w-4" /></div>
              <div className="text-sm">
                <p className="font-semibold text-green-700">File siap untuk diproses</p>
                <p className="text-green-600 mt-1">Format file valid dan siap untuk di-preview</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
