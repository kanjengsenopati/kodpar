
import { QualityControl } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const QC_KEY = "manufaktur_quality_control";

export function getAllQualityControls(): QualityControl[] {
  return getFromLocalStorage<QualityControl[]>(QC_KEY, []);
}

export function getQualityControlById(id: string): QualityControl | undefined {
  return getAllQualityControls().find((q) => q.id === id);
}

function generateQCCode(): string {
  const list = getAllQualityControls();
  const num = list.length + 1;
  return `QC-${String(num).padStart(3, "0")}`;
}

export function createQualityControl(data: Partial<QualityControl>): QualityControl {
  const now = new Date().toISOString();
  const qc: QualityControl = {
    id: uuidv4(),
    code: generateQCCode(),
    type: data.type || "Final",
    workOrderId: data.workOrderId || "",
    workOrderCode: data.workOrderCode || "",
    productName: data.productName || "",
    productCode: data.productCode || "",
    batchNumber: data.batchNumber || "",
    inspectionDate: data.inspectionDate || now.split("T")[0],
    inspector: data.inspector || "",
    sampleSize: data.sampleSize || 0,
    defectsFound: data.defectsFound || 0,
    status: data.status || "Pending",
    checkItems: data.checkItems || [],
    overallNotes: data.overallNotes || "",
    createdAt: now,
    updatedAt: now,
  };
  const list = getAllQualityControls();
  list.push(qc);
  saveToLocalStorage(QC_KEY, list);
  return qc;
}

export function updateQualityControl(id: string, data: Partial<QualityControl>): QualityControl | null {
  const list = getAllQualityControls();
  const idx = list.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  saveToLocalStorage(QC_KEY, list);
  return list[idx];
}

export function deleteQualityControl(id: string): boolean {
  const list = getAllQualityControls();
  const filtered = list.filter((q) => q.id !== id);
  if (filtered.length === list.length) return false;
  saveToLocalStorage(QC_KEY, filtered);
  return true;
}
