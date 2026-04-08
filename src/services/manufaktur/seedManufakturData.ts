
import { BOM, BOMItem } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const SEED_KEY = "manufaktur_seed_v2_done";
const BOM_KEY = "manufaktur_bom";
const WO_KEY = "manufaktur_work_orders";
const PP_KEY = "manufaktur_production_plans";
const QC_KEY = "manufaktur_quality_control";
const INV_KEY = "manufaktur_inventory";
const MOV_KEY = "manufaktur_stock_movements";

export function seedManufakturData(): void {
  if (getFromLocalStorage<boolean>(SEED_KEY, false)) {
    console.log("✅ Manufaktur seed data already applied");
    return;
  }

  console.log("🌱 Seeding Manufaktur demo data v2...");

  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const ago = (days: number) => new Date(now.getTime() - days * 86400000);
  const future = (days: number) => new Date(now.getTime() + days * 86400000);

  // ===== BOM 1: Roti Tawar =====
  const bom1Id = uuidv4();
  const bom1Items: BOMItem[] = [
    { id: uuidv4(), bomId: bom1Id, materialName: "Tepung Terigu", materialCode: "MAT-001", quantity: 5, unit: "kg", unitCost: 12000, totalCost: 60000, notes: "Protein tinggi" },
    { id: uuidv4(), bomId: bom1Id, materialName: "Gula Pasir", materialCode: "MAT-002", quantity: 0.5, unit: "kg", unitCost: 15000, totalCost: 7500 },
    { id: uuidv4(), bomId: bom1Id, materialName: "Ragi Instan", materialCode: "MAT-003", quantity: 50, unit: "gram", unitCost: 200, totalCost: 10000 },
    { id: uuidv4(), bomId: bom1Id, materialName: "Mentega", materialCode: "MAT-004", quantity: 0.3, unit: "kg", unitCost: 40000, totalCost: 12000 },
    { id: uuidv4(), bomId: bom1Id, materialName: "Susu Bubuk", materialCode: "MAT-005", quantity: 100, unit: "gram", unitCost: 100, totalCost: 10000 },
  ];
  const bom1MatCost = bom1Items.reduce((s, i) => s + i.totalCost, 0);
  const bom1: BOM = {
    id: bom1Id, code: "BOM-001", productName: "Roti Tawar", productCode: "PRD-001",
    description: "Roti tawar standar untuk produksi harian", category: "Makanan & Minuman",
    items: bom1Items, totalMaterialCost: bom1MatCost, overheadCost: 15000, laborCost: 25000,
    totalCost: bom1MatCost + 15000 + 25000, outputQuantity: 10, outputUnit: "pcs",
    status: "Active", createdAt: ago(30).toISOString(), updatedAt: ago(5).toISOString(),
  };

  // ===== BOM 2: Kue Lapis =====
  const bom2Id = uuidv4();
  const bom2Items: BOMItem[] = [
    { id: uuidv4(), bomId: bom2Id, materialName: "Tepung Beras", materialCode: "MAT-006", quantity: 2, unit: "kg", unitCost: 18000, totalCost: 36000 },
    { id: uuidv4(), bomId: bom2Id, materialName: "Santan Kelapa", materialCode: "MAT-007", quantity: 2, unit: "liter", unitCost: 20000, totalCost: 40000 },
    { id: uuidv4(), bomId: bom2Id, materialName: "Gula Pasir", materialCode: "MAT-002", quantity: 1, unit: "kg", unitCost: 15000, totalCost: 15000 },
    { id: uuidv4(), bomId: bom2Id, materialName: "Pewarna Makanan", materialCode: "MAT-008", quantity: 10, unit: "ml", unitCost: 500, totalCost: 5000 },
  ];
  const bom2MatCost = bom2Items.reduce((s, i) => s + i.totalCost, 0);
  const bom2: BOM = {
    id: bom2Id, code: "BOM-002", productName: "Kue Lapis", productCode: "PRD-002",
    description: "Kue lapis tradisional 3 warna", category: "Makanan & Minuman",
    items: bom2Items, totalMaterialCost: bom2MatCost, overheadCost: 10000, laborCost: 30000,
    totalCost: bom2MatCost + 10000 + 30000, outputQuantity: 20, outputUnit: "pcs",
    status: "Active", createdAt: ago(25).toISOString(), updatedAt: ago(3).toISOString(),
  };

  // ===== BOM 3: Meja Kayu (Draft) =====
  const bom3Id = uuidv4();
  const bom3Items: BOMItem[] = [
    { id: uuidv4(), bomId: bom3Id, materialName: "Kayu Jati", materialCode: "MAT-009", quantity: 3, unit: "batang", unitCost: 150000, totalCost: 450000 },
    { id: uuidv4(), bomId: bom3Id, materialName: "Paku", materialCode: "MAT-010", quantity: 1, unit: "pack", unitCost: 25000, totalCost: 25000 },
    { id: uuidv4(), bomId: bom3Id, materialName: "Lem Kayu", materialCode: "MAT-011", quantity: 2, unit: "liter", unitCost: 35000, totalCost: 70000 },
    { id: uuidv4(), bomId: bom3Id, materialName: "Cat Pernis", materialCode: "MAT-012", quantity: 1, unit: "liter", unitCost: 85000, totalCost: 85000 },
    { id: uuidv4(), bomId: bom3Id, materialName: "Amplas", materialCode: "MAT-013", quantity: 5, unit: "lembar", unitCost: 5000, totalCost: 25000 },
  ];
  const bom3MatCost = bom3Items.reduce((s, i) => s + i.totalCost, 0);
  const bom3: BOM = {
    id: bom3Id, code: "BOM-003", productName: "Meja Kayu Jati", productCode: "PRD-003",
    description: "Meja kayu jati ukuran 120x60cm", category: "Furnitur",
    items: bom3Items, totalMaterialCost: bom3MatCost, overheadCost: 50000, laborCost: 200000,
    totalCost: bom3MatCost + 50000 + 200000, outputQuantity: 1, outputUnit: "pcs",
    status: "Draft", createdAt: ago(7).toISOString(), updatedAt: ago(7).toISOString(),
  };

  const bomList = [bom1, bom2, bom3];
  saveToLocalStorage(BOM_KEY, bomList);
  console.log(`✅ 3 BOM created`);

  // ===== Work Orders =====
  const wo1Id = uuidv4();
  const wo2Id = uuidv4();
  const wo3Id = uuidv4();
  const wo4Id = uuidv4();

  const woList = [
    { id: wo1Id, code: "WO-001", bomId: bom1.id, bomCode: bom1.code, productName: bom1.productName, quantity: 50, unit: bom1.outputUnit, status: "Completed" as const, priority: "High" as const, startDate: fmt(ago(20)), dueDate: fmt(ago(10)), completedDate: fmt(ago(12)), assignedTo: "Pak Budi", notes: "Pesanan untuk acara koperasi", estimatedCost: bom1.totalCost * 50, actualCost: bom1.totalCost * 50 + 50000, createdAt: ago(20).toISOString(), updatedAt: ago(12).toISOString() },
    { id: wo2Id, code: "WO-002", bomId: bom2.id, bomCode: bom2.code, productName: bom2.productName, quantity: 100, unit: bom2.outputUnit, status: "In Progress" as const, priority: "Medium" as const, startDate: fmt(ago(5)), dueDate: fmt(future(5)), assignedTo: "Bu Sari", notes: "Produksi mingguan reguler", estimatedCost: bom2.totalCost * 100, createdAt: ago(5).toISOString(), updatedAt: ago(1).toISOString() },
    { id: wo3Id, code: "WO-003", bomId: bom1.id, bomCode: bom1.code, productName: bom1.productName, quantity: 30, unit: bom1.outputUnit, status: "Draft" as const, priority: "Low" as const, startDate: fmt(future(3)), dueDate: fmt(future(10)), assignedTo: "", notes: "Rencana produksi minggu depan", estimatedCost: bom1.totalCost * 30, createdAt: ago(2).toISOString(), updatedAt: ago(2).toISOString() },
    { id: wo4Id, code: "WO-004", bomId: bom2.id, bomCode: bom2.code, productName: bom2.productName, quantity: 200, unit: bom2.outputUnit, status: "Completed" as const, priority: "Urgent" as const, startDate: fmt(ago(15)), dueDate: fmt(ago(8)), completedDate: fmt(ago(9)), assignedTo: "Bu Sari", notes: "Pesanan khusus event desa", estimatedCost: bom2.totalCost * 200, actualCost: bom2.totalCost * 200 - 100000, createdAt: ago(15).toISOString(), updatedAt: ago(9).toISOString() },
  ];
  saveToLocalStorage(WO_KEY, woList);
  console.log(`✅ 4 Work Orders created`);

  // ===== Production Plans =====
  const ppList = [
    { id: uuidv4(), code: "PP-001", name: "Produksi Roti Minggu 1", description: "Produksi roti tawar batch pertama bulan ini", workOrderIds: [wo1Id], startDate: fmt(ago(20)), endDate: fmt(ago(10)), status: "Completed" as const, targetOutput: 500, actualOutput: 480, outputUnit: "pcs", shift: "Pagi", supervisor: "Pak Budi", notes: "Selesai lebih awal", createdAt: ago(20).toISOString(), updatedAt: ago(10).toISOString() },
    { id: uuidv4(), code: "PP-002", name: "Produksi Kue Lapis Reguler", description: "Produksi kue lapis mingguan", workOrderIds: [wo2Id], startDate: fmt(ago(5)), endDate: fmt(future(5)), status: "In Production" as const, targetOutput: 2000, actualOutput: 800, outputUnit: "pcs", shift: "Pagi", supervisor: "Bu Sari", notes: "", createdAt: ago(5).toISOString(), updatedAt: ago(1).toISOString() },
    { id: uuidv4(), code: "PP-003", name: "Rencana Produksi Minggu Depan", description: "Perencanaan produksi roti dan kue", workOrderIds: [wo3Id], startDate: fmt(future(3)), endDate: fmt(future(10)), status: "Draft" as const, targetOutput: 300, actualOutput: 0, outputUnit: "pcs", shift: "", supervisor: "", notes: "Menunggu konfirmasi bahan baku", createdAt: ago(2).toISOString(), updatedAt: ago(2).toISOString() },
  ];
  saveToLocalStorage(PP_KEY, ppList);
  console.log(`✅ 3 Production Plans created`);

  // ===== Quality Control =====
  const qcList = [
    { id: uuidv4(), code: "QC-001", type: "Final" as const, workOrderId: wo1Id, workOrderCode: "WO-001", productName: "Roti Tawar", productCode: "PRD-001", batchNumber: "BATCH-001", inspectionDate: fmt(ago(12)), inspector: "Pak Agus", sampleSize: 10, defectsFound: 0, status: "Passed" as const, checkItems: [
      { id: uuidv4(), parameter: "Warna", standard: "Cokelat keemasan", actual: "Cokelat keemasan", passed: true },
      { id: uuidv4(), parameter: "Tekstur", standard: "Lembut, tidak keras", actual: "Lembut", passed: true },
      { id: uuidv4(), parameter: "Berat", standard: "400-450 gram", actual: "420 gram", passed: true },
    ], overallNotes: "Kualitas baik, sesuai standar", createdAt: ago(12).toISOString(), updatedAt: ago(12).toISOString() },
    { id: uuidv4(), code: "QC-002", type: "In-Process" as const, workOrderId: wo2Id, workOrderCode: "WO-002", productName: "Kue Lapis", productCode: "PRD-002", batchNumber: "BATCH-002", inspectionDate: fmt(ago(3)), inspector: "Bu Rina", sampleSize: 5, defectsFound: 1, status: "Conditional" as const, checkItems: [
      { id: uuidv4(), parameter: "Warna Lapis", standard: "3 warna merata", actual: "Warna kurang merata di tepi", passed: false },
      { id: uuidv4(), parameter: "Ketebalan", standard: "3-4 cm", actual: "3.5 cm", passed: true },
      { id: uuidv4(), parameter: "Rasa", standard: "Manis, tidak terlalu manis", actual: "Sesuai standar", passed: true },
    ], overallNotes: "Warna perlu diperbaiki pada batch berikutnya", createdAt: ago(3).toISOString(), updatedAt: ago(3).toISOString() },
    { id: uuidv4(), code: "QC-003", type: "Incoming" as const, workOrderId: "", workOrderCode: "", productName: "Tepung Terigu", productCode: "MAT-001", batchNumber: "SUP-2024-45", inspectionDate: fmt(ago(1)), inspector: "Pak Agus", sampleSize: 3, defectsFound: 0, status: "Pending" as const, checkItems: [
      { id: uuidv4(), parameter: "Kelembaban", standard: "< 14%", actual: "12.5%", passed: true },
      { id: uuidv4(), parameter: "Kemasan", standard: "Utuh, tidak sobek", actual: "Belum diperiksa", passed: false },
    ], overallNotes: "Menunggu pemeriksaan kemasan", createdAt: ago(1).toISOString(), updatedAt: ago(1).toISOString() },
  ];
  saveToLocalStorage(QC_KEY, qcList);
  console.log(`✅ 3 Quality Control inspections created`);

  // ===== Inventory =====
  const invList = [
    { id: uuidv4(), materialCode: "MAT-001", materialName: "Tepung Terigu", category: "Bahan Baku", unit: "kg", currentStock: 100, minimumStock: 50, unitCost: 12000, totalValue: 1200000, location: "Gudang A", lastRestocked: fmt(ago(3)), createdAt: ago(30).toISOString(), updatedAt: ago(3).toISOString() },
    { id: uuidv4(), materialCode: "MAT-002", materialName: "Gula Pasir", category: "Bahan Baku", unit: "kg", currentStock: 30, minimumStock: 20, unitCost: 15000, totalValue: 450000, location: "Gudang A", lastRestocked: fmt(ago(7)), createdAt: ago(30).toISOString(), updatedAt: ago(7).toISOString() },
    { id: uuidv4(), materialCode: "MAT-003", materialName: "Ragi Instan", category: "Bahan Penolong", unit: "gram", currentStock: 500, minimumStock: 200, unitCost: 200, totalValue: 100000, location: "Gudang B", lastRestocked: fmt(ago(10)), createdAt: ago(30).toISOString(), updatedAt: ago(10).toISOString() },
    { id: uuidv4(), materialCode: "MAT-004", materialName: "Mentega", category: "Bahan Baku", unit: "kg", currentStock: 5, minimumStock: 10, unitCost: 40000, totalValue: 200000, location: "Cold Storage", lastRestocked: fmt(ago(14)), createdAt: ago(30).toISOString(), updatedAt: ago(14).toISOString() },
    { id: uuidv4(), materialCode: "MAT-005", materialName: "Susu Bubuk", category: "Bahan Baku", unit: "gram", currentStock: 2000, minimumStock: 1000, unitCost: 100, totalValue: 200000, location: "Gudang B", lastRestocked: fmt(ago(5)), createdAt: ago(30).toISOString(), updatedAt: ago(5).toISOString() },
    { id: uuidv4(), materialCode: "MAT-006", materialName: "Tepung Beras", category: "Bahan Baku", unit: "kg", currentStock: 15, minimumStock: 20, unitCost: 18000, totalValue: 270000, location: "Gudang A", lastRestocked: fmt(ago(12)), createdAt: ago(25).toISOString(), updatedAt: ago(12).toISOString() },
    { id: uuidv4(), materialCode: "MAT-007", materialName: "Santan Kelapa", category: "Bahan Baku", unit: "liter", currentStock: 20, minimumStock: 10, unitCost: 20000, totalValue: 400000, location: "Cold Storage", lastRestocked: fmt(ago(2)), createdAt: ago(25).toISOString(), updatedAt: ago(2).toISOString() },
    { id: uuidv4(), materialCode: "MAT-008", materialName: "Pewarna Makanan", category: "Bahan Penolong", unit: "ml", currentStock: 200, minimumStock: 100, unitCost: 500, totalValue: 100000, location: "Gudang B", lastRestocked: fmt(ago(15)), createdAt: ago(25).toISOString(), updatedAt: ago(15).toISOString() },
    { id: uuidv4(), materialCode: "PKG-001", materialName: "Plastik Kemasan Roti", category: "Kemasan", unit: "pcs", currentStock: 500, minimumStock: 200, unitCost: 500, totalValue: 250000, location: "Gudang C", lastRestocked: fmt(ago(4)), createdAt: ago(20).toISOString(), updatedAt: ago(4).toISOString() },
    { id: uuidv4(), materialCode: "PKG-002", materialName: "Kotak Kue", category: "Kemasan", unit: "pcs", currentStock: 100, minimumStock: 150, unitCost: 2000, totalValue: 200000, location: "Gudang C", lastRestocked: fmt(ago(20)), createdAt: ago(20).toISOString(), updatedAt: ago(20).toISOString() },
  ];
  saveToLocalStorage(INV_KEY, invList);
  console.log(`✅ 10 Inventory items created (3 low stock: Mentega, Tepung Beras, Kotak Kue)`);

  // ===== Stock Movements =====
  const movList = [
    { id: uuidv4(), inventoryId: invList[0].id, materialCode: "MAT-001", materialName: "Tepung Terigu", type: "In" as const, quantity: 50, previousStock: 50, newStock: 100, notes: "Restock dari supplier", performedBy: "Pak Budi", createdAt: ago(3).toISOString() },
    { id: uuidv4(), inventoryId: invList[0].id, materialCode: "MAT-001", materialName: "Tepung Terigu", type: "Out" as const, quantity: 250, previousStock: 350, newStock: 100, referenceType: "WorkOrder" as const, referenceId: wo1Id, referenceCode: "WO-001", notes: "Konsumsi untuk WO-001", performedBy: "Pak Budi", createdAt: ago(12).toISOString() },
    { id: uuidv4(), inventoryId: invList[1].id, materialCode: "MAT-002", materialName: "Gula Pasir", type: "Out" as const, quantity: 20, previousStock: 50, newStock: 30, referenceType: "WorkOrder" as const, referenceId: wo2Id, referenceCode: "WO-002", notes: "Konsumsi untuk WO-002", performedBy: "Bu Sari", createdAt: ago(5).toISOString() },
  ];
  saveToLocalStorage(MOV_KEY, movList);
  console.log(`✅ 3 Stock Movements created`);

  saveToLocalStorage(SEED_KEY, true);
  console.log("✅ Manufaktur seed data v2 complete!");
}
