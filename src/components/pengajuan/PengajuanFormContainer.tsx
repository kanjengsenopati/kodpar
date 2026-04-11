
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PengajuanFormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  isLoading?: boolean;
}

export function PengajuanFormContainer({ 
  children, 
  onSubmit, 
  isEdit = false,
  isLoading = false 
}: PengajuanFormContainerProps) {
  return (
    <div className="w-full">
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {children}
        </div>
      </form>
    </div>
  );
}
