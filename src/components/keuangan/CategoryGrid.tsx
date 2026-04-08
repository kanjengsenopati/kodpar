import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KategoriTransaksi } from '@/types';
import { FileUp, FileDown, Edit, Trash2 } from 'lucide-react';
import { ActionGrid } from "@/components/ui/action-grid";

interface CategoryGridProps {
  categories: KategoriTransaksi[];
  onEdit: (category: KategoriTransaksi) => void;
  onDelete: (category: KategoriTransaksi) => void;
}

export function CategoryGrid({ categories, onEdit, onDelete }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada kategori yang sesuai dengan filter
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-sm truncate pr-2">{category.nama}</h3>
              <Badge variant={category.jenis === 'Pemasukan' ? 'success' : 'destructive'} className="text-xs shrink-0">
                {category.jenis === 'Pemasukan' ? (
                  <FileUp className="h-2 w-2 mr-1" />
                ) : (
                  <FileDown className="h-2 w-2 mr-1" />
                )}
                {category.jenis}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {category.deskripsi || 'Tidak ada deskripsi'}
            </p>
            <div className="flex justify-center">
              <ActionGrid
                onEdit={() => onEdit(category)}
                onDelete={() => onDelete(category)}
                layout="grid"
                compact={true}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
