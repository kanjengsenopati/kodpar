import { db } from "@/db/db";
import { seedManufakturData } from "./manufaktur/seedManufakturData";
import { seedRetailData } from "./retail/seedRetailData";
import { Anggota } from "@/types/anggota";
import { Transaksi, JadwalAngsuran, Pengajuan } from "@/types/transaksi";
import { JurnalEntry } from "@/types/akuntansi";
import { formatReferenceNumber } from "@/utils/idUtils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

/**
 * Deterministic UUID generator for stable seed data
 * Format: 018e6a12-8c1d-7a01-8000-<prefix_hex><sequence_hex>
 */
function makeSeedUUID(prefix: string, n: number): string {
  const prefixMap: Record<string, string> = {
    'AG': '0001',
    'TR': '0002',
    'JRN': '0003',
    'PG': '0004',
    'UK': '0005'
  };
  const p = prefixMap[prefix] || '0000';
  const seq = n.toString(16).padStart(8, '0');
  return `018e6a12-8c1d-7a01-8000-${p}${seq}`;
}

// ─── Clear All Data ───────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  console.log("🧹 Clearing all data for Dual-ID Architecture Migration...");
  await db.open();
  await db.anggota.clear();
  await db.transaksi.clear();
  await db.coa.clear();
  await db.jurnal.clear();
  await db.pengajuan.clear();
  await db.jadwal_angsuran.clear();

  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("shu_result_") ||
      key.startsWith("manufaktur_") ||
      key === "centralized_sync_tracker" ||
      key === "recent_sync_tracker" ||
      key === "koperasi_seed_v2_indexeddb" ||
      key === "retail_seed_v1_done" ||
      key === "penjualanList" ||
      key === "koperasi_pembelian" ||
      key === "koperasi_kasir_data" ||
      key === "retail_produk_data" ||
      key === "pos_products" ||
      key === "pos_cart" ||
      key === "pos_transactions" ||
      key === "koperasi_pengaturan"
    ) {
      localStorage.removeItem(key);
    }
  });
  console.log("✅ All tables cleared.");
}

// ─── Member Seed Data ─────────────────────────────────────────────────────────

const MEMBER_TEMPLATES: Omit<Anggota, "id" | "noAnggota" | "createdAt" | "updatedAt">[] = [
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

export async function seedDemoData(): Promise<void> {
  await db.open();
  const now = new Date().toISOString();
  const today = new Date();

  console.log("🌱 Seeding 20 members (Dual-ID System)...");

  const members: Anggota[] = MEMBER_TEMPLATES.map((m, i) => ({
    ...m,
    id: makeSeedUUID("AG", i + 1),
    noAnggota: formatReferenceNumber({ prefix: "AG", sequence: i + 1 }),
    createdAt: now,
    updatedAt: now,
  }));
  await db.anggota.bulkPut(members);

  console.log("🌱 Generating comprehensive financial seed data (Dual-ID System)...");

  const SUKU_BUNGA = 1.5;
  const TENOR = 12;

  const seedTargets = [
    { id: makeSeedUUID("AG", 1), pinjaman: 10_000_000 },
    { id: makeSeedUUID("AG", 2), pinjaman: 15_000_000 },
    { id: makeSeedUUID("AG", 3), pinjaman:  5_000_000 },
    { id: makeSeedUUID("AG", 4), pinjaman: 25_000_000 },
  ];

  const allTransaksi: Transaksi[] = [];
  const allPengajuan: Pengajuan[] = [];
  const allJadwal: Omit<JadwalAngsuran, 'id'>[] = [];
  const allJurnal: JurnalEntry[] = [];

  let txSeq = 1;
  let jrnSeq = 1;
  let pgSeq = 1;

  const mkTxId   = () => makeSeedUUID("TR", txSeq);
  const mkTxNo   = () => formatReferenceNumber({ prefix: "TR", year: today.getFullYear(), month: today.getMonth() + 1, sequence: txSeq++, padding: 6 });
  const mkJrnId  = () => makeSeedUUID("JRN", jrnSeq);
  const mkJrnNo  = () => `JU${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(jrnSeq++).padStart(4, '0')}`;
  const mkPgId   = () => makeSeedUUID("PG", pgSeq);
  const mkPgNo   = () => formatReferenceNumber({ prefix: "PG", year: today.getFullYear(), sequence: pgSeq++ });

  const COA = {
    KAS:                "coa-kas",
    PIUTANG_ANGGOTA:    "coa-piutang-anggota",
    SIMPANAN_SUKARELA:  "coa-simpanan-sukarela",
    SIMPANAN_POKOK:     "coa-simpanan-pokok",
    SIMPANAN_WAJIB:     "coa-simpanan-wajib",
    PENDAPATAN_JASA:    "coa-pendapatan-jasa-pinjaman",
  };

  const loanApprovalDate = new Date(today.getFullYear(), today.getMonth() - 1, 5);
  const angsuranDate     = new Date(today.getFullYear(), today.getMonth(),      5);

  for (let i = 0; i < seedTargets.length; i++) {
    const target = seedTargets[i];
    const anggota = members.find(m => m.id === target.id);
    if (!anggota) continue;

    const nominalPokok    = target.pinjaman;
    const nominalJasaBulan = Math.round(nominalPokok * SUKU_BUNGA / 100);
    const totalJasa       = nominalJasaBulan * TENOR;
    const totalKembali    = nominalPokok + totalJasa;
    const angsuranPerBulan = Math.ceil(totalKembali / TENOR);
    const pokokPerBulan   = Math.floor(nominalPokok / TENOR);

    // ── 1. Transaksi Simpanan Pokok ──────────────────────────────────────
    const txSimpananId = mkTxId();
    const txSimpananNo = mkTxNo();
    const simpananDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
    allTransaksi.push({
      id: txSimpananId,
      nomorTransaksi: txSimpananNo,
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

    const jrnSimpananId = mkJrnId();
    allJurnal.push({
      id: jrnSimpananId,
      nomorJurnal: mkJrnNo(),
      tanggal: simpananDate,
      deskripsi: `Setoran Simpanan Pokok — ${anggota.nama}`,
      referensi: `TXN-${txSimpananNo}`,
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

    // ── 2. Pengajuan Pinjaman ─────────────────────────────────────────────
    const pgId = mkPgId();
    const pgNo = mkPgNo();
    const pgDate = formatDate(loanApprovalDate);
    allPengajuan.push({
      id: pgId,
      nomorPengajuan: pgNo,
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

    // ── 3. Transaksi Pinjaman ─────────────────────────────────────────────
    const txPinjamanId = mkTxId();
    const txPinjamanNo = mkTxNo();
    allTransaksi.push({
      id: txPinjamanId,
      nomorTransaksi: txPinjamanNo,
      anggotaId: anggota.id,
      anggotaNama: anggota.nama,
      jenis: "Pinjam",
      kategori: "Pinjaman Reguler",
      jumlah: nominalPokok,
      tanggal: pgDate,
      keterangan: `Dari Pengajuan #${pgNo}: Pinjaman Reguler 12 bulan (Seed)`,
      status: "Sukses",
      tenor: TENOR,
      sukuBunga: SUKU_BUNGA,
      nominalPokok,
      nominalJasa: nominalJasaBulan,
      accountingSyncStatus: "SUCCESS",
      createdAt: now,
      updatedAt: now,
    });

    const jrnPinjamanId = mkJrnId();
    allJurnal.push({
      id: jrnPinjamanId,
      nomorJurnal: mkJrnNo(),
      tanggal: pgDate,
      deskripsi: `Pencairan Pinjaman Reguler — ${anggota.nama}`,
      referensi: `TXN-${txPinjamanNo}`,
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

    // ── 4. Jadwal Angsuran ────────────────────────────────────────────────
    const approvalDt = new Date(loanApprovalDate);
    for (let m = 1; m <= TENOR; m++) {
      const dueDate = new Date(approvalDt);
      dueDate.setMonth(approvalDt.getMonth() + m);
      const periode = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(dueDate);

      allJadwal.push({
        loanId: txPinjamanId,
        anggotaId: anggota.id,
        angsuranKe: m,
        periode,
        tanggalJatuhTempo: dueDate.toISOString(),
        nominalPokok: pokokPerBulan,
        nominalJasa: nominalJasaBulan,
        totalTagihan: angsuranPerBulan,
        status: m === 1 ? "DIBAYAR" : "BELUM_BAYAR",
        tanggalBayar: m === 1 ? angsuranDate.toISOString() : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    // ── 5. Transaksi Angsuran ─────────────────────────────────────────────
    const txAngsuranId = mkTxId();
    const txAngsuranNo = mkTxNo();
    const angsuranDateStr = formatDate(angsuranDate);
    allTransaksi.push({
      id: txAngsuranId,
      nomorTransaksi: txAngsuranNo,
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

    const jrnAngsuranId = mkJrnId();
    allJurnal.push({
      id: jrnAngsuranId,
      nomorJurnal: mkJrnNo(),
      tanggal: angsuranDateStr,
      deskripsi: `Penerimaan Angsuran ke-1 — ${anggota.nama}`,
      referensi: `TXN-${txAngsuranNo}`,
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

  await db.transaksi.bulkPut(allTransaksi);
  await db.pengajuan.bulkPut(allPengajuan);
  await db.jadwal_angsuran.bulkPut(allJadwal);
  await db.jurnal.bulkPut(allJurnal);

  console.log(`✅ Seed complete: ${members.length} anggota + ${allTransaksi.length} transaksi + ${allPengajuan.length} pengajuan.`);
}

export async function runLoadDemoDataAction(): Promise<void> {
  await clearAllData();
  await seedDemoData();

  try { await seedManufakturData(); } catch (e) { console.warn("seedManufakturData skipped:", e); }
  try { await seedRetailData();     } catch (e) { console.warn("seedRetailData skipped:",     e); }

  localStorage.setItem("koperasi_seed_v2_indexeddb", "true");
  console.log("🎉 Demo data loaded successfully!");
}
