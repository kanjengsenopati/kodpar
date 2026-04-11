
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
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-14 z-30 py-2.5 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">

        <div className="flex flex-col gap-0.5">
          
          {/* BREADCRUMBS */}
          <nav className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400/80 uppercase tracking-wider">
            <Link to="/dashboard" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="h-2.5 w-2.5" />
            </Link>
            {paths.map((path, index) => {
              const isLast = index === paths.length - 1;
              const to = `/${paths.slice(0, index + 1).join('/')}`;
              
              return (
                <React.Fragment key={to}>
                  <ChevronRight className="h-2.5 w-2.5 text-slate-300" />
                  {isLast ? (
                    <span className="text-slate-600 font-bold">{formatPathName(path)}</span>
                  ) : (
                    <Link to={to} className="hover:text-blue-600 transition-colors">
                      {formatPathName(path)}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="flex items-baseline gap-3">
            <Text.H1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
              {pageTitle}
            </Text.H1>
            
            <div className="flex items-center gap-1.5 opacity-80 scale-90 origin-left">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <Text.Label className="text-[9px] tracking-tight leading-tight uppercase font-bold text-slate-400">
                LIVE
              </Text.Label>
            </div>
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
