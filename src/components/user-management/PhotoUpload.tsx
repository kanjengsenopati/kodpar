
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";

interface PhotoUploadProps {
  initialImage?: string;
  onImageChange: (imageData: string) => void;
}

export function PhotoUpload({ initialImage, onImageChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setPreview(imageData);
      onImageChange(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-40 w-40">
          <AvatarImage src={preview} />
          <AvatarFallback className="text-4xl bg-blue-100">
            <Camera className="h-10 w-10 opacity-50" />
          </AvatarFallback>
        </Avatar>
        {preview && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="mt-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button type="button" variant="outline" onClick={handleBrowseClick}>
          {preview ? "Ganti Foto" : "Unggah Foto"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Maksimal 1MB, format JPG, PNG atau GIF
      </p>
    </div>
  );
}
