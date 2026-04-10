
import { ShoppingCart } from "lucide-react";
import { Text } from "@/components/ui/text";

export function EmptyCart() {
  return (
    <div className="h-full flex flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 p-10 rounded-[40px] shadow-[0_15px_30px_rgba(37,99,235,0.08)]">
          <ShoppingCart className="h-16 w-16 text-blue-600" strokeWidth={1.5} />
        </div>
      </div>
      
      <Text.H2 className="mb-3 text-[20px]">Keranjang Kosong</Text.H2>
      <Text.Body className="text-slate-400 max-w-[240px] leading-relaxed mx-auto font-medium">
        Tambahkan produk ke keranjang untuk mulai membuat transaksi penjualan
      </Text.Body>
    </div>
  );
}
