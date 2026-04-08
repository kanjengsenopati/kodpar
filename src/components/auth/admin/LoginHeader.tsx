import { CreditCard } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import * as Text from "@/components/ui/text";

export function LoginHeader() {
  return (
    <CardHeader className="text-center pb-3 pt-5 px-6">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
        <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <Text.H1 className="mb-1">Selamat Datang</Text.H1>
      <Text.Body className="text-slate-400">
        Masuk ke sistem manajemen koperasi
      </Text.Body>
    </CardHeader>
  );
}
