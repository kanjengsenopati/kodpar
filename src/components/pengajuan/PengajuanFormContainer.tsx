
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
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {children}
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/transaksi/pengajuan")}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" /> 
                {isEdit ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
