
import React from "react";
import Layout from "@/components/layout/Layout";

interface LoadingStateProps {
  pageTitle: string;
}

export function LoadingState({ pageTitle }: LoadingStateProps) {
  return (
    <Layout pageTitle={pageTitle}>
      <div className="flex justify-center items-center h-64">
        <p>Memuat data penjualan...</p>
      </div>
    </Layout>
  );
}
