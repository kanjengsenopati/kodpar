
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { PenjualanItem } from "@/types";
import { Kasir } from "@/types";
import { getProdukItemById } from "@/services/produk";
import { calculateTotal } from "@/services/penjualan";
import { CartHeader } from "./cart/CartHeader";
import { EmptyCart } from "./cart/EmptyCart";
import { DiscountTaxInputs } from "./cart/DiscountTaxInputs";
import { Card } from "@/components/ui/card";

interface CartSectionProps {
  items: PenjualanItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: (checkoutData: {
    kasirId: string;
    metodePembayaran: "cash" | "debit" | "kredit" | "qris";
    dibayar: number;
    kembalian: number;
    catatan: string;
  }) => void;
  kasirList: Kasir[];
  processing: boolean;
}

export function CartSection({ 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onClear, 
  onCheckout,
  kasirList,
  processing
}: CartSectionProps) {
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(15);
  const [serviceFee, setServiceFee] = useState(15); // Added service fee for restaurant style
  const [takeawayFee, setTakeawayFee] = useState(5); // Added takeaway fee for restaurant style
  const [activeTab, setActiveTab] = useState("pembayaran");
  
  const subtotal = items.reduce((total, item) => total + item.total, 0);
  const serviceFeeAmount = (subtotal * serviceFee) / 100;
  const takeawayFeeAmount = (subtotal * takeawayFee) / 100;
  const discountAmount = (subtotal * discount) / 100;
  
  // Calculate total with service and takeaway fees (restaurant style)
  const total = subtotal - discountAmount + serviceFeeAmount + takeawayFeeAmount;
  
  const itemCount = items.reduce((sum, item) => sum + item.jumlah, 0);
  
  return (
    <Card className="shadow-md h-full flex flex-col">
      <CartHeader itemCount={itemCount} onClear={onClear} />
      
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="p-3 space-y-1">
            {items.map(item => {
              const product = getProdukItemById(item.produkId);
              if (!product) return null;
              
              return (
                <CartItem 
                  key={item.produkId}
                  item={item}
                  product={product}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              );
            })}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t bg-gray-50">
        <Tabs 
          defaultValue="pembayaran" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-3 bg-white">
            <TabsTrigger value="pembayaran" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
              Pembayaran
            </TabsTrigger>
            <TabsTrigger value="diskon" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
              Biaya & Diskon
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pembayaran" className="mt-0">
            <CartSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              discountAmount={discountAmount}
              serviceFee={serviceFee}
              serviceFeeAmount={serviceFeeAmount}
              takeawayFee={takeawayFee}
              takeawayFeeAmount={takeawayFeeAmount}
              total={total}
              onCheckout={onCheckout}
              kasirList={kasirList}
              processing={processing}
            />
          </TabsContent>
          
          <TabsContent value="diskon" className="mt-0">
            <DiscountTaxInputs
              discount={discount}
              tax={tax}
              serviceFee={serviceFee}
              takeawayFee={takeawayFee}
              onDiscountChange={setDiscount}
              onTaxChange={setTax}
              onServiceFeeChange={setServiceFee}
              onTakeawayFeeChange={setTakeawayFee}
              onComplete={() => setActiveTab("pembayaran")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
