
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Globe, Bell, Shield, Calculator } from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";
import { Pengaturan } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import pengaturan components
import { ProfilKoperasiSettings } from "@/components/pengaturan/ProfilKoperasiSettings";
import { SukuBungaSettings } from "@/components/pengaturan/SukuBungaSettings";
import { TenorSettings } from "@/components/pengaturan/TenorSettings";
import { DendaSettings } from "@/components/pengaturan/DendaSettings";
import { SHUSettings } from "@/components/pengaturan/SHUSettings";
import { BackupResetSettings } from "@/components/pengaturan/BackupResetSettings";
import { NotificationSettings } from "@/components/pengaturan/NotificationSettings";

const sidebarItems = [
  {
    id: "general",
    title: "Umum",
    icon: Globe,
    description: "Kelola pengaturan dasar aplikasi Anda"
  },
  {
    id: "notifications", 
    title: "Notifikasi",
    icon: Bell,
    description: "Konfigurasi preferensi notifikasi"
  },
  {
    id: "security",
    title: "Keamanan", 
    icon: Shield,
    description: "Pengaturan keamanan dan autentikasi"
  },
  {
    id: "pusat-formula",
    title: "Pusat Formula",
    icon: Calculator,
    description: "Pengaturan formula dan perhitungan"
  }
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Pengaturan | null>(null);

  useEffect(() => {
    const loadedSettings = getPengaturan();
    setSettings(loadedSettings);
  }, []);

  if (!settings) {
    return (
      <Layout pageTitle="Pengaturan">
        <div>Memuat...</div>
      </Layout>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Pengaturan Umum</h2>
              <p className="text-sm text-gray-500 mt-1">Kelola pengaturan dasar aplikasi Anda</p>
            </div>
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="profil-koperasi" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  Profil Koperasi
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <ProfilKoperasiSettings settings={settings} setSettings={setSettings} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="suku-bunga" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  Pengaturan Suku Bunga
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <SukuBungaSettings settings={settings} setSettings={setSettings} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tenor" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  Pengaturan Tenor
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <TenorSettings settings={settings} setSettings={setSettings} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="denda" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  Pengaturan Denda
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <DendaSettings settings={settings} setSettings={setSettings} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Notifikasi</h2>
              <p className="text-sm text-gray-500 mt-1">Konfigurasi preferensi notifikasi</p>
            </div>
            <NotificationSettings settings={settings} setSettings={setSettings} />
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Keamanan</h2>
              <p className="text-sm text-gray-500 mt-1">Pengaturan keamanan dan autentikasi</p>
            </div>
            <BackupResetSettings />
          </div>
        );
      case "pusat-formula":
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Pusat Formula</h2>
              <p className="text-sm text-gray-500 mt-1">Pengaturan formula dan perhitungan</p>
            </div>
            <SHUSettings settings={settings} setSettings={setSettings} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout pageTitle="Pengaturan">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-2">
            Kelola pengaturan dan preferensi aplikasi Anda.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-1">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
