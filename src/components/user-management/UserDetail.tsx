
import { User } from "@/types/user";
import { getRoleById } from "@/services/userManagementService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserDetailProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetail({ user, isOpen, onClose }: UserDetailProps) {
  if (!user) return null;

  const role = getRoleById(user.roleId);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detail Pengguna</span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mt-2 mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.foto} alt={user.nama} />
            <AvatarFallback className="text-2xl">
              {user.nama.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-xl mt-2">{user.nama}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">{user.username}</span>
            {user.aktif ? (
              <Badge className="bg-green-500">Aktif</Badge>
            ) : (
              <Badge variant="destructive">Nonaktif</Badge>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Jabatan</div>
            <div className="col-span-2">{user.jabatan || "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Email</div>
            <div className="col-span-2">{user.email}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">No. HP</div>
            <div className="col-span-2">{user.noHP || "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Alamat</div>
            <div className="col-span-2">{user.alamat || "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Hak Akses</div>
            <div className="col-span-2">{role?.name || "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Login Terakhir</div>
            <div className="col-span-2">{formatDate(user.lastLogin)}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Terdaftar</div>
            <div className="col-span-2">{formatDate(user.createdAt)}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
