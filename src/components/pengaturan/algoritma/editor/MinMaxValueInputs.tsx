
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MinMaxValueInputsProps {
  minValue: number;
  maxValue: number;
  onMinValueChange: (value: number) => void;
  onMaxValueChange: (value: number) => void;
}

export function MinMaxValueInputs({
  minValue,
  maxValue,
  onMinValueChange,
  onMaxValueChange
}: MinMaxValueInputsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="min-value" className="text-sm font-medium">
          Nilai Minimum
        </Label>
        <Input
          id="min-value"
          type="number"
          value={minValue}
          onChange={(e) => onMinValueChange(Number(e.target.value))}
          placeholder="0"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="max-value" className="text-sm font-medium">
          Nilai Maksimum
        </Label>
        <Input
          id="max-value"
          type="number"
          value={maxValue}
          onChange={(e) => onMaxValueChange(Number(e.target.value))}
          placeholder="10000000"
          className="mt-1"
        />
      </div>
    </div>
  );
}
