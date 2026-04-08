
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface DiscountTaxInputsProps {
  discount: number;
  tax: number;
  serviceFee?: number;
  takeawayFee?: number;
  onDiscountChange: (value: number) => void;
  onTaxChange: (value: number) => void;
  onServiceFeeChange?: (value: number) => void;
  onTakeawayFeeChange?: (value: number) => void;
  onComplete?: () => void;
}

export function DiscountTaxInputs({
  discount,
  tax,
  serviceFee = 0,
  takeawayFee = 0,
  onDiscountChange,
  onTaxChange,
  onServiceFeeChange,
  onTakeawayFeeChange,
  onComplete
}: DiscountTaxInputsProps) {
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onDiscountChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onTaxChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleServiceFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onServiceFeeChange) return;
    const value = parseFloat(e.target.value);
    onServiceFeeChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleTakeawayFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onTakeawayFeeChange) return;
    const value = parseFloat(e.target.value);
    onTakeawayFeeChange(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  return (
    <div className="space-y-4">
      {onServiceFeeChange && (
        <div>
          <Label htmlFor="serviceFee" className="text-sm">
            Service Charge (%)
          </Label>
          <Input
            id="serviceFee"
            type="number"
            min={0}
            max={100}
            value={serviceFee}
            onChange={handleServiceFeeChange}
            className="mt-1.5"
          />
          
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[0, 5, 10, 15].map((value) => (
              <Button
                key={value}
                type="button"
                variant={serviceFee === value ? "default" : "outline"}
                size="sm"
                className={`text-xs ${serviceFee === value ? 'bg-primary text-white' : ''}`}
                onClick={() => onServiceFeeChange(value)}
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>
      )}

      {onTakeawayFeeChange && (
        <div>
          <Label htmlFor="takeawayFee" className="text-sm">
            Take Away Fee (%)
          </Label>
          <Input
            id="takeawayFee"
            type="number"
            min={0}
            max={100}
            value={takeawayFee}
            onChange={handleTakeawayFeeChange}
            className="mt-1.5"
          />
          
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[0, 5, 10, 15].map((value) => (
              <Button
                key={value}
                type="button"
                variant={takeawayFee === value ? "default" : "outline"}
                size="sm"
                className={`text-xs ${takeawayFee === value ? 'bg-primary text-white' : ''}`}
                onClick={() => onTakeawayFeeChange(value)}
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="discount" className="text-sm">
          Diskon (%)
        </Label>
        <Input
          id="discount"
          type="number"
          min={0}
          max={100}
          value={discount}
          onChange={handleDiscountChange}
          className="mt-1.5"
        />
        
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[0, 5, 10, 15].map((value) => (
            <Button
              key={value}
              type="button"
              variant={discount === value ? "default" : "outline"}
              size="sm"
              className={`text-xs ${discount === value ? 'bg-primary text-white' : ''}`}
              onClick={() => onDiscountChange(value)}
            >
              {value}%
            </Button>
          ))}
        </div>
      </div>

      {onComplete && (
        <Button 
          onClick={onComplete}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          Terapkan dan Lanjutkan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
