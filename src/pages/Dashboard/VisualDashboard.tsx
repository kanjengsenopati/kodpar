
import React from 'react';
import Layout from "@/components/layout/Layout";
import { KoperasiVisualDashboard } from '@/components/dashboard/KoperasiVisualDashboard';
import { RetailDashboard } from '@/components/dashboard/RetailDashboard';
import { ManufakturPlaceholder } from '@/components/dashboard/ManufakturPlaceholder';
import { useBusinessTab } from '@/contexts/BusinessTabContext';
import { getCurrentUser } from '@/services/auth/sessionManagement';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';

export default function VisualDashboard() {
  const { activeTab } = useBusinessTab();
  const user = getCurrentUser();
  const isAnggota = user?.roleId === 'role_anggota' || user?.roleId === 'anggota';

  return (
    <Layout pageTitle={isAnggota ? "Dashboard Anggota" : "Dashboard"}>
      {isAnggota ? (
        <MemberDashboard />
      ) : (
        <>
          {activeTab === 'koperasi' && <KoperasiVisualDashboard />}
          {activeTab === 'retail' && <RetailDashboard />}
          {activeTab === 'manufaktur' && <ManufakturPlaceholder />}
        </>
      )}
    </Layout>
  );
}
