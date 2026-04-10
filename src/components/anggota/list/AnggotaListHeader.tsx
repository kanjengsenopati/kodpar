import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, AlertTriangle, Database } from "lucide-react";
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
import * as Text from "@/components/ui/text";

interface AnggotaListHeaderProps {
  onResetData: () => void;
  onResetSHU: () => void;
  onLoadDemoData: () => void;
}

export function AnggotaListHeader({ onResetData, onResetSHU, onLoadDemoData }: AnggotaListHeaderProps) {
  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex gap-2.5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700">
              <Database className="h-4 w-4 mr-2" />
              Muat Data Demo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={onLoadDemoData} className="bg-blue-600 hover:bg-blue-700">
                Ya, Muat Data Demo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Konfirmasi Reset Data
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus semua data anggota dan tidak dapat dibatalkan. 
                Apakah Anda yakin ingin melanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={onResetData} className="bg-destructive hover:bg-destructive/90">
                Ya, Reset Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset SHU
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Konfirmasi Reset SHU
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan mereset semua data SHU anggota dan tidak dapat dibatalkan. 
                Apakah Anda yakin ingin melanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={onResetSHU} className="bg-destructive hover:bg-destructive/90">
                Ya, Reset SHU
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button asChild>
          <Link to="/master/anggota/tambah">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Anggota
          </Link>
        </Button>
      </div>
    </div>
  );
}
