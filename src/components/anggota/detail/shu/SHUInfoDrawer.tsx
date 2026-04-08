
import { useState } from "react";
import { BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger 
} from "@/components/ui/drawer";
import { SHUDrawerContent } from "./SHUDrawerContent";
import { useSHUData } from "./hooks/useSHUData";

interface SHUInfoDrawerProps {
  totalSHU: number;
  anggotaId: string;
}

export function SHUInfoDrawer({ totalSHU: initialSHU, anggotaId }: SHUInfoDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { totalSHU, shuFormula, updateSHUValue } = useSHUData(anggotaId, initialSHU);
  
  // Update SHU when drawer opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      updateSHUValue();
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4" />
          <span>Informasi SHU</span>
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[90vh]">
        <SHUDrawerContent
          totalSHU={totalSHU}
          shuFormula={shuFormula}
          onUpdateSHU={updateSHUValue}
        />
      </DrawerContent>
    </Drawer>
  );
}
