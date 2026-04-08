
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChartOfAccount } from "@/types/akuntansi";
import { MoreHorizontal, Edit, Trash2, FolderOpen, File, Hash, Tag, Building2 } from "lucide-react";

interface COACardProps {
  account: ChartOfAccount;
  onEdit: (account: ChartOfAccount) => void;
  onDelete: (account: ChartOfAccount) => void;
}

export function COACard({ account, onEdit, onDelete }: COACardProps) {
  const getJenisColor = (jenis: string) => {
    const colors = {
      ASET: "bg-blue-100 text-blue-800",
      KEWAJIBAN: "bg-red-100 text-red-800", 
      MODAL: "bg-green-100 text-green-800",
      PENDAPATAN: "bg-purple-100 text-purple-800",
      BEBAN: "bg-orange-100 text-orange-800"
    };
    return colors[jenis as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getLevelIndent = (level: number) => {
    return `pl-${Math.min(level * 4, 16)}`;
  };

  return (
    <Card className={`transition-all hover:shadow-md ${getLevelIndent(account.level)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
              {account.isGroup ? (
                <FolderOpen className="h-5 w-5 text-gray-600" />
              ) : (
                <File className="h-5 w-5 text-gray-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{account.nama}</h3>
                {account.isGroup && (
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    Grup
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{account.kode}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>Level {account.level}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getJenisColor(account.jenis)}>
              {account.jenis}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(account)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(account)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Kategori</div>
            <div className="font-medium">{account.kategori}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Saldo Normal</div>
            <div className="font-medium">
              <Badge variant={account.saldoNormal === 'DEBIT' ? 'default' : 'secondary'}>
                {account.saldoNormal}
              </Badge>
            </div>
          </div>
        </div>

        {account.deskripsi && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-muted-foreground text-xs mb-1">Deskripsi</div>
            <div className="text-sm">{account.deskripsi}</div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Dibuat: {new Date(account.createdAt).toLocaleDateString('id-ID')}
          {account.updatedAt !== account.createdAt && (
            <span> • Diperbarui: {new Date(account.updatedAt).toLocaleDateString('id-ID')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
