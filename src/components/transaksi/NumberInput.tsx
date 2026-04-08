
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberInput, cleanNumberInput, isValidAmountRange } from "@/utils/formatters";

interface NumberInputProps {
  id: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  disabled?: boolean;
}

export function NumberInput({ 
  id, 
  value, 
  onChange, 
  label, 
  placeholder = "Contoh: 5.000.000.000", 
  required = false,
  className = "",
  helpText = "Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan (tidak ada batas maksimal)",
  disabled = false
}: NumberInputProps) {
  const [formattedValue, setFormattedValue] = useState<string>("");
  
  // Initialize formatted value when component loads or value changes from outside
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue) && isValidAmountRange(numValue)) {
        setFormattedValue(formatNumberInput(numValue));
      } else {
        setFormattedValue("");
      }
    } else {
      setFormattedValue("");
    }
  }, [value]);
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === "") {
      setFormattedValue("");
      const syntheticEvent = {
        ...e,
        target: { ...e.target, id: id, value: "0" }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      return;
    }
    
    // Format the value with thousand separators
    const numericAmount = cleanNumberInput(inputValue);
    
    // Validate range using JavaScript's safe integer range
    if (!isValidAmountRange(numericAmount)) {
      return; // Don't update if exceeds valid range
    }
    
    const formatted = formatNumberInput(numericAmount);
    setFormattedValue(formatted);
    
    // Create a synthetic event with the cleaned numeric value
    const syntheticEvent = {
      ...e,
      target: { ...e.target, id: id, value: String(numericAmount) }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className={className}>
      {label && <Label htmlFor={id} className={required ? "required" : ""}>{label}</Label>}
      <Input 
        id={id} 
        placeholder={placeholder} 
        value={formattedValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        required={required}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="off"
      />
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
}
