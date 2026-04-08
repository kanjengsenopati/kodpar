
import React from 'react';
import Layout from "@/components/layout/Layout";
import { KoperasiVisualDashboard } from '@/components/dashboard/KoperasiVisualDashboard';
import { RetailDashboard } from '@/components/dashboard/RetailDashboard';
import { ManufakturPlaceholder } from '@/components/dashboard/ManufakturPlaceholder';
import { useBusinessTab } from '@/contexts/BusinessTabContext';

export default function VisualDashboard() {
  const { activeTab } = useBusinessTab();

  return (
    <Layout pageTitle="Dashboard">
      {activeTab === 'koperasi' && <KoperasiVisualDashboard />}
      {activeTab === 'retail' && <RetailDashboard />}
      {activeTab === 'manufaktur' && <ManufakturPlaceholder />}
    </Layout>
  );
}
