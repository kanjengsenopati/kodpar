
import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, History, Info, CheckCircle, XCircle, FileText, ZoomIn } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Pengajuan } from "@/types";
import { useNavigate } from "react-router-dom";
import { getPengaturan } from "@/services/pengaturanService";
import { cn } from "@/lib/utils";
import { MemberName } from "@/components/anggota/MemberName";
import { useMemberLookup } from "@/hooks/useMemberLookup";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";
import { Badge } from "@/components/ui/badge";
import * as Text from "@/components/ui/text";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { approvePengajuan, rejectPengajuan } from "@/services/pengajuanService";
import { toast } from "sonner";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";

interface ExpandablePengajuanRowProps {
  item: Pengajuan;
  onDelete: (id: string) => void;
  colSpan: number;
  index: number;
  onStatusChange?: () => void;
}

export function ExpandablePengajuanRow({ item, onDelete, colSpan, index, onStatusChange }: ExpandablePengajuanRowProps) {
  const { member } = useMemberLookup(item.anggotaId);
  const [isOpen, setIsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const pengaturan = getPengaturan();

  const getStatusBadge = (status: string) => {
    const cls = status === "Menunggu" ? "bg-yellow-50 text-yellow-600" :
                status === "Disetujui" ? "bg-emerald-50 text-emerald-600" :
                "bg-red-50 text-red-600";
    return (
      <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", cls)}>
        {status}
      </div>
    );
  };

  const getJenisBadge = (jenis: string) => {
    const cls = jenis === "Simpan" ? "bg-blue-50 text-blue-600" :
                jenis === "Pinjam" ? "bg-purple-50 text-purple-600" :
                "bg-orange-50 text-orange-600";
    return (
      <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", cls)}>
        {jenis}
      </div>
    );
  };

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Setujui pengajuan ini?")) return;
    
    setIsProcessing(true);
    try {
      const success = await approvePengajuan(item.id);
      if (success) {
        toast.success("Pengajuan berhasil disetujui");
        onStatusChange?.();
      } else {
        toast.error("Gagal menyetujui pengajuan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyetujui");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!rejectReason.trim()) {
      toast.error("Harap isi alasan penolakan");
      return;
    }
    
    setIsProcessing(true);
    try {
      const success = await rejectPengajuan(item.id, rejectReason);
      if (success) {
        toast.success("Pengajuan telah ditolak");
        setShowRejectInput(false);
        onStatusChange?.();
      } else {
        toast.error("Gagal menolak pengajuan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menolak");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <TableRow
        className="group cursor-pointer border-slate-50 hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="text-center font-medium text-slate-400 text-xs text-nowrap">
          {index}
        </TableCell>
        <TableCell className="w-8 px-2">
          {isOpen
            ? <ChevronDown className="h-4 w-4 text-slate-400" />
            : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </TableCell>
        <TableCell>
          <Text.Caption className="not-italic font-bold text-slate-600 uppercase">
            {item.nomorPengajuan || (item.id.length > 8 ? item.id.substring(0,8) : item.id)}
          </Text.Caption>
        </TableCell>
        <TableCell><Text.Body className="text-xs text-nowrap">{formatDate(item.tanggal)}</Text.Body></TableCell>
        <TableCell><MemberName memberId={item.anggotaId} className="font-bold text-slate-800 text-nowrap" showId={true} /></TableCell>
        <TableCell>
          <Badge variant="secondary" className="bg-slate-50 text-slate-500 rounded px-1.5 py-0.5 text-[10px] border-none font-bold uppercase">
            {getCategoryNameSync(item.kategori)}
          </Badge>
        </TableCell>
        <TableCell><Text.Amount className="text-sm font-bold">{formatCurrency(item.jumlah)}</Text.Amount></TableCell>
        <TableCell>{getStatusBadge(item.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
          <div className="flex justify-end gap-1.5 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(`/transaksi/pengajuan/${item.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-slate-50/20 hover:bg-slate-50/20 shadow-inner">
          <TableCell colSpan={colSpan + 1} className="p-0 border-none">
            <div className="px-10 py-6 border-l-4 border-slate-100 bg-white/40 backdrop-blur-sm animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Summary Panel */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-50/50 rounded-[24px] p-5 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <Info className="h-3 w-3 text-blue-600" />
                        </div>
                        <Text.H2 className="text-sm font-bold m-0 p-0">Detail Pengajuan</Text.H2>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-slate-200 text-slate-400 bg-white">
                        SYS: {item.id.substring(0,8)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                        <Text.Label className="text-[10px]">KATEGORI</Text.Label>
                        <Text.Body className="text-xs font-bold text-slate-700">{getCategoryNameSync(item.kategori)}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text.Label className="text-[10px]">ID PENGAJUAN</Text.Label>
                        <Text.Body className="text-xs font-bold text-blue-600">{item.nomorPengajuan || "PENDING"}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                        <Text.Label className="text-[10px]">PEMOHON</Text.Label>
                        <div className="flex flex-col items-end">
                          <MemberName memberId={item.anggotaId} className="text-xs font-bold text-slate-800" showId={true} />
                          <Text.Caption className="text-[8px] opacity-40 font-mono italic">{item.anggotaId}</Text.Caption>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-100">
                        <Text.Label className="block mb-1 text-[10px]">CATATAN TAMBAHAN</Text.Label>
                        <Text.Body className="text-[12px] italic text-slate-500 leading-relaxed">
                          {item.keterangan || "-"}
                        </Text.Body>
                      </div>

                      {/* Document Thumbnails */}
                      {item.dokumen && item.dokumen.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <Text.Label className="block mb-2 text-[10px]">LAMPIRAN DOKUMEN</Text.Label>
                          <div className="flex flex-wrap gap-2">
                            {item.dokumen.filter(d => d.file).map((doc) => (
                              <Dialog key={doc.id}>
                                <DialogTrigger asChild>
                                  <div className="group relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden cursor-zoom-in hover:border-blue-400 transition-all">
                                    <img 
                                      src={doc.file!} 
                                      alt={doc.jenis} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                    />
                                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ZoomIn className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl rounded-[24px]">
                                  <DialogHeader>
                                    <DialogTitle>{doc.jenis} - <MemberName memberId={item.anggotaId} className="inline" /></DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 flex justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                    <img 
                                      src={doc.file!} 
                                      alt={doc.jenis} 
                                      className="max-w-full max-h-[70vh] object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions (Setujui/Tolak) */}
                  {item.status === "Menunggu" && (
                    <div className="pt-2 space-y-3">
                      {!showRejectInput ? (
                        <div className="grid grid-cols-2 gap-2">
                           <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-9 text-xs"
                            onClick={handleApprove}
                            disabled={isProcessing}
                          >
                            <CheckCircle className="w-3 h-3 mr-1.5" /> SETUJUI
                          </Button>
                          <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 font-bold rounded-xl h-9 text-xs"
                            onClick={() => setShowRejectInput(true)}
                            disabled={isProcessing}
                          >
                            <XCircle className="w-3 h-3 mr-1.5" /> TOLAK
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                          <Text.Label className="text-red-600 text-[10px]">ALASAN PENOLAKAN</Text.Label>
                          <Textarea 
                            placeholder="Tulis alasan singkat..." 
                            className="min-h-[80px] text-xs rounded-lg border-red-200 focus-visible:ring-red-300"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700 h-8 text-xs font-bold"
                              onClick={handleReject}
                              disabled={isProcessing}
                            >
                              KONFIRMASI TOLAK
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs font-bold"
                              onClick={() => setShowRejectInput(false)}
                            >
                              BATAL
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="link"
                    className="text-slate-400 hover:text-blue-600 text-[11px] font-bold h-auto p-0 flex items-center gap-1"
                    onClick={() => navigate(`/transaksi/pengajuan/${item.id}`)}
                  >
                    <ZoomIn className="w-3 h-3" /> Buka Detail Lengkap →
                  </Button>
                </div>

                {/* History Table */}
                <div className="md:col-span-8">
                  <NestedDetailTable 
                    title="Riwayat Status & Validasi"
                    data={item.history || [{ tgl: item.createdAt, aksi: "Diajukan", oleh: "System", ket: "Record created" }]}
                    columns={[
                      { 
                        header: "Waktu Update", 
                        accessor: "tanggal",
                        render: (val) => formatDate(val)
                      },
                      { 
                        header: "Aktivitas", 
                        accessor: "aksi",
                        render: (val) => (
                           <div className="flex items-center gap-1.5">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                val === "Disetujui" ? "bg-emerald-500" : 
                                val === "Ditolak" ? "bg-red-500" : "bg-blue-400"
                              )} />
                              <Text.Body className="text-xs font-semibold uppercase">{val}</Text.Body>
                           </div>
                        )
                      },
                      { header: "Oleh", accessor: "oleh" },
                      { header: "Keterangan Petugas", accessor: "keterangan", className: "italic text-slate-400 text-xs" }
                    ]}
                  />
                  {item.status === "Ditolak" && item.alasanPenolakan && (
                    <div className="mt-4 p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                       <Text.Label className="text-red-600 text-[10px] block mb-1">ALASAN PENOLAKAN FINAL</Text.Label>
                       <Text.Body className="text-xs text-red-800 italic">"{item.alasanPenolakan}"</Text.Body>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
