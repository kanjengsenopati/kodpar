import { useState } from "react";
import { ShieldCheck, AlertCircle, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIntegrityReport, autoFixOrphans, cleanupRedundancies, IntegrityReport } from "@/utils/dataIntegrity";
import { toast } from "sonner";
import * as Text from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export function DataIntegrityDashboard() {
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const newReport = await getIntegrityReport();
      setReport(newReport);
      if (newReport.totalIssues === 0) {
        toast.success("Audit Selesai: Semua data dalam kondisi SSOT & Terintegrasi");
      } else {
        toast.warning(`Audit Selesai: Ditemukan ${newReport.totalIssues} inkonsistensi data`);
      }
    } catch (error) {
      toast.error("Gagal menjalankan audit data");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleFixOrphans = async () => {
    if (!confirm("Hapus permanen semua data orphan (Pinjaman/Angsuran yang tidak memiliki Anggota)?")) return;
    
    setIsFixing(true);
    try {
      const { deletedCount } = await autoFixOrphans();
      toast.success(`Berhasil menghapus ${deletedCount} data orphan`);
      await handleAudit();
    } catch (error) {
      toast.error("Gagal membersihkan data orphan");
    } finally {
      setIsFixing(false);
    }
  };

  const handleCleanupRedundancy = async () => {
    setIsFixing(true);
    try {
      const { updatedCount } = await cleanupRedundancies();
      toast.success(`Berhasil membersihkan redundancy dari ${updatedCount} records`);
      await handleAudit();
    } catch (error) {
      toast.error("Gagal membersihkan data redundansi");
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="border-slate-100 shadow-sm rounded-[24px] overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="text-blue-600 h-5 w-5" />
              Data Lineage Audit & SSOT
            </CardTitle>
            <CardDescription>
              Pastikan integritas data anggota dan alur penelusuran keuangan.
            </CardDescription>
          </div>
          <Button 
            onClick={handleAudit} 
            disabled={isAuditing}
            className="rounded-xl gap-2 h-9 bg-blue-600 hover:bg-blue-700"
          >
            {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Jalankan Audit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {report ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${report.totalIssues > 0 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {report.totalIssues > 0 ? (
                    <ShieldAlert className="text-amber-600 h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="text-emerald-600 h-5 w-5" />
                  )}
                  <Text.H2 className="text-sm m-0">Status Integritas</Text.H2>
                </div>
                <p className="text-xs text-slate-600">
                  {report.totalIssues > 0 
                    ? `Ditemukan ${report.totalIssues} masalah yang memerlukan perhatian.`
                    : "Semua data sinkron dan mematuhi aturan SSOT."}
                </p>
              </div>
              
              <div className="p-4 rounded-2xl border bg-slate-50/50 border-slate-100 flex flex-col justify-between gap-3">
                <Text.Label className="text-[10px]">TINDAKAN PERBAIKAN</Text.Label>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 rounded-lg text-red-600 border-red-100 hover:bg-red-50 gap-2 h-8 text-[11px]"
                    onClick={handleFixOrphans}
                    disabled={isFixing || !report.issues.some(i => i.type === "ORPHAN")}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Bersihkan Orphan
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 gap-2 h-8 text-[11px]"
                    onClick={handleCleanupRedundancy}
                    disabled={isFixing || !report.issues.some(i => i.type === "REDUNDANCY")}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Clean Break SSOT
                  </Button>
                </div>
              </div>
            </div>

            {report.totalIssues > 0 && (
              <div className="space-y-3">
                <Text.Label className="text-slate-400">DETAIL TEMUAN AUDIT</Text.Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {report.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 text-xs">
                      {issue.type === "ORPHAN" ? (
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      ) : (
                        <RefreshCw className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <span className="font-bold uppercase text-[10px] text-slate-400">{issue.table} #{issue.id.substring(0, 8)}</span>
                          <Badge variant="outline" className={`text-[9px] h-4 ${issue.type === 'ORPHAN' ? 'border-red-100 text-red-600' : 'border-amber-100 text-amber-600'}`}>
                            {issue.type}
                          </Badge>
                        </div>
                        <p className="text-slate-600 leading-snug">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
            <Text.Body>Klik tombol "Jalankan Audit" untuk memvalidasi integritas data.</Text.Body>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
