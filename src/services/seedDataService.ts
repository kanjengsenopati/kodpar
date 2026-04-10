import { db } from "@/db/db";
import { seedManufakturData } from "./manufaktur/seedManufakturData";
import { seedRetailData } from "./retail/seedRetailData";
import { Anggota } from "@/types/anggota";
import { Transaksi, JadwalAngsuran } from "@/types/transaksi";
import { JurnalEntry } from "@/types/akuntansi";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function makeId(prefix: string, n: number, pad = 4): string {
  return `${prefix}${String(n).padStart(pad, "0")}`;
}

// ─── Clear All Data ───────────────────────────────────────────────────────────

/**
 * Wipe all core tables and clear SHU caches from localStorage.
 * Sequential awaits (not a single transaction) avoids TransactionInactiveError
 * that occurs when mixing table.clear() with unrelated async work.
 */
export async function clearAllData(): Promise<void> {
  console.log("🧹 Clearing all data from IndexedDB...");
  await db.open();
  await db.anggota.clear();
  await db.transaksi.clear();
  await db.coa.clear();
  await db.jurnal.clear();
  await db.pengajuan.clear();
  await db.jadwal_angsuran.clear();

  // Clear ALL relevant localStorage caches
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("shu_result_") ||
      key === "centralized_sync_tracker" ||
      key === "recent_sync_tracker" ||
      key === "koperasi_seed_v2_indexeddb"
    ) {
      localStorage.removeItem(key);
    }
  });
  console.log("✅ All tables cleared (including jadwal_angsuran).");
}

// ─── Member Seed Data ─────────────────────────────────────────────────────────

const MEMBER_TEMPLATES: Omit<Anggota, "id" | "createdAt" | "updatedAt">[] = [
  { nama: "MARIYEM",                 nip: "197201011998031001", alamat: "DESA JATILOR",      noHp: "0812345678",   jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SDN Jatilor 01",       email: "mariyem@example.com",          keluarga: [] },
  { nama: "MASKUN ROZAK",            nip: "198201011998031002", alamat: "DESA BRINGIN",      noHp: "0823456789",   jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN Bringin",          email: "maskun.rozak@example.com",     keluarga: [] },
  { nama: "AHMAD NURALIMIN",         nip: "198801011998031003", alamat: "DESA KLAMPOK",      noHp: "08345678912",  jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN Klampok 01",       email: "ahmad.nuralimin@example.com",  keluarga: [] },
  { nama: "DJAKA KUMALATARTO, S.Pd", nip: "197002161210012345", alamat: "Desa Ketitang",     noHp: "08123456789",  jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SD Negeri Ketitang",   email: "djaka.kumalatarto@example.com",keluarga: [] },
  { nama: "SITI AMINAH",             nip: "198505052010012001", alamat: "DESA TEGOWANU",     noHp: "081111222333", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SMPN 1 Tegowanu",      email: "siti.aminah@example.com",      keluarga: [] },
  { nama: "BAMBANG SUDARMONO",       nip: "197806121999031002", alamat: "DESA GUBUG",        noHp: "081222333444", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN 2 Gubug",          email: "bambang.s@example.com",        keluarga: [] },
  { nama: "SRI WAHYUNI",             nip: "198007152005012003", alamat: "DESA PENAWANGAN",   noHp: "081333444555", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "Dinas Pendidikan",     email: "sri.wahyuni@example.com",      keluarga: [] },
  { nama: "SUPARMAN",                nip: "197508202000031001", alamat: "DESA TOROH",        noHp: "081444555666", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SMPN 2 Toroh",         email: "suparman@example.com",         keluarga: [] },
  { nama: "ANI SURYANI",             nip: "199009252015012005", alamat: "DESA WIROSARI",     noHp: "081555666777", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SDN 1 Wirosari",       email: "ani.suryani@example.com",      keluarga: [] },
  { nama: "HENDRA KUSUMA",           nip: "198310302008011002", alamat: "DESA TAWANGHARJO",  noHp: "081666777888", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN Tawangharjo",      email: "hendra.k@example.com",         keluarga: [] },
  { nama: "LIDIAWATI",               nip: "198711152011032001", alamat: "DESA NGREBO",       noHp: "081777888999", jenisKelamin: "P", agama: "KRISTEN", status: "active", unitKerja: "SMPN Ngrebo",          email: "lidia@example.com",            keluarga: [] },
  { nama: "BUDI SANTOSO",            nip: "197212201995031003", alamat: "DESA PULOKULON",    noHp: "081888999000", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN 1 Pulokulon",      email: "budi.s@example.com",           keluarga: [] },
  { nama: "RESTU ADJI",              nip: "199301102018011001", alamat: "DESA KRADENAN",     noHp: "081999000111", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "Dinas Pendidikan",     email: "restu@example.com",            keluarga: [] },
  { nama: "DIAN PUSPITA",            nip: "198902142013032002", alamat: "DESA GABUS",        noHp: "081000111222", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SDN 2 Gabus",          email: "dian.p@example.com",           keluarga: [] },
  { nama: "JOKO TINGKIR",            nip: "197603182002011001", alamat: "DESA KARANGRAYUNG", noHp: "081222111000", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SMPN 1 Karangrayung",  email: "joko@example.com",             keluarga: [] },
  { nama: "WIDYA ASTUTI",            nip: "198204222007032001", alamat: "DESA BRATI",        noHp: "081333222111", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SDN 1 Brati",          email: "widya@example.com",            keluarga: [] },
  { nama: "EKO PRASETYO",            nip: "197905262001011003", alamat: "DESA GROBOGAN",     noHp: "081444333222", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN 3 Grobogan",       email: "eko@example.com",              keluarga: [] },
  { nama: "RATNA SARI",              nip: "198606302009032002", alamat: "DESA KLAMBU",       noHp: "081555444333", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SMPN Klambu",          email: "ratna@example.com",            keluarga: [] },
  { nama: "TONI HARIANTO",           nip: "198107042006011001", alamat: "DESA KEDUNGJATI",   noHp: "081666555444", jenisKelamin: "L", agama: "ISLAM",   status: "active", unitKerja: "SDN 1 Kedungjati",     email: "toni@example.com",             keluarga: [] },
  { nama: "SULASTRI",                nip: "197308101994032001", alamat: "DESA TANGGUNHARJO", noHp: "081777666555", jenisKelamin: "P", agama: "ISLAM",   status: "active", unitKerja: "SMPN Tanggunharjo",    email: "sulastri@example.com",         keluarga: [] },
];

// ─── Core Seed ────────────────────────────────────────────────────────────────

/**
 * Seeds 20 members + MARIYEM's financial history using raw IndexedDB writes.
 *
 * IMPORTANT: we intentionally bypass createTransaksi / centralizedSync here.
 * Those services spawn new async DB operations that violate Dexie's transaction
 * lifecycle, causing TransactionInactiveError. Raw bulkPut is the correct
 * pattern for seeding / migration scripts.
 */
export async function seedDemoData(): Promise<void> {
  await db.open();
  const now = new Date().toISOString();
  const today = new Date();

  console.log("🌱 Seeding 20 members (raw DB writes)...");

  // 1 — 20 members
  const members: Anggota[] = MEMBER_TEMPLATES.map((m, i) => ({
    ...m,
    id: makeId("AG", i + 1),
    createdAt: now,
    updatedAt: now,
  }));
  await db.anggota.bulkPut(members);

  // 2 ─ Programmatic financial data: Simpanan + Pinjaman + Angsuran for 4 members
  //      RAW bulkPut to avoid Dexie TransactionInactiveError from chained async services
  console.log("🌱 Generating comprehensive financial seed data (raw DB writes)...");

  // Interest rate: 1.5% per month flat, tenor 12 bulan
  const SUKU_BUNGA = 1.5;
  const TENOR = 12;

  const seedTargets = [
    { id: "AG0001", pinjaman: 10_000_000 },
    { id: "AG0002", pinjaman: 15_000_000 },
    { id: "AG0003", pinjaman:  5_000_000 },
    { id: "AG0004", pinjaman: 25_000_000 },
  ];

  const allTransaksi: Transaksi[] = [];
  const allPengajuan: Record<string, unknown>[] = [];
  const allJadwal: Omit<JadwalAngsuran, 'id'>[] = [];
  const allJurnal: JurnalEntry[] = [];

  // Counter for unique IDs (will never collide with live user entries which use timestamp-based IDs)
  let txSeq = 1;
  let jrnSeq = 1;

  const mkTxId   = () => `TR_SEED_${String(txSeq++).padStart(3, "0")}`;
  const mkJrnId  = () => `JRN_SEED_${String(jrnSeq++).padStart(3, "0")}`;
  const mkPgId   = (n: number) => `PG_SEED_${String(n).padStart(3, "0")}`;

  // COA IDs from coaService.ts initialChartOfAccounts
  const COA = {
    KAS:                "coa-kas",
    PIUTANG_ANGGOTA:    "coa-piutang-anggota",
    SIMPANAN_SUKARELA:  "coa-simpanan-sukarela",   // Kewajiban — simpanan anggota
    SIMPANAN_POKOK:     "coa-simpanan-pokok",       // Modal — simpanan pokok
    SIMPANAN_WAJIB:     "coa-simpanan-wajib",       // Modal — simpanan wajib
    PENDAPATAN_JASA:    "coa-pendapatan-jasa-pinjaman",
  };

  const loanApprovalDate = new Date(today.getFullYear(), today.getMonth() - 1, 5); // 1 month ago
  const angsuranDate     = new Date(today.getFullYear(), today.getMonth(),      5); // this month

  for (let i = 0; i < seedTargets.length; i++) {
    const target = seedTargets[i];
    const anggota = members.find(m => m.id === target.id);
    if (!anggota) continue;

    const pgSeq = i + 1;

    // ── Kalkulasi Pinjaman ─────────────────────────────────────────────────
    const nominalPokok    = target.pinjaman;
    const nominalJasaBulan = Math.round(nominalPokok * SUKU_BUNGA / 100);
    const totalJasa       = nominalJasaBulan * TENOR;
    const totalKembali    = nominalPokok + totalJasa;
    const angsuranPerBulan = Math.ceil(totalKembali / TENOR);
    const pokokPerBulan   = Math.floor(nominalPokok / TENOR);

    // ── 1. Transaksi Simpanan Pokok (Rp 300.000) ──────────────────────────
    const txSimpananId = mkTxId();
    const simpananDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
    allTransaksi.push({
      id: txSimpananId,
      anggotaId: anggota.id,
      anggotaNama: anggota.nama,
      jenis: "Simpan",
      kategori: "Simpanan Pokok",
      jumlah: 300_000,
      tanggal: simpananDate,
      keterangan: `Simpanan Pokok awal ${anggota.nama} (Seed)`,
      status: "Sukses",
      accountingSyncStatus: "SUCCESS",
      createdAt: now,
      updatedAt: now,
    });

    // Jurnal Simpanan Pokok: Dr Kas / Cr Simpanan Pokok (Modal)
    const jrnSimpananId = mkJrnId();
    allJurnal.push({
      id: jrnSimpananId,
      nomorJurnal: `JRN-${jrnSimpananId}`,
      tanggal: simpananDate,
      deskripsi: `Setoran Simpanan Pokok — ${anggota.nama}`,
      referensi: `TXN-${txSimpananId}`,
      totalDebit: 300_000,
      totalKredit: 300_000,
      status: "POSTED",
      createdBy: "system-seed",
      createdAt: now,
      updatedAt: now,
      details: [
        { id: `${jrnSimpananId}-D`, jurnalId: jrnSimpananId, coaId: COA.KAS, debit: 300_000, kredit: 0, keterangan: "Kas masuk simpanan pokok" },
        { id: `${jrnSimpananId}-K`, jurnalId: jrnSimpananId, coaId: COA.SIMPANAN_POKOK, debit: 0, kredit: 300_000, keterangan: "Simpanan pokok anggota" },
      ],
    });

    // ── 2. Pengajuan Pinjaman (Disetujui) ─────────────────────────────────
    const pgId = mkPgId(pgSeq);
    const pgDate = formatDate(loanApprovalDate);
    allPengajuan.push({
      id: pgId,
      anggotaId: anggota.id,
      anggotaNama: anggota.nama,
      jenis: "Pinjam",
      kategori: "Pinjaman Reguler",
      jumlah: nominalPokok,
      tanggal: pgDate,
      status: "Disetujui",
      keterangan: `Pinjaman Reguler 12 bulan — Disetujui (Seed)`,
      tenor: TENOR,
      nominalPokok,
      nominalJasa: nominalJasaBulan,
      createdAt: now,
      updatedAt: now,
    });

    // ── 3. Transaksi Pinjaman (pencairan) ─────────────────────────────────
    const txPinjamanId = mkTxId();
    allTransaksi.push({
      id: txPinjamanId,
      anggotaId: anggota.id,
      anggotaNama: anggota.nama,
      jenis: "Pinjam",
      kategori: "Pinjaman Reguler",
      jumlah: nominalPokok,
      tanggal: pgDate,
      keterangan: `Dari Pengajuan #${pgId}: Pinjaman Reguler 12 bulan (Seed Valid SAK EP)`,
      status: "Sukses",
      tenor: TENOR,
      sukuBunga: SUKU_BUNGA,
      nominalPokok,
      nominalJasa: nominalJasaBulan,
      accountingSyncStatus: "SUCCESS",
      createdAt: now,
      updatedAt: now,
    });

    // Jurnal Pinjaman: Dr Piutang Anggota / Cr Kas
    const jrnPinjamanId = mkJrnId();
    allJurnal.push({
      id: jrnPinjamanId,
      nomorJurnal: `JRN-${jrnPinjamanId}`,
      tanggal: pgDate,
      deskripsi: `Pencairan Pinjaman Reguler — ${anggota.nama} (Rp ${nominalPokok.toLocaleString("id-ID")})`,
      referensi: `TXN-${txPinjamanId}`,
      totalDebit: nominalPokok,
      totalKredit: nominalPokok,
      status: "POSTED",
      createdBy: "system-seed",
      createdAt: now,
      updatedAt: now,
      details: [
        { id: `${jrnPinjamanId}-D`, jurnalId: jrnPinjamanId, coaId: COA.PIUTANG_ANGGOTA, debit: nominalPokok, kredit: 0, keterangan: "Piutang pokok pinjaman" },
        { id: `${jrnPinjamanId}-K`, jurnalId: jrnPinjamanId, coaId: COA.KAS, debit: 0, kredit: nominalPokok, keterangan: "Kas keluar pencairan" },
      ],
    });

    // ── 4. Jadwal Angsuran (12 entri, mulai bulan depan setelah approval) ──
    const approvalDt = new Date(loanApprovalDate);
    for (let m = 1; m <= TENOR; m++) {
      const dueDate = new Date(approvalDt);
      dueDate.setMonth(approvalDt.getMonth() + m);
      const periodeOptions: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
      const periode = new Intl.DateTimeFormat("id-ID", periodeOptions).format(dueDate);

      allJadwal.push({
        loanId: txPinjamanId,
        anggotaId: anggota.id,
        angsuranKe: m,
        periode,
        tanggalJatuhTempo: dueDate.toISOString(),
        nominalPokok: pokokPerBulan,
        nominalJasa: nominalJasaBulan,
        totalTagihan: angsuranPerBulan,
        // First installment is already "DIBAYAR" (seed pays it)
        status: m === 1 ? "DIBAYAR" : "BELUM_BAYAR",
        tanggalBayar: m === 1 ? angsuranDate.toISOString() : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    // ── 5. Transaksi Angsuran Ke-1 ────────────────────────────────────────
    const txAngsuranId = mkTxId();
    const angsuranDateStr = formatDate(angsuranDate);
    allTransaksi.push({
      id: txAngsuranId,
      anggotaId: anggota.id,
      anggotaNama: anggota.nama,
      jenis: "Angsuran",
      kategori: "Pinjaman Reguler",
      jumlah: angsuranPerBulan,
      tanggal: angsuranDateStr,
      referensiPinjamanId: txPinjamanId,
      keterangan: `Angsuran ke-1 Pinjaman Reguler (Seed)`,
      status: "Sukses",
      nominalPokok: pokokPerBulan,
      nominalJasa: nominalJasaBulan,
      accountingSyncStatus: "SUCCESS",
      createdAt: now,
      updatedAt: now,
    });

    // Jurnal Angsuran: Dr Kas / Cr Piutang Anggota + Cr Pendapatan Jasa Pinjaman
    const jrnAngsuranId = mkJrnId();
    allJurnal.push({
      id: jrnAngsuranId,
      nomorJurnal: `JRN-${jrnAngsuranId}`,
      tanggal: angsuranDateStr,
      deskripsi: `Penerimaan Angsuran ke-1 — ${anggota.nama}`,
      referensi: `TXN-${txAngsuranId}`,
      totalDebit: angsuranPerBulan,
      totalKredit: angsuranPerBulan,
      status: "POSTED",
      createdBy: "system-seed",
      createdAt: now,
      updatedAt: now,
      details: [
        { id: `${jrnAngsuranId}-D`,  jurnalId: jrnAngsuranId, coaId: COA.KAS,             debit: angsuranPerBulan, kredit: 0,               keterangan: "Kas masuk angsuran" },
        { id: `${jrnAngsuranId}-K1`, jurnalId: jrnAngsuranId, coaId: COA.PIUTANG_ANGGOTA, debit: 0,               kredit: pokokPerBulan,   keterangan: "Pelunasan pokok" },
        { id: `${jrnAngsuranId}-K2`, jurnalId: jrnAngsuranId, coaId: COA.PENDAPATAN_JASA, debit: 0,               kredit: nominalJasaBulan, keterangan: "Pendapatan jasa pinjaman" },
      ],
    });
  }

  // ── Bulk write all records (outside of any Dexie transaction scope) ────────
  await db.transaksi.bulkPut(allTransaksi);
  await db.pengajuan.bulkPut(allPengajuan);
  await db.jadwal_angsuran.bulkPut(allJadwal);
  await db.jurnal.bulkPut(allJurnal);

  console.log(`✅ Seed complete: ${members.length} anggota + ${allTransaksi.length} transaksi + ${allJadwal.length} jadwal angsuran + ${allJurnal.length} jurnal SAK EP.`);

}

// ─── Public Entry Point ───────────────────────────────────────────────────────

/**
 * Clear everything, seed fresh demo data, then run module-level seeders.
 * Called by the "Muat Data Demo" button in the UI.
 */
export async function runLoadDemoDataAction(): Promise<void> {
  console.log("🚀 runLoadDemoDataAction: starting...");
  await clearAllData();
  await seedDemoData();

  // Module seeders manage their own DB scope — run them outside the main flow
  try { await seedManufakturData(); } catch (e) { console.warn("seedManufakturData skipped:", e); }
  try { await seedRetailData();     } catch (e) { console.warn("seedRetailData skipped:",     e); }

  localStorage.setItem("koperasi_seed_v2_indexeddb", "true");
  console.log("🎉 Demo data loaded successfully!");
}
