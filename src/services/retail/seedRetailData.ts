
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { generateId } from "@/lib/utils";
import { subMonths, format } from "date-fns";
import { initSampleProdukData } from "@/services/produk";

const SEED_KEY = "retail_seed_v1_done";

/**
 * Seed comprehensive Retail demo data:
 * - 8 products (already via produk sampleData)
 * - 3 kasir (already via kasirService)
 * - 5 pemasok (already via pemasokService)
 * - ~60 penjualan transactions spanning 6 months
 * - ~18 pembelian transactions spanning 6 months
 */
export function seedRetailData(): void {
  if (getFromLocalStorage<boolean>(SEED_KEY, false)) {
    console.log("✅ Retail seed data already applied");
    return;
  }

  // Initialize product sample data first
  initSampleProdukData();

  console.log("🌱 Seeding Retail demo data...");

  const now = new Date();
  const kasirIds = ["KSR001", "KSR002", "KSR003"];
  const paymentMethods = ["cash", "debit", "qris", "transfer"];

  const products = [
    { id: "PRD001", nama: "Beras Premium", hargaJual: 12000, hargaBeli: 10000, kategori: "Sembako" },
    { id: "PRD002", nama: "Gula Pasir", hargaJual: 14000, hargaBeli: 12000, kategori: "Sembako" },
    { id: "PRD003", nama: "Minyak Goreng", hargaJual: 18000, hargaBeli: 15000, kategori: "Sembako" },
    { id: "PRD004", nama: "Teh Celup", hargaJual: 7500, hargaBeli: 5000, kategori: "Minuman" },
    { id: "PRD005", nama: "Kopi Bubuk", hargaJual: 25000, hargaBeli: 20000, kategori: "Minuman" },
    { id: "PRD006", nama: "Sabun Mandi", hargaJual: 4500, hargaBeli: 3000, kategori: "Perlengkapan Mandi" },
    { id: "PRD007", nama: "Sampo", hargaJual: 22000, hargaBeli: 18000, kategori: "Perlengkapan Mandi" },
    { id: "PRD008", nama: "Sikat Gigi", hargaJual: 10000, hargaBeli: 7000, kategori: "Perlengkapan Mandi" },
  ];

  const pemasokIds = ["SUP001", "SUP002", "SUP003", "SUP004", "SUP005"];
  const pemasokNames = [
    "PT Sembako Utama", "CV Sinar Jaya Distribusi", "UD Berkah Makmur",
    "PT Maju Bersama Sejahtera", "CV Mulia Sentosa"
  ];

  // --- Generate Penjualan (sales) ---
  const penjualanList: any[] = getFromLocalStorage("penjualanList", []);
  let trxCounter = penjualanList.length + 1;

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const baseDate = subMonths(now, monthOffset);
    // 8-12 transactions per month
    const txCount = 8 + Math.floor(Math.random() * 5);

    for (let t = 0; t < txCount; t++) {
      const day = 1 + Math.floor(Math.random() * 27);
      const hour = 7 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), day, hour, minute);

      // Pick 1-4 random products
      const itemCount = 1 + Math.floor(Math.random() * 4);
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, itemCount);

      const items = shuffled.map(p => {
        const jumlah = 1 + Math.floor(Math.random() * 5);
        return {
          produkId: p.id,
          jumlah,
          hargaSatuan: p.hargaJual,
          total: jumlah * p.hargaJual,
        };
      });

      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const diskon = Math.random() < 0.3 ? Math.floor(Math.random() * 10 + 1) : 0;
      const pajak = Math.random() < 0.2 ? 10 : 0;
      const afterDiskon = subtotal - (subtotal * diskon / 100);
      const total = Math.round(afterDiskon + (afterDiskon * pajak / 100));
      const dibayar = Math.ceil(total / 10000) * 10000;
      const metode = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      penjualanList.push({
        id: generateId("POS"),
        nomorTransaksi: `TRX-${format(txDate, "yyyyMMdd")}-${String(trxCounter++).padStart(4, "0")}`,
        tanggal: txDate.toISOString(),
        kasirId: kasirIds[Math.floor(Math.random() * kasirIds.length)],
        items,
        subtotal,
        diskon,
        pajak,
        total,
        dibayar,
        kembalian: dibayar - total,
        metodePembayaran: metode,
        status: "sukses",
        createdAt: txDate.toISOString(),
      });
    }
  }

  saveToLocalStorage("penjualanList", penjualanList);
  console.log(`✅ ${penjualanList.length} Penjualan seeded`);

  // --- Generate Pembelian (purchases) ---
  const pembelianList: any[] = getFromLocalStorage("koperasi_pembelian", []);
  let pbCounter = pembelianList.length + 1;

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const baseDate = subMonths(now, monthOffset);
    // 3 purchases per month
    const txCount = 2 + Math.floor(Math.random() * 2);

    for (let t = 0; t < txCount; t++) {
      const day = 1 + Math.floor(Math.random() * 27);
      const txDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), day, 10, 0);

      const pemasokIndex = Math.floor(Math.random() * pemasokIds.length);
      const itemCount = 2 + Math.floor(Math.random() * 3);
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, itemCount);

      const items = shuffled.map(p => {
        const jumlah = 10 + Math.floor(Math.random() * 41);
        return {
          produkId: p.id,
          produkNama: p.nama,
          jumlah,
          hargaSatuan: p.hargaBeli,
          total: jumlah * p.hargaBeli,
        };
      });

      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const ppn = Math.round(subtotal * 0.1);
      const diskon = Math.random() < 0.3 ? Math.round(subtotal * 0.05) : 0;
      const total = subtotal + ppn - diskon;

      const statuses = ["selesai", "selesai", "selesai", "proses"];
      const status = monthOffset === 0 && t === txCount - 1 ? "proses" : statuses[Math.floor(Math.random() * statuses.length)];

      pembelianList.push({
        id: `PB${String(pbCounter++).padStart(4, "0")}`,
        nomorTransaksi: `PB${format(txDate, "yyMM")}-${String(pbCounter).padStart(3, "0")}`,
        tanggal: format(txDate, "yyyy-MM-dd"),
        pemasokId: pemasokIds[pemasokIndex],
        pemasok: pemasokNames[pemasokIndex],
        items,
        subtotal,
        diskon,
        ppn,
        total,
        status,
        catatan: `Pengadaan stok bulan ${format(txDate, "MMMM yyyy")}`,
        createdAt: txDate.toISOString(),
      });
    }
  }

  saveToLocalStorage("koperasi_pembelian", pembelianList);
  console.log(`✅ ${pembelianList.length} Pembelian seeded`);

  // Initialize kasir sample data
  const kasirKey = "koperasi_kasir_data";
  if (!localStorage.getItem(kasirKey)) {
    const kasirData = [
      { id: "KSR001", nama: "John Doe", username: "john.doe", noHp: "081234567890", role: "kasir", aktif: true, createdAt: new Date().toISOString() },
      { id: "KSR002", nama: "Jane Smith", username: "jane.smith", noHp: "082345678901", role: "kasir", aktif: true, createdAt: new Date().toISOString() },
      { id: "KSR003", nama: "Robert Johnson", username: "robert.j", noHp: "083456789012", role: "admin", aktif: true, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(kasirKey, JSON.stringify(kasirData));
    console.log("✅ Kasir sample data initialized");
  }

  saveToLocalStorage(SEED_KEY, true);
  console.log("✅ Retail seed data complete!");
}
