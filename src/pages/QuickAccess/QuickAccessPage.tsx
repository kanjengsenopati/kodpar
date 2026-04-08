
import Layout from "@/components/layout/Layout";
import { QuickAccessCards } from "@/components/layout/sidebar/QuickAccessCards";

export default function QuickAccessPage() {
  return (
    <Layout pageTitle="Akses Cepat">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
              Akses Cepat Module
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Pilih module untuk mengakses fitur-fitur yang tersedia dengan mudah dan cepat
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Cards Section */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8">
              <QuickAccessCards />
            </div>
          </div>

          {/* Footer decoration */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Sistem Koperasi Terintegrasi</span>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
