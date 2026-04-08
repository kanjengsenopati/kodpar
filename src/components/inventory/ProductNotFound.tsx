
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProductNotFoundProps {
  onBack: () => void;
}

export function ProductNotFound({ onBack }: ProductNotFoundProps) {
  return (
    <Card>
      <CardContent>
        <Alert>
          <AlertDescription>
            Produk tidak ditemukan. Kembali ke daftar produk.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          variant="outline"
          onClick={onBack}
        >
          Kembali ke Daftar
        </Button>
      </CardContent>
    </Card>
  );
}
