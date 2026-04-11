
import { ReactNode } from "react";
import Header from "./Header";
import { TopNav } from "./TopNav";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/form-styles.css";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
  actions?: ReactNode;
};

/**
 * Modern Top-Navigation based layout for Koperasi ERP
 */
export default function DesktopLayout({ children, pageTitle, actions }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <TopNav />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* We keep the Header for now as it contains pageTitle and potentially breadcrumbs */}
        <Header pageTitle={pageTitle} actions={actions} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
