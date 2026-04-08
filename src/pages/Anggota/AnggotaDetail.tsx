
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAnggotaById } from "@/services/anggotaService";
import { getCurrentUser } from "@/services/authService";
import Layout from "@/components/layout/Layout";
import AnggotaLayout from "@/components/layout/AnggotaLayout";
import { LoadingState } from "@/components/anggota/detail/LoadingState";
import { AnggotaDetailContent } from "@/components/anggota/detail/AnggotaDetailContent";
import { AnggotaNotFound } from "@/components/anggota/detail/AnggotaNotFound";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const [anggota, setAnggota] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();
  const isAnggotaUser = currentUser?.roleId !== 'role_superadmin' && currentUser?.roleId !== 'role_admin';
  
  // Load anggota data
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    const anggotaData = getAnggotaById(id);
    
    if (anggotaData) {
      setAnggota(anggotaData);
    }
    
    // Simulate loading delay for demo
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  // Render the appropriate content based on loading state and user role
  if (isAnggotaUser) {
    return (
      <AnggotaLayout pageTitle="Profil Anggota">
        {isLoading ? (
          <LoadingState />
        ) : anggota ? (
          <AnggotaDetailContent anggota={anggota} />
        ) : (
          <AnggotaNotFound id={id} />
        )}
      </AnggotaLayout>
    );
  }

  return (
    <Layout pageTitle="Detail Anggota">
      {isLoading ? (
        <LoadingState />
      ) : anggota ? (
        <AnggotaDetailContent anggota={anggota} />
      ) : (
        <AnggotaNotFound id={id} />
      )}
    </Layout>
  );
}
