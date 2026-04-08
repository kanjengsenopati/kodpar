
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-4">
        <ShoppingCart className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Keranjang Kosong</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-xs">
        Tambahkan produk ke keranjang untuk mulai membuat transaksi penjualan
      </p>
    </div>
  );
}
