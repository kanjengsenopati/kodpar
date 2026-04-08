
import { ProfileCard } from "./ProfileCard";
import { InfoCard } from "./InfoCard";
import { Anggota } from "@/types";

interface MainInfoSectionProps {
  anggota: Anggota;
}

export function MainInfoSection({ 
  anggota
}: MainInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      <div className="lg:col-span-4">
        <ProfileCard anggota={anggota} />
      </div>
      
      <div className="lg:col-span-8">
        <InfoCard anggota={anggota} />
      </div>
    </div>
  );
}
