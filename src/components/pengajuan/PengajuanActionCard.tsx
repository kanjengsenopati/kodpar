
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ChevronsUpDown } from "lucide-react";

interface PengajuanActionCardProps {
  status: string;
  onApprove: () => void;
  onReject: () => void;
  onChangeStatus: () => void;
}

export function PengajuanActionCard({ 
  status,
  onApprove,
  onReject,
  onChangeStatus
}: PengajuanActionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Tindakan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "Menunggu" ? (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="gap-2"
              onClick={onApprove}
            >
              <Check size={16} /> Setujui
            </Button>
            
            <Button 
              variant="destructive"
              className="gap-2"
              onClick={onReject}
            >
              <X size={16} /> Tolak
            </Button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm mb-2">
              Status pengajuan saat ini:
            </p>
            <p className={`font-semibold ${
              status === "Disetujui" ? "text-green-600" : "text-red-600"
            }`}>
              {status}
            </p>
            
            <Button 
              variant="outline"
              className="w-full mt-4 gap-2"
              onClick={onChangeStatus}
            >
              <ChevronsUpDown size={16} /> Ubah Status
            </Button>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-muted-foreground mb-2">
            Info tindakan:
          </p>
          <ul className="text-sm space-y-1">
            <li>• Menyetujui pengajuan akan membuat transaksi baru.</li>
            <li>• Menolak pengajuan hanya akan mengubah status.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
