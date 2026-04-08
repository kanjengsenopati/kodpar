
import { ProductionPlan } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const PP_KEY = "manufaktur_production_plans";

export function getAllProductionPlans(): ProductionPlan[] {
  return getFromLocalStorage<ProductionPlan[]>(PP_KEY, []);
}

export function getProductionPlanById(id: string): ProductionPlan | undefined {
  return getAllProductionPlans().find((p) => p.id === id);
}

function generatePPCode(): string {
  const list = getAllProductionPlans();
  const num = list.length + 1;
  return `PP-${String(num).padStart(3, "0")}`;
}

export function createProductionPlan(data: Partial<ProductionPlan>): ProductionPlan {
  const now = new Date().toISOString();
  const plan: ProductionPlan = {
    id: uuidv4(),
    code: generatePPCode(),
    name: data.name || "",
    description: data.description || "",
    workOrderIds: data.workOrderIds || [],
    startDate: data.startDate || now.split("T")[0],
    endDate: data.endDate || "",
    status: data.status || "Draft",
    targetOutput: data.targetOutput || 0,
    actualOutput: data.actualOutput || 0,
    outputUnit: data.outputUnit || "pcs",
    shift: data.shift || "",
    supervisor: data.supervisor || "",
    notes: data.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  const list = getAllProductionPlans();
  list.push(plan);
  saveToLocalStorage(PP_KEY, list);
  return plan;
}

export function updateProductionPlan(id: string, data: Partial<ProductionPlan>): ProductionPlan | null {
  const list = getAllProductionPlans();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  saveToLocalStorage(PP_KEY, list);
  return list[idx];
}

export function deleteProductionPlan(id: string): boolean {
  const list = getAllProductionPlans();
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length === list.length) return false;
  saveToLocalStorage(PP_KEY, filtered);
  return true;
}
