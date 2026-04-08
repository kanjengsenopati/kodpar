
import { ReactNode } from "react";
import Header from "./Header";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/form-styles.css";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

/**
 * Professional SaaS-style backoffice layout for Desktop
 */
export default function DesktopLayout({ children, pageTitle }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden">
        <SidebarNav />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header pageTitle={pageTitle} />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            <div className="max-w-[1600px] mx-auto min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
