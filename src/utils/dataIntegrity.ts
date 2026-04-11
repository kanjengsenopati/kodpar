import { db } from "@/db/db";
import { Transaksi, Pengajuan, JadwalAngsuran } from "@/types";

export interface IntegrityIssue {
  table: string;
  id: string;
  type: "REDUNDANCY" | "ORPHAN";
  description: string;
  metadata?: any;
}

export interface IntegrityReport {
  timestamp: string;
  totalIssues: number;
  issues: IntegrityIssue[];
}

/**
 * Audit for SSOT (Single Source of Truth)
 * Checks if Transaksi or Pengajuan still store redundant data that should be looked up from Anggota.
 */
export async function auditMemberSSOT(): Promise<IntegrityIssue[]> {
  const issues: IntegrityIssue[] = [];
  
  // Check Transaksi
  const allTransaksi = await db.transaksi.toArray();
  for (const t of allTransaksi) {
    if ((t as any).anggotaNama) {
      issues.push({
        table: "transaksi",
        id: t.id,
        type: "REDUNDANCY",
        description: `Transaksi contains redundant field 'anggotaNama': ${(t as any).anggotaNama}`,
      });
    }
  }
  
  // Check Pengajuan
  const allPengajuan = await db.pengajuan.toArray();
  for (const p of allPengajuan) {
    if ((p as any).anggotaNama || (p as any).anggotaNo) {
      issues.push({
        table: "pengajuan",
        id: p.id,
        type: "REDUNDANCY",
        description: `Pengajuan contains redundant fields 'anggotaNama' or 'anggotaNo'`,
      });
    }
  }
  
  return issues;
}

/**
 * Audit for Traceability
 * Checks if records point to non-existent primary records.
 */
export async function auditTraceability(): Promise<IntegrityIssue[]> {
  const issues: IntegrityIssue[] = [];
  
  const allAnggotaIds = new Set((await db.anggota.toArray()).map(a => a.id));
  const allTransaksiIds = new Set((await db.transaksi.toArray()).map(t => t.id));
  
  // Check Transaksi -> Anggota
  const allTransaksi = await db.transaksi.toArray();
  for (const t of allTransaksi) {
    if (!allAnggotaIds.has(t.anggotaId)) {
      issues.push({
        table: "transaksi",
        id: t.id,
        type: "ORPHAN",
        description: `Transaksi references non-existent anggotaId: ${t.anggotaId}`,
        metadata: { anggotaId: t.anggotaId }
      });
    }
    
    // Check Transaksi (Angsuran) -> Pinjaman
    if (t.jenis === "Angsuran" && t.referensiPinjamanId) {
      if (!allTransaksiIds.has(t.referensiPinjamanId)) {
        issues.push({
          table: "transaksi",
          id: t.id,
          type: "ORPHAN",
          description: `Angsuran references non-existent referensiPinjamanId: ${t.referensiPinjamanId}`,
          metadata: { referensiPinjamanId: t.referensiPinjamanId }
        });
      }
    }
  }
  
  // Check Pengajuan -> Anggota
  const allPengajuan = await db.pengajuan.toArray();
  for (const p of allPengajuan) {
    if (!allAnggotaIds.has(p.anggotaId)) {
      issues.push({
        table: "pengajuan",
        id: p.id,
        type: "ORPHAN",
        description: `Pengajuan references non-existent anggotaId: ${p.anggotaId}`,
        metadata: { anggotaId: p.anggotaId }
      });
    }
  }
  
  // Check JadwalAngsuran -> Pinjaman/Anggota
  const allJadwal = await db.jadwal_angsuran.toArray();
  for (const j of allJadwal) {
    if (!allAnggotaIds.has(j.anggotaId)) {
      issues.push({
        table: "jadwal_angsuran",
        id: j.id!,
        type: "ORPHAN",
        description: `JadwalAngsuran references non-existent anggotaId: ${j.anggotaId}`,
        metadata: { anggotaId: j.anggotaId }
      });
    }
    if (!allTransaksiIds.has(j.loanId)) {
      issues.push({
        table: "jadwal_angsuran",
        id: j.id!,
        type: "ORPHAN",
        description: `JadwalAngsuran references non-existent loanId (Transaksi): ${j.loanId}`,
        metadata: { loanId: j.loanId }
      });
    }
  }
  
  return issues;
}

/**
 * Generate full integrity report
 */
export async function getIntegrityReport(): Promise<IntegrityReport> {
  const ssotIssues = await auditMemberSSOT();
  const traceIssues = await auditTraceability();
  
  const allIssues = [...ssotIssues, ...traceIssues];
  
  return {
    timestamp: new Date().toISOString(),
    totalIssues: allIssues.length,
    issues: allIssues
  };
}

/**
 * Auto-fix Orphan data by deleting them (as requested by user)
 */
export async function autoFixOrphans(): Promise<{ deletedCount: number }> {
  const issues = await auditTraceability();
  const orphans = issues.filter(i => i.type === "ORPHAN");
  let deletedCount = 0;
  
  for (const orphan of orphans) {
    try {
      if (orphan.table === "transaksi") {
        await db.transaksi.delete(orphan.id);
        deletedCount++;
      } else if (orphan.table === "pengajuan") {
        await db.pengajuan.delete(orphan.id);
        deletedCount++;
      } else if (orphan.table === "jadwal_angsuran") {
        await db.jadwal_angsuran.delete(orphan.id);
        deletedCount++;
      }
    } catch (error) {
      console.error(`Failed to delete orphan ${orphan.id} from ${orphan.table}`, error);
    }
  }
  
  return { deletedCount };
}

/**
 * Cleanup redundant fields from existing records (Clean Break)
 */
export async function cleanupRedundancies(): Promise<{ updatedCount: number }> {
  let updatedCount = 0;
  
  // Cleanup Transaksi
  const allTransaksi = await db.transaksi.toArray();
  for (const t of allTransaksi) {
    if ((t as any).anggotaNama) {
      const { anggotaNama, ...cleanT } = t as any;
      await db.transaksi.put(cleanT);
      updatedCount++;
    }
  }
  
  // Cleanup Pengajuan
  const allPengajuan = await db.pengajuan.toArray();
  for (const p of allPengajuan) {
    if ((p as any).anggotaNama || (p as any).anggotaNo) {
      const { anggotaNama, anggotaNo, ...cleanP } = p as any;
      await db.pengajuan.put(cleanP);
      updatedCount++;
    }
  }
  
  return { updatedCount };
}
