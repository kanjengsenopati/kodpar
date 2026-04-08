
import { CreditCard } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function LoginHeader() {
  return (
    <CardHeader className="text-center pb-3 pt-5 px-6">
      <div className="w-12 h-12 bg-gradient-to-br from-koperasi-blue to-koperasi-green rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
        <CreditCard className="w-6 h-6 text-white" />
      </div>
      <CardTitle className="text-xl font-bold text-koperasi-dark">
        Selamat Datang
      </CardTitle>
      <CardDescription className="text-koperasi-gray text-sm">
        Masuk ke sistem manajemen koperasi
      </CardDescription>
    </CardHeader>
  );
}
