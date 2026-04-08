
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, CircleMinus } from "lucide-react";

interface TransactionStatusBadgeProps {
  status: "sukses" | "dibatalkan" | "bayar-sebagian" | "bayar-lengkap" | "belum-terbayar" | string;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  // Ensure status is lowercase for consistent comparison
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case "sukses":
      return (
        <Badge variant="success" className="gap-1 items-center">
          <CheckCircle className="h-3 w-3" />
          Sukses
        </Badge>
      );
    case "dibatalkan":
      return (
        <Badge variant="destructive" className="gap-1 items-center">
          <XCircle className="h-3 w-3" />
          Dibatalkan
        </Badge>
      );
    case "bayar-sebagian":
      return (
        <Badge variant="warning" className="gap-1 items-center">
          <CircleMinus className="h-3 w-3" />
          Bayar Sebagian
        </Badge>
      );
    case "bayar-lengkap":
      return (
        <Badge variant="success" className="gap-1 items-center">
          <CheckCircle className="h-3 w-3" />
          Bayar Lengkap
        </Badge>
      );
    case "belum-terbayar":
      return (
        <Badge variant="danger" className="gap-1 items-center">
          <Clock className="h-3 w-3" />
          Belum Terbayar
        </Badge>
      );
    // Add these mappings for English status values to Indonesian
    case "partially paid":
      return (
        <Badge variant="warning" className="gap-1 items-center">
          <CircleMinus className="h-3 w-3" />
          Bayar Sebagian
        </Badge>
      );
    case "fully paid":
      return (
        <Badge variant="success" className="gap-1 items-center">
          <CheckCircle className="h-3 w-3" />
          Bayar Lengkap
        </Badge>
      );
    case "unpaid":
      return (
        <Badge variant="danger" className="gap-1 items-center">
          <Clock className="h-3 w-3" />
          Belum Terbayar
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
