import { db } from "@/db/db";
import { createPengajuan, approvePengajuan } from "./pengajuanService";
import { createTransaksi } from "./transaksiService";
import { seedManufakturData } from "./manufaktur/seedManufakturData";
import { seedRetailData } from "./retail/seedRetailData";
import { Anggota } from "@/types/anggota";

const SEED_KEY = "koperasi_seed_v2_indexeddb";

/**
 * Seed 20 diverse member data for prototype presentation
 */
async function generate20Members(): Promise<void> {
  const members: Omit<Anggota, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { nama: "MARIYEM", nip: "197201011998031001", alamat: "DESA JATILOR", noHp: "0812345678", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SDN Jatilor 01", email: "mariyem@example.com", keluarga: [] },
    { nama: "MASKUN ROZAK", nip: "198201011998031001", alamat: "DESA BRINGIN", noHp: "0823456789", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN Bringin", email: "maskun.rozak@example.com", keluarga: [] },
    { nama: "AHMAD NURALIMIN", nip: "198801011998031001", alamat: "DESA KLAMPOK", noHp: "08345678912", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN Klampok 01", email: "ahmad.nuralimin@example.com", keluarga: [] },
    { nama: "DJAKA KUMALATARTO, S.Pd, M.Pd", nip: "197002161210012345", alamat: "Desa Ketitang, Kecamatan Godong, Kab Grobogan", noHp: "08123456789", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SD Negeri Ketitang", email: "djaka.kumalatarto@example.com", keluarga: [] },
    { nama: "SITI AMINAH", nip: "198505052010012001", alamat: "DESA TEGOWANU", noHp: "081111222333", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SMPN 1 Tegowanu", email: "siti.aminah@example.com", keluarga: [] },
    { nama: "BAMBANG SUDARMONO", nip: "197806121999031002", alamat: "DESA GUBUG", noHp: "081222333444", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN 2 Gubug", email: "bambang.s@example.com", keluarga: [] },
    { nama: "SRI WAHYUNI", nip: "198007152005012003", alamat: "DESA PENAWANGAN", noHp: "081333444555", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "Dinas Pendidikan Penawangan", email: "sri.wahyuni@example.com", keluarga: [] },
    { nama: "SUPARMAN", nip: "197508202000031001", alamat: "DESA TOROH", noHp: "081444555666", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SMPN 2 Toroh", email: "suparman@example.com", keluarga: [] },
    { nama: "ANI SURYANI", nip: "199009252015012005", alamat: "DESA WIROSARI", noHp: "081555666777", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SDN 1 Wirosari", email: "ani.suryani@example.com", keluarga: [] },
    { nama: "HENDRA KUSUMA", nip: "198310302008011002", alamat: "DESA TAWANGHARJO", noHp: "081666777888", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN Tawangharjo", email: "hendra.k@example.com", keluarga: [] },
    { nama: "LIDIAWATI", nip: "198711152011032001", alamat: "DESA NGREBO", noHp: "081777888999", jenisKelamin: "P", agama: "KRISTEN", status: "active", unitKerja: "SMPN Ngrebo", email: "lidia@example.com", keluarga: [] },
    { nama: "BUDI SANTOSO", nip: "197212201995031003", alamat: "DESA PULOKULON", noHp: "081888999000", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN 1 Pulokulon", email: "budi.s@example.com", keluarga: [] },
    { nama: "RESTU ADJI", nip: "199301102018011001", alamat: "DESA KRADENAN", noHp: "081999000111", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "Dinas Pendidikan Kradenan", email: "restu@example.com", keluarga: [] },
    { nama: "DIAN PUSPITA", nip: "198902142013032002", alamat: "DESA GABUS", noHp: "081000111222", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SDN 2 Gabus", email: "dian.p@example.com", keluarga: [] },
    { nama: "JOKO TINGKIR", nip: "197603182002011001", alamat: "DESA KARANGRAYUNG", noHp: "081222111000", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SMPN 1 Karangrayung", email: "joko@example.com", keluarga: [] },
    { nama: "WIDYA ASTUTI", nip: "198204222007032001", alamat: "DESA BRATI", noHp: "081333222111", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SDN 1 Brati", email: "widya@example.com", keluarga: [] },
    { nama: "EKO PRASETYO", nip: "197905262001011003", alamat: "DESA GROBOGAN", noHp: "081444333222", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN 3 Grobogan", email: "eko@example.com", keluarga: [] },
    { nama: "RATNA SARI", nip: "198606302009032002", alamat: "DESA KLAMBU", noHp: "081555444333", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SMPN Klambu", email: "ratna@example.com", keluarga: [] },
    { nama: "TONI HARIANTO", nip: "198107042006011001", alamat: "DESA KEDUNGJATI", noHp: "081666555444", jenisKelamin: "L", agama: "ISLAM", status: "active", unitKerja: "SDN 1 Kedungjati", email: "toni@example.com", keluarga: [] },
    { nama: "SULASTRI", nip: "197308101994032001", alamat: "DESA TANGGUNHARJO", noHp: "081777666555", jenisKelamin: "P", agama: "ISLAM", status: "active", unitKerja: "SMPN Tanggunharjo", email: "sulastri@example.com", keluarga: [] },
  ];

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const id = `AG${String(i + 1).padStart(4, "0")}`;
    const now = new Date().toISOString();
    await db.table('anggota').put({
      ...m,
      id,
      createdAt: now,
      updatedAt: now,
    });
  }
}

/**
 * Seed demo data for presentations
 */
export async function seedDemoData(): Promise<void> {
  const done = localStorage.getItem(SEED_KEY);
  if (done) {
    console.log("✅ Seed data already applied to IndexedDB");
    return;
  }

  console.log("🌱 Seeding 20 members and demo data to IndexedDB...");
  
  // 1. Generate 20 Members
  await generate20Members();

  // 2. Add History for MARIYEM (AG0001)
  const anggotaId = "AG0001";
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // Simpanan Pokok Rp 500.000
  await createTransaksi({
    anggotaId,
    jenis: "Simpan",
    kategori: "Simpanan Pokok",
    jumlah: 500000,
    tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 3, 5)),
    keterangan: "Simpanan Pokok anggota MARIYEM",
    status: "Sukses",
  });

  // Pengajuan Pinjaman Rp 10.000.000
  const pengajuan = await createPengajuan({
    anggotaId,
    jenis: "Pinjam",
    jumlah: 10000000,
    kategori: "Pinjaman Reguler",
    tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 10)),
    status: "Menunggu",
    keterangan: "Pinjaman Reguler tenor 12 bulan",
    tenor: 12,
  } as any);

  if (pengajuan) {
    await approvePengajuan(pengajuan.id);
  }

  // Angsuran 1 & 2
  await createTransaksi({
    anggotaId,
    jenis: "Angsuran",
    kategori: "Pinjaman Reguler",
    jumlah: 916667,
    tanggal: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 10)),
    keterangan: "Angsuran ke-1 Pinjaman Reguler MARIYEM",
    status: "Sukses",
  });

  await createTransaksi({
    anggotaId,
    jenis: "Angsuran",
    kategori: "Pinjaman Reguler",
    jumlah: 916667,
    tanggal: formatDate(new Date(today.getFullYear(), today.getMonth(), 10)),
    keterangan: "Angsuran ke-2 Pinjaman Reguler MARIYEM",
    status: "Sukses",
  });

  // Mark seed as done
  localStorage.setItem(SEED_KEY, "true");

  // Other modules
  seedManufakturData();
  seedRetailData();

  console.log("🌱 Seed complete to IndexedDB!");
}
