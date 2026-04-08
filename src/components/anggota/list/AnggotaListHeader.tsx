
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RotateCcw, Users, AlertTriangle } from "lucide-react";
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

interface AnggotaListHeaderProps {
  onResetData: () => void;
  onResetSHU: () => void;
}

export function AnggotaListHeader({ onResetData, onResetSHU }: AnggotaListHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Anggota</h1>
        <p className="text-muted-foreground">
          Kelola informasi anggota koperasi
        </p>
      </div>
      
      <div className="flex gap-3">
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
