
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Wallet, 
  CreditCard, 
  History, 
  Upload, 
  CheckCircle2, 
  Clock, 
  XCircle,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
  RefreshCcw,
  Plus
} from "lucide-react";
import { getCurrentUser } from '@/services/auth/sessionManagement';
import { getAnggotaById, updateAnggota } from '@/services/anggotaService';
import { getPengajuanByAnggotaId, createPengajuan } from '@/services/pengajuanService';
import { calculateTotalSimpanan, calculateTotalPinjaman } from "@/services/transaksiService";
import { getActiveLoansByAnggotaId } from '@/services/transaksiService';
import { getActiveJenisByType } from '@/services/jenisService';
import { formatCurrency } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/useIsMobile';
import * as Text from "@/components/ui/text";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function MemberDashboard() {
  const user = getCurrentUser();
  const isMobile = useIsMobile();
  const [anggota, setAnggota] = useState<any>(null);
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [stats, setStats] = useState({ simpanan: 0, pinjaman: 0 });
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form States
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ simpanan: any[], pinjaman: any[] }>({ simpanan: [], pinjaman: [] });

  const loadData = async (silent = false) => {
    if (!user?.anggotaId) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [anggotaData, pengajuanData, totalSimp, totalPinj, activeL, simpananCats, pinjamanCats] = await Promise.all([
        getAnggotaById(user.anggotaId),
        getPengajuanByAnggotaId(user.anggotaId),
        calculateTotalSimpanan(user.anggotaId),
        calculateTotalPinjaman(user.anggotaId),
        getActiveLoansByAnggotaId(user.anggotaId),
        getActiveJenisByType("Simpanan"),
        getActiveJenisByType("Pinjaman")
      ]);

      setAnggota(anggotaData);
      setPengajuan(pengajuanData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setStats({ simpanan: totalSimp, pinjaman: totalPinj });
      setActiveLoans(activeL);
      setCategories({ simpanan: simpananCats, pinjaman: pinjamanCats });
    } catch (error) {
      console.error("Failed to load member data:", error);
      toast.error("Gagal memuat data terbaru");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, buktiTransfer: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = (type: string) => {
    setActiveDialog(type);
    setImagePreview(null);
    if (type === 'profil') {
      setFormData({
        nama: anggota.nama,
        email: anggota.email || user.email,
        telepon: anggota.telepon || "",
        alamat: anggota.alamat || ""
      });
    } else {
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: 0,
        kategori: "",
        keterangan: ""
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.anggotaId) return;

    try {
      if (activeDialog === 'profil') {
        const updated = await updateAnggota(user.anggotaId, formData);
        if (updated) {
          toast.success("Profil berhasil diperbarui");
          setAnggota(updated);
        }
      } else {
        const pengajuanType = 
          activeDialog === 'simpan' ? 'Simpan' : 
          activeDialog === 'pinjam' ? 'Pinjam' : 'Angsuran';
        
        if (formData.jumlah <= 0) {
          toast.error("Jumlah harus lebih dari 0");
          return;
        }

        if ((activeDialog === 'simpan' || activeDialog === 'angsuran') && !formData.buktiTransfer) {
          toast.error("Wajib mengunggah bukti transfer");
          return;
        }

        const newPengajuan = await createPengajuan({
          anggotaId: user.anggotaId,
          jenis: pengajuanType as any,
          jumlah: Number(formData.jumlah),
          tanggal: formData.tanggal,
          status: "Menunggu",
          kategori: formData.kategori || (activeDialog === 'angsuran' ? 'Angsuran Pinjaman' : ''),
          keterangan: formData.keterangan,
          buktiTransfer: formData.buktiTransfer,
          referensiPinjamanId: formData.referensiPinjamanId
        });

        if (newPengajuan) {
          toast.success(`Pengajuan ${activeDialog} berhasil dikirim`);
          loadData(true);
        }
      }
      setActiveDialog(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan saat memproses data");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Memuat data dashboard...</div>;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Greetings Section */}
      <section className="px-1 flex justify-between items-end">
        <div>
          <Text.H1>Halo, {anggota?.nama || user?.nama}!</Text.H1>
          <Text.Body className="text-slate-500">Selamat datang kembali di dashboard anggota.</Text.Body>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full bg-white border-slate-200"
          onClick={() => loadData(true)}
          disabled={refreshing}
        >
          <RefreshCcw size={14} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <PiggyBank size={24} />
            </div>
            <Text.Label className="text-white opacity-80 font-bold uppercase tracking-wider">Total Simpanan</Text.Label>
          </div>
          <Text.H1 className="text-white mb-1">{formatCurrency(stats.simpanan)}</Text.H1>
          <Text.Caption className="text-white opacity-80 not-italic">Saldo akumulasi saat ini</Text.Caption>
        </Card>

        <Card className="p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <CreditCard size={24} />
            </div>
            <Text.Label className="text-white opacity-80 font-bold uppercase tracking-wider">Total Pinjaman</Text.Label>
          </div>
          <Text.H1 className="text-white mb-1">{formatCurrency(stats.pinjaman)}</Text.H1>
          <Text.Caption className="text-white opacity-80 not-italic">{activeLoans.length} pinjaman aktif</Text.Caption>
        </Card>
      </div>

      {/* Quick Actions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <Text.H2>Aksi Cepat</Text.H2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'profil', label: "Update Profil", icon: User, color: "bg-slate-100 text-slate-600" },
            { id: 'simpan', label: "Setor Simpanan", icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
            { id: 'pinjam', label: "Ajukan Pinjam", icon: ArrowUpRight, color: "bg-blue-100 text-blue-600" },
            { id: 'angsuran', label: "Bayar Cicilan", icon: ArrowDownRight, color: "bg-amber-100 text-amber-600" },
          ].map((action, idx) => (
            <Button 
              key={idx} 
              variant="outline" 
              className="h-auto py-5 flex flex-col items-center gap-2 rounded-[24px] border-none shadow-[0_4px_15px_rgb(0,0,0,0.02)] hover:shadow-md transition-all active:scale-95 bg-white"
              onClick={() => handleAction(action.id)}
            >
              <div className={`p-3 rounded-2xl ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-[13px] font-bold text-slate-700">{action.label}</span>
            </Button>
          ))}
        </div>
      </section>

      {/* Application History */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <Text.H2>Riwayat Pengajuan</Text.H2>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold hover:bg-blue-50">Lihat Semua</Button>
        </div>
        
        <div className="space-y-3">
          {pengajuan.length === 0 ? (
            <Card className="p-8 text-center rounded-[24px] border-dashed border-2 border-slate-200 bg-transparent">
              <History className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">Belum ada pengajuan aktif</p>
            </Card>
          ) : (
            pengajuan.slice(0, 5).map((item) => (
              <Card key={item.id} className="p-4 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    item.jenis === 'Simpan' ? 'bg-emerald-50 text-emerald-600' : 
                    item.jenis === 'Pinjam' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {item.jenis === 'Simpan' ? <PiggyBank size={18} /> : <CreditCard size={18} />}
                  </div>
                  <div>
                    <Text.H2 className="text-sm">{item.jenis} - {item.kategori}</Text.H2>
                    <Text.Caption className="text-[11px] not-italic">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text.Caption>
                  </div>
                </div>
                
                <div className="text-right">
                  <Text.Amount className="text-sm block">{formatCurrency(item.jumlah)}</Text.Amount>
                  <div className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Disetujui' ? 'text-emerald-600' : 
                    item.status === 'Menunggu' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {item.status === 'Disetujui' ? <CheckCircle2 size={10} strokeWidth={2.5} /> : 
                     item.status === 'Menunggu' ? <Clock size={10} strokeWidth={2.5} /> : <XCircle size={10} strokeWidth={2.5} />}
                    {item.status}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* MODALS / DIALOGS */}
      <Dialog open={!!activeDialog} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl overflow-hidden p-0">
          <form onSubmit={handleSubmit}>
            <div className={`p-6 bg-gradient-to-br transition-all ${
              activeDialog === 'profil' ? 'from-slate-600 to-slate-800' :
              activeDialog === 'simpan' ? 'from-emerald-500 to-emerald-700' :
              activeDialog === 'pinjam' ? 'from-blue-500 to-blue-700' : 'from-amber-500 to-amber-700'
            } text-white`}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  {activeDialog === 'profil' && <User />}
                  {activeDialog === 'simpan' && <Wallet />}
                  {activeDialog === 'pinjam' && <ArrowUpRight />}
                  {activeDialog === 'angsuran' && <ArrowDownRight />}
                  {activeDialog?.toUpperCase()}
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  {activeDialog === 'profil' ? 'Perbarui informasi kontak dan alamat Anda.' : 'Kirim pengajuan transaksi baru untuk disetujui pengurus.'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4 bg-white">
              {activeDialog === 'profil' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" value={formData.nama || ""} disabled className="bg-slate-50 border-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email || ""} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="rounded-xl border-slate-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">No. Telepon</Label>
                      <Input 
                        id="telepon" 
                        value={formData.telepon || ""} 
                        onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                        className="rounded-xl border-slate-100" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <Textarea 
                      id="alamat" 
                      value={formData.alamat || ""} 
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      className="rounded-xl border-slate-100" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggal">Tanggal</Label>
                      <Input id="tanggal" type="date" value={formData.tanggal || ""} disabled className="bg-slate-50 border-none" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jumlah">Nominal (Rp)</Label>
                      <Input 
                        id="jumlah" 
                        type="number" 
                        required
                        value={formData.jumlah || ""} 
                        onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                        className="rounded-xl border-slate-100 font-bold text-slate-800" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    {activeDialog === 'angsuran' ? (
                      <Select 
                        value={formData.referensiPinjamanId || ""} 
                        onValueChange={(val) => setFormData({...formData, referensiPinjamanId: val, kategori: 'Angsuran Pinjaman'})}
                      >
                        <SelectTrigger className="rounded-xl border-slate-100">
                          <SelectValue placeholder="Pilih Pinjaman Aktif" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeLoans.length === 0 ? (
                            <SelectItem value="none" disabled>Tidak ada pinjaman aktif</SelectItem>
                          ) : (
                            activeLoans.map(loan => (
                              <SelectItem key={loan.id} value={loan.id}>
                                {loan.kategori} - {formatCurrency(loan.jumlah)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select 
                        value={formData.kategori || ""} 
                        onValueChange={(val) => setFormData({...formData, kategori: val})}
                      >
                        <SelectTrigger className="rounded-xl border-slate-100">
                          <SelectValue placeholder={`Pilih Jenis ${activeDialog === 'simpan' ? 'Simpanan' : 'Pinjaman'}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(activeDialog === 'simpan' ? categories.simpanan : categories.pinjaman).map(cat => (
                            <SelectItem key={cat.id} value={cat.nama}>{cat.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {(activeDialog === 'simpan' || activeDialog === 'angsuran') && (
                    <div className="space-y-2">
                      <Label>Bukti Transfer</Label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer group">
                          <div className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                            imagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                          }`}>
                            {imagePreview ? (
                              <div className="relative w-full aspect-video">
                                <img src={imagePreview} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                                  <Camera className="text-white" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="text-slate-400 mb-2 group-hover:text-blue-500 group-hover:bounce" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Klik untuk upload bukti</span>
                              </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                    <Textarea 
                      id="keterangan" 
                      placeholder="Tambahkan catatan jika perlu..."
                      value={formData.keterangan || ""} 
                      onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                      className="rounded-xl border-slate-100" 
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <Button type="button" variant="ghost" className="flex-1 rounded-2xl" onClick={() => setActiveDialog(null)}>
                Batal
              </Button>
              <Button type="submit" className={`flex-1 rounded-2xl ${
                activeDialog === 'profil' ? 'bg-slate-800' :
                activeDialog === 'simpan' ? 'bg-emerald-600 hover:bg-emerald-700' :
                activeDialog === 'pinjam' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}>
                {activeDialog === 'profil' ? 'Simpan' : 'Kirim Pengajuan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

