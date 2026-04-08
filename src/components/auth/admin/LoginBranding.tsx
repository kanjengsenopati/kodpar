
import { CreditCard, Shield, TrendingUp, Users } from "lucide-react";

export function LoginBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-center space-y-6 px-6" style={{ marginTop: '-70px' }}>
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-koperasi-blue to-koperasi-green rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-koperasi-dark leading-tight">
              ERP Koperasi
            </h1>
            <p className="text-sm text-koperasi-gray">Enterprise Resource Planning Koperasi</p>
          </div>
        </div>
        <p className="text-lg text-koperasi-gray font-medium">
          Platform Digital Manajemen Koperasi Terpadu
        </p>
      </div>
      
      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-koperasi-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-koperasi-green" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-koperasi-dark">Manajemen Anggota</h3>
            <p className="text-sm text-koperasi-gray">Kelola data anggota dengan sistem terintegrasi dan user-friendly</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-koperasi-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-koperasi-green" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-koperasi-dark">Transaksi Digital</h3>
            <p className="text-sm text-koperasi-gray">Proses simpan, pinjam, dan angsuran secara digital dan real-time</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-koperasi-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-koperasi-green" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-koperasi-dark">Keamanan Terjamin</h3>
            <p className="text-sm text-koperasi-gray">Sistem keamanan berlapis dengan enkripsi data end-to-end</p>
          </div>
        </div>
      </div>
    </div>
  );
}
