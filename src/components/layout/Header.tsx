
import React from 'react';
import { cn } from "@/lib/utils";
import * as Text from "@/components/ui/text";

type HeaderProps = {
  pageTitle: string;
};

export default function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <Text.H1 className="text-xl sm:text-2xl">
            {pageTitle}
          </Text.H1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <Text.Label className="text-[10px]">
              Live Environment • Koperasi Senopati
            </Text.Label>
          </div>
        </div>
      </div>
    </header>
  );
}
