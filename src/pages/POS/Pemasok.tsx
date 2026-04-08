
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Pemasok } from "@/types";
import { getAllPemasok, deletePemasok } from "@/services/pemasokService";

// Import refactored components
import { PemasokForm } from "@/components/pemasok/PemasokForm";
import { PemasokTable } from "@/components/pemasok/PemasokTable";
import { SearchBar } from "@/components/pemasok/SearchBar";

export default function PemasokPage() {
  const [pemasokList, setPemasokList] = useState<Pemasok[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPemasok, setCurrentPemasok] = useState<Pemasok | null>(null);

  useEffect(() => {
    loadPemasok();
  }, []);

  const loadPemasok = () => {
    setPemasokList(getAllPemasok());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPemasok = pemasokList.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alamat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kontak?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewForm = () => {
    setCurrentPemasok(null);
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const pemasok = pemasokList.find(item => item.id === id);
    if (pemasok) {
      setCurrentPemasok(pemasok);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const result = deletePemasok(id);
    if (result) {
      toast.success("Pemasok berhasil dihapus");
      loadPemasok();
    } else {
      toast.error("Pemasok tidak dapat dihapus karena digunakan dalam transaksi");
    }
  };

  return (
    <Layout pageTitle="Data Pemasok">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Pemasok / Supplier</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewForm}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pemasok
            </Button>
          </DialogTrigger>
          <PemasokForm 
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSuccess={loadPemasok}
            currentPemasok={currentPemasok}
          />
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemasok</CardTitle>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </CardHeader>
        <CardContent>
          <PemasokTable 
            pemasokList={filteredPemasok}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
