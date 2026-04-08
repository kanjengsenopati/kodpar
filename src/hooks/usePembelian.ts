
import { useState, useEffect } from "react";
import { Pembelian, PembelianItem } from "@/types";
import { toast } from "@/components/ui/sonner";
import { 
  getAllPembelian, 
  createPembelian, 
  updatePembelian, 
  deletePembelian
} from "@/services/pembelianService";
import { getAllPemasok } from "@/services/pemasokService";

export function usePembelian() {
  const [pembelianList, setPembelianList] = useState<Pembelian[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [pemasokList, setPemasokList] = useState<any[]>([]);
  const [currentPembelian, setCurrentPembelian] = useState<Pembelian | null>(null);
  const [selectedPembelianId, setSelectedPembelianId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<Pembelian>>({
    tanggal: new Date().toISOString().split("T")[0],
    pemasok: "",
    items: [],
    subtotal: 0,
    diskon: 0,
    ppn: 0,
    total: 0,
    status: "proses",
    catatan: ""
  });
  
  useEffect(() => {
    loadPembelian();
    setPemasokList(getAllPemasok());
  }, []);
  
  const loadPembelian = () => {
    setPembelianList(getAllPembelian());
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredPembelian = pembelianList.filter(item => 
    item.nomorTransaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pemasok.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const openNewForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      pemasok: "",
      items: [],
      subtotal: 0,
      diskon: 0,
      ppn: 0,
      total: 0,
      status: "proses",
      catatan: ""
    });
    setCurrentPembelian(null);
    setIsFormOpen(true);
  };
  
  const openEditForm = (id: string) => {
    const pembelian = pembelianList.find(item => item.id === id);
    if (pembelian) {
      setFormData({
        tanggal: pembelian.tanggal,
        pemasokId: pembelian.pemasokId,
        pemasok: pembelian.pemasok,
        items: [...pembelian.items],
        subtotal: pembelian.subtotal,
        diskon: pembelian.diskon || 0,
        ppn: pembelian.ppn || 0,
        total: pembelian.total,
        status: pembelian.status,
        catatan: pembelian.catatan || ""
      });
      setCurrentPembelian(pembelian);
      setIsFormOpen(true);
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedPembelianId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const openDetailDialog = (id: string) => {
    const pembelian = pembelianList.find(item => item.id === id);
    if (pembelian) {
      setCurrentPembelian(pembelian);
      setIsDetailDialogOpen(true);
    }
  };
  
  const handleDelete = () => {
    if (selectedPembelianId) {
      const result = deletePembelian(selectedPembelianId);
      if (result) {
        toast.success("Pembelian berhasil dihapus");
        loadPembelian();
      } else {
        toast.error("Gagal menghapus pembelian");
      }
      setIsDeleteDialogOpen(false);
    }
  };
  
  const calculateTotal = () => {
    const subtotal = formData.items?.reduce((sum, item) => sum + item.total, 0) || 0;
    const diskon = formData.diskon || 0;
    const ppn = formData.ppn || 0;
    
    const total = subtotal - diskon + ppn;
    
    setFormData({
      ...formData,
      subtotal,
      total
    });
  };
  
  const handleSave = () => {
    if (!formData.pemasok || !formData.items?.length) {
      toast.error("Silakan lengkapi data pembelian");
      return;
    }
    
    if (currentPembelian) {
      // Update existing purchase
      const updatedPembelian = updatePembelian(currentPembelian.id, formData);
      if (updatedPembelian) {
        toast.success("Pembelian berhasil diperbarui");
        loadPembelian();
        setIsFormOpen(false);
      } else {
        toast.error("Gagal memperbarui pembelian");
      }
    } else {
      // Create new purchase
      createPembelian(formData as Omit<Pembelian, "id" | "nomorTransaksi" | "createdAt">);
      toast.success("Pembelian baru berhasil ditambahkan");
      loadPembelian();
      setIsFormOpen(false);
    }
  };
  
  const handleCompletePurchase = () => {
    if (currentPembelian) {
      updatePembelian(currentPembelian.id, { status: "selesai" });
      loadPembelian();
      setIsDetailDialogOpen(false);
      toast.success("Status pembelian berhasil diperbarui");
    }
  };

  return {
    pembelianList: filteredPembelian,
    searchQuery,
    isFormOpen,
    isDeleteDialogOpen,
    isDetailDialogOpen,
    currentPembelian,
    formData,
    pemasokList,
    handleSearch,
    openNewForm,
    openEditForm,
    openDeleteDialog,
    openDetailDialog,
    setIsFormOpen,
    setIsDeleteDialogOpen,
    setIsDetailDialogOpen,
    handleDelete,
    handleSave,
    handleCompletePurchase,
    setFormData,
    calculateTotal
  };
}
