
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, FileUp, FileDown, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KategoriTransaksi } from '@/types';
import { getAllKategoriTransaksi, deleteKategoriTransaksi } from '@/services/keuangan';
import { DeleteConfirmDialog } from '@/components/keuangan/DeleteConfirmDialog';
import { CategoryGrid } from '@/components/keuangan/CategoryGrid';
import KategoriForm from '@/components/keuangan/KategoriForm';
import { toast } from 'sonner';

export default function KategoriTransaksiPage() {
  const [categories, setCategories] = useState<KategoriTransaksi[]>(getAllKategoriTransaksi());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KategoriTransaksi | null>(null);
  const [activeTab, setActiveTab] = useState('semua');

  // Filter categories based on search and tab
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.deskripsi && category.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'semua' || 
      (activeTab === 'pemasukan' && category.jenis === 'Pemasukan') ||
      (activeTab === 'pengeluaran' && category.jenis === 'Pengeluaran');
    
    return matchesSearch && matchesTab;
  });

  // Statistics
  const totalCategories = categories.length;
  const pemasukanCategories = categories.filter(c => c.jenis === 'Pemasukan').length;
  const pengeluaranCategories = categories.filter(c => c.jenis === 'Pengeluaran').length;

  // Load categories
  const loadCategories = () => {
    setCategories(getAllKategoriTransaksi());
  };

  // Handle form success
  const handleFormSuccess = () => {
    loadCategories();
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  // Handle edit
  const handleEdit = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedCategory) {
      const success = deleteKategoriTransaksi(selectedCategory.id);
      if (success) {
        toast.success('Kategori berhasil dihapus');
        loadCategories();
      } else {
        toast.error('Gagal menghapus kategori');
      }
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
    <Layout pageTitle="Kategori Transaksi">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategori Transaksi</h1>
            <p className="text-muted-foreground">Kelola kategori untuk transaksi keuangan</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Total Kategori</h2>
              <p className="text-2xl font-bold text-blue-600 mt-1">{totalCategories}</p>
              <p className="text-sm text-muted-foreground">Semua kategori</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <FileUp className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Pemasukan</h2>
              <p className="text-2xl font-bold text-green-600 mt-1">{pemasukanCategories}</p>
              <p className="text-sm text-muted-foreground">Kategori pemasukan</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <FileDown className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="mt-2 font-semibold text-lg">Pengeluaran</h2>
              <p className="text-2xl font-bold text-red-600 mt-1">{pengeluaranCategories}</p>
              <p className="text-sm text-muted-foreground">Kategori pengeluaran</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Tabs 
                  defaultValue="semua" 
                  className="w-full sm:w-auto"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="semua">Semua ({totalCategories})</TabsTrigger>
                    <TabsTrigger value="pemasukan">Pemasukan ({pemasukanCategories})</TabsTrigger>
                    <TabsTrigger value="pengeluaran">Pengeluaran ({pengeluaranCategories})</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kategori..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories Grid */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="semua" className="mt-0">
                  <CategoryGrid 
                    categories={filteredCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TabsContent>
                <TabsContent value="pemasukan" className="mt-0">
                  <CategoryGrid 
                    categories={filteredCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TabsContent>
                <TabsContent value="pengeluaran" className="mt-0">
                  <CategoryGrid 
                    categories={filteredCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </DialogTitle>
            </DialogHeader>
            <KategoriForm
              initialData={selectedCategory || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedCategory(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedCategory?.nama}
          itemType="kategori"
        />
      </div>
    </Layout>
  );
}
