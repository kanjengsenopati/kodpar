
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

interface NominalInputFieldProps {
  id?: string;
  value: number | string;
  onValueChange: (numberValue: number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function NominalInputField({
  id,
  value,
  onValueChange,
  placeholder = "Contoh: 1.000.000",
  required,
  disabled,
  className
}: NominalInputFieldProps) {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    // Convert incoming value to display format
    if (value !== undefined && value !== null && value !== "") {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue) && isFinite(numValue) && numValue > 0) {
        setDisplayValue(formatNumberInput(numValue));
      } else {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("");
      onValueChange(0);
      return;
    }
    
    // Clean and convert to number
    const numericValue = cleanNumberInput(inputValue);
    
    // Validate that it's a valid number
    if (isNaN(numericValue) || !isFinite(numericValue)) {
      return; // Don't update if invalid
    }
    
    // Format for display
    const formatted = formatNumberInput(numericValue);
    setDisplayValue(formatted);
    
    // Return the numeric value
    onValueChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, ctrl+a, ctrl+c, ctrl+v, ctrl+x
    if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
        (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode))) {
      return;
    }
    
    // Only allow numbers
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputMode="numeric"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoComplete="off"
      className={className}
    />
  );
}
