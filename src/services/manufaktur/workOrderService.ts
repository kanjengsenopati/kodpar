
import { WorkOrder } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getBOMById } from "./bomService";
import { v4 as uuidv4 } from "uuid";

const WO_KEY = "manufaktur_work_orders";

export function getAllWorkOrders(): WorkOrder[] {
  return getFromLocalStorage<WorkOrder[]>(WO_KEY, []);
}

export function getWorkOrderById(id: string): WorkOrder | undefined {
  return getAllWorkOrders().find((wo) => wo.id === id);
}

function generateWOCode(): string {
  const list = getAllWorkOrders();
  const num = list.length + 1;
  return `WO-${String(num).padStart(3, "0")}`;
}

export function createWorkOrder(data: Partial<WorkOrder>): WorkOrder | null {
  const bom = data.bomId ? getBOMById(data.bomId) : undefined;
  if (!bom) return null;

  const now = new Date().toISOString();
  const quantity = data.quantity || 1;
  const estimatedCost = bom.totalCost * quantity;

  const wo: WorkOrder = {
    id: uuidv4(),
    code: generateWOCode(),
    bomId: bom.id,
    bomCode: bom.code,
    productName: bom.productName,
    quantity,
    unit: bom.outputUnit,
    status: data.status || "Draft",
    priority: data.priority || "Medium",
    startDate: data.startDate || now.split("T")[0],
    dueDate: data.dueDate || "",
    assignedTo: data.assignedTo || "",
    notes: data.notes || "",
    estimatedCost,
    createdAt: now,
    updatedAt: now,
  };

  const list = getAllWorkOrders();
  list.push(wo);
  saveToLocalStorage(WO_KEY, list);
  return wo;
}

export function updateWorkOrder(id: string, data: Partial<WorkOrder>): WorkOrder | null {
  const list = getAllWorkOrders();
  const idx = list.findIndex((wo) => wo.id === id);
  if (idx === -1) return null;

  // If status changed to Completed, set completedDate
  if (data.status === "Completed" && list[idx].status !== "Completed") {
    data.completedDate = new Date().toISOString().split("T")[0];
  }

  // If BOM changed, recalculate cost
  if (data.bomId && data.bomId !== list[idx].bomId) {
    const bom = getBOMById(data.bomId);
    if (bom) {
      data.bomCode = bom.code;
      data.productName = bom.productName;
      data.unit = bom.outputUnit;
      const qty = data.quantity || list[idx].quantity;
      data.estimatedCost = bom.totalCost * qty;
    }
  } else if (data.quantity && data.quantity !== list[idx].quantity) {
    const bom = getBOMById(list[idx].bomId);
    if (bom) {
      data.estimatedCost = bom.totalCost * data.quantity;
    }
  }

  list[idx] = {
    ...list[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveToLocalStorage(WO_KEY, list);
  return list[idx];
}

export function deleteWorkOrder(id: string): boolean {
  const list = getAllWorkOrders();
  const filtered = list.filter((wo) => wo.id !== id);
  if (filtered.length === list.length) return false;
  saveToLocalStorage(WO_KEY, filtered);
  return true;
}
