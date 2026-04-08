
import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordInputProps {
  field: ControllerRenderProps<any, "password">;
}

export function PasswordInput({ field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Masukkan password"
        className="pl-10 h-12 pr-10 border-muted/30 bg-white/50 backdrop-blur-sm"
        {...field}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
