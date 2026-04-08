import { db } from "@/db/db";
import { seedManufakturData } from "./manufaktur/seedManufakturData";
import { seedRetailData } from "./retail/seedRetailData";
import { Anggota } from "@/types/anggota";
import { Transaksi } from "@/types/transaksi";

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

  // Clear SHU localStorage caches
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("shu_result_")) localStorage.removeItem(key);
  });
  localStorage.removeItem("koperasi_seed_v2_indexeddb");
  console.log("✅ All tables cleared.");
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

  // 2 — Financial history for MARIYEM (AG0001)
  const transaksiSeed: Transaksi[] = [
    {
      id: "TR_SEED_001",
      anggotaId: "AG0001",
      anggotaNama: "MARIYEM",
      jenis: "Simpan",
      kategori: "Simpanan Pokok",
      jumlah: 500000,
      tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 3, 5)),
      keterangan: "Simpanan Pokok anggota MARIYEM",
      status: "Sukses",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "TR_SEED_002",
      anggotaId: "AG0001",
      anggotaNama: "MARIYEM",
      jenis: "Simpan",
      kategori: "Simpanan Wajib",
      jumlah: 100000,
      tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 1)),
      keterangan: "Simpanan Wajib bulan lalu",
      status: "Sukses",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "TR_SEED_003",
      anggotaId: "AG0001",
      anggotaNama: "MARIYEM",
      jenis: "Pinjam",
      kategori: "Pinjaman Reguler",
      jumlah: 10000000,
      tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 10)),
      keterangan: "Pinjaman Reguler tenor 12 bulan (demo seed)",
      status: "Sukses",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "TR_SEED_004",
      anggotaId: "AG0001",
      anggotaNama: "MARIYEM",
      jenis: "Angsuran",
      kategori: "Pinjaman Reguler",
      jumlah: 916667,
      tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 10)),
      keterangan: "Angsuran ke-1 Pinjaman Reguler",
      status: "Sukses",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "TR_SEED_005",
      anggotaId: "AG0001",
      anggotaNama: "MARIYEM",
      jenis: "Angsuran",
      kategori: "Pinjaman Reguler",
      jumlah: 916667,
      tanggal: formatDate(new Date(today.getFullYear(), today.getMonth(), 10)),
      keterangan: "Angsuran ke-2 Pinjaman Reguler",
      status: "Sukses",
      createdAt: now,
      updatedAt: now,
    },
  ];
  await db.transaksi.bulkPut(transaksiSeed);

  // 3 — Pengajuan record so the Applications module has starter data
  await db.pengajuan.put({
    id: "PG_SEED_001",
    anggotaId: "AG0001",
    anggotaNama: "MARIYEM",
    jenis: "Pinjam",
    kategori: "Pinjaman Reguler",
    jumlah: 10000000,
    tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 10)),
    status: "Disetujui",
    keterangan: "Pinjaman Reguler tenor 12 bulan",
    tenor: 12,
    createdAt: now,
    updatedAt: now,
  });

  console.log("✅ Core seed complete: 20 members + MARIYEM financial history.");
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
