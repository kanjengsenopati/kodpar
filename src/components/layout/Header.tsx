
import React from 'react';
import { cn } from "@/lib/utils";

type HeaderProps = {
  pageTitle: string;
};

export default function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Live Environment • Koperasi Senopati
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
