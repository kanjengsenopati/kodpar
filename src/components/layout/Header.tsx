
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

type HeaderProps = {
  pageTitle: string;
  actions?: React.ReactNode;
};

export default function Header({ pageTitle, actions }: HeaderProps) {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const formatPathName = (path: string) => {
    return path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-14 z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          
          {/* BREADCRUMBS */}
          <nav className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-400 mb-1.5">
            <Link to="/dashboard" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="h-3 w-3" />
            </Link>
            {paths.map((path, index) => {
              const isLast = index === paths.length - 1;
              const to = `/${paths.slice(0, index + 1).join('/')}`;
              
              return (
                <React.Fragment key={to}>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  {isLast ? (
                    <span className="text-slate-800 font-semibold">{formatPathName(path)}</span>
                  ) : (
                    <Link to={to} className="hover:text-blue-600 transition-colors">
                      {formatPathName(path)}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
            
            {paths.length === 0 && (
               <>
                 <ChevronRight className="h-3 w-3 text-slate-300" />
                 <span className="text-slate-800 font-semibold">Dashboard</span>
               </>
            )}
          </nav>

          <Text.H1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {pageTitle}
          </Text.H1>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <Text.Label className="text-[10px] tracking-tight leading-tight uppercase font-bold text-slate-400">
              Live Environment • KOPIMU
            </Text.Label>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
