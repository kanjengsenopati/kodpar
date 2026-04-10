import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, Database, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnggotaListHeaderProps {
  onResetData: () => void;
  onResetSHU: () => void;
  onLoadDemoData: () => void;
}

export function AnggotaListHeader({ onResetData, onResetSHU, onLoadDemoData }: AnggotaListHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 rounded-full h-9 px-4 shadow-sm border-none">
            <Database className="h-4 w-4 mr-2" />
            Muat Demo
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Konfirmasi Muat Data Demo
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold text-destructive underline block mb-2">PERINGATAN: DATA AKAN DIHAPUS</span>
              Tindakan ini akan **MENGHAPUS SEMUA DATA SAAT INI** (Anggota, Transaksi, Jurnal) dan menggantinya dengan data demo standar presentasi. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onLoadDemoData} className="bg-blue-600 hover:bg-blue-700 rounded-full">
              Ya, Muat Data Demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full h-9 px-4 shadow-sm border-slate-200 text-slate-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Data
            <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl p-1 shadow-xl border-none">
          <DropdownMenuItem onClick={onResetData} className="text-destructive focus:text-destructive focus:bg-red-50 rounded-lg cursor-pointer">
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset Semua Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onResetSHU} className="rounded-lg cursor-pointer">
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset Data SHU
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button asChild className="rounded-full h-9 px-4 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100">
        <Link to="/master/anggota/tambah">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Anggota
        </Link>
      </Button>
    </div>
  );
}
