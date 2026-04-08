
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { Anggota } from "@/types";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  anggota: Anggota;
}

export function ProfileCard({ anggota }: ProfileCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-gray-200">
              {anggota.foto ? (
                <img 
                  src={anggota.foto} 
                  alt={anggota.nama} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="h-20 w-20 text-gray-400" />
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-center">{anggota.nama}</h2>
          <p className="text-gray-500 text-center mb-4">{anggota.id}</p>
          
          <div className="w-full space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{anggota.noHp}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{anggota.alamat}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Bergabung: {new Date(anggota.createdAt).toLocaleDateString("id-ID")}</span>
            </div>
          </div>
          
          <div className="mt-6 w-full">
            <Link to={`/anggota/${anggota.id}/edit`}>
              <Button className="w-full gap-2">
                <Edit size={16} /> Edit Data Anggota
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
