
import React from "react";

interface CartLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

export function CartLabel({ htmlFor, children }: CartLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
      {children}
    </label>
  );
}
