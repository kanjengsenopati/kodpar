
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Phone, MapPin, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRupiah } from "@/lib/utils";

interface AnggotaGridViewProps {
  anggota: any[];
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (anggota: any) => void;
  getTotalSimpanan: (anggotaId: string) => number;
  getTotalPinjaman: (anggotaId: string) => number;
}

export function AnggotaGridView({ 
  anggota, 
  onViewDetail, 
  onEdit, 
  onDelete,
  getTotalSimpanan,
  getTotalPinjaman 
}: AnggotaGridViewProps) {
  if (anggota.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">Tidak ada anggota ditemukan</h3>
        <p className="text-muted-foreground">Coba ubah filter pencarian atau tambah anggota baru</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {anggota.map((member) => (
        <Card key={member.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.foto} alt={member.nama} />
                <AvatarFallback>
                  {member.nama.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{member.nama}</CardTitle>
                <CardDescription className="text-sm">
                  No. {member.noAnggota}
                </CardDescription>
              </div>
              <Badge variant={member.status === "Aktif" ? "default" : "secondary"}>
                {member.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              {member.noHP && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {member.noHP}
                </div>
              )}
              {member.unitKerja && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {member.unitKerja}
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(member.tanggalBergabung).toLocaleDateString('id-ID')}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Simpanan</div>
                <div className="font-medium text-sm">
                  {formatRupiah(getTotalSimpanan(member.id))}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Pinjaman</div>
                <div className="font-medium text-sm">
                  {formatRupiah(getTotalPinjaman(member.id))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(member.id)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Detail
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
              >
                <Link to={`/master/anggota/edit/${member.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(member)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
