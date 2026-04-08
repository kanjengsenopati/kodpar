import { Mail } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface EmailInputProps {
  field: ControllerRenderProps<any, "email">;
}

export function EmailInput({ field }: EmailInputProps) {
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-koperasi-gray" />
      <input
        type="email"
        placeholder="Masukkan email"
        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-koperasi-green/50 focus:border-koperasi-green transition-all"
        {...field}
      />
    </div>
  );
}