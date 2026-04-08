
import React from 'react';
import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const H1 = ({ children, className, id }: TextProps) => (
  <h1 id={id} className={cn("text-[22px] font-bold text-slate-900 leading-tight", className)}>
    {children}
  </h1>
);

export const H2 = ({ children, className, id }: TextProps) => (
  <h2 id={id} className={cn("text-[16px] font-semibold text-slate-800 leading-snug", className)}>
    {children}
  </h2>
);

export const Amount = ({ children, className, id }: TextProps) => (
  <span id={id} className={cn("text-[18px] font-bold text-emerald-600", className)}>
    {children}
  </span>
);

export const Label = ({ children, className, id }: TextProps) => (
  <span id={id} className={cn("text-[11px] font-bold uppercase tracking-widest text-slate-400", className)}>
    {children}
  </span>
);

export const Body = ({ children, className, id }: TextProps) => (
  <p id={id} className={cn("text-[14px] font-medium text-slate-600 leading-relaxed", className)}>
    {children}
  </p>
);

export const Caption = ({ children, className, id }: TextProps) => (
  <span id={id} className={cn("text-[12px] font-normal italic text-slate-400", className)}>
    {children}
  </span>
);

export const Text = {
  H1,
  H2,
  Amount,
  Label,
  Body,
  Caption
};
