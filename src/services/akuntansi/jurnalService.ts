import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

// Export the type
export type { JurnalEntry, JurnalDetail };

/**
 * Get all journal entries
 */
export async function getAllJurnalEntries(): Promise<JurnalEntry[]> {
  try {
    return await db.jurnal.toArray();
  } catch (error) {
    console.error("Error loading journal entries:", error);
    return [];
  }
}

/**
 * Get journal entry by ID
 */
export async function getJurnalEntryById(id: string): Promise<JurnalEntry | undefined> {
  return await db.jurnal.get(id);
}

/**
 * Check if journal entry exists for a transaction reference
 */
export async function getJurnalEntryByReference(referensi: string): Promise<JurnalEntry | undefined> {
  return await db.jurnal.where('referensi').equals(referensi).first();
}

/**
 * Generate next journal number
 */
export async function generateJurnalNumber(): Promise<string> {
  // Add 1-20ms jitter to desynchronize concurrent batch calls
  const jitter = Math.floor(Math.random() * 20);
  if (jitter > 0) await new Promise(resolve => setTimeout(resolve, jitter));

  const entries = await getAllJurnalEntries();
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const prefix = `JU${currentYear}${currentMonth}`;
  const existingNumbers = entries
    .filter(entry => entry.nomorJurnal.startsWith(prefix))
    .map(entry => {
      const suffix = entry.nomorJurnal.replace(prefix, '');
      return parseInt(suffix) || 0;
    })
    .sort((a, b) => b - a);
  
  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Prepare a journal entry object without saving it to DB
 * Useful for atomic transactions
 */
export async function prepareJurnalEntry(entry: Omit<JurnalEntry, "id" | "createdAt" | "updatedAt">): Promise<JurnalEntry> {
  const nomorJurnal = entry.nomorJurnal || await generateJurnalNumber();
  
  return {
    ...entry,
    id: generateUUIDv7(),
    nomorJurnal,
    status: 'POSTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Create new journal entry with duplicate prevention and auto-posting
 */
export async function createJurnalEntry(entry: Omit<JurnalEntry, "id" | "createdAt" | "updatedAt">): Promise<SubmissionResult<JurnalEntry>> {
  try {
    // 1. DATA INTEGRITY AUDIT: Ensure debit/kredit is balanced
    const validationErrors = validateJurnalEntry(entry);
    if (validationErrors.length > 0) {
      return { success: false, error: `Integrity Audit Failed: ${validationErrors.join(", ")}` };
    }

    // 2. Check for existing entry with same reference to prevent duplicates
    if (entry.referensi) {
      const existingEntry = await getJurnalEntryByReference(entry.referensi);
      if (existingEntry) {
        return { success: true, data: existingEntry };
      }
    }
    
    const newEntry = await prepareJurnalEntry(entry);
    
    // 3. Commit to database
    try {
      await db.jurnal.add(newEntry);
    } catch (dbError: any) {
      if (dbError.name === 'ConstraintError') {
        // Retry with jitter for serial number collisions
        const jitter = Math.floor(Math.random() * 30) + 10;
        await new Promise(resolve => setTimeout(resolve, jitter));
        return await createJurnalEntry(entry);
      }
      return { success: false, error: `Jurnal DB Error: ${dbError.message || 'Gagal menyimpan jurnal'}` };
    }
    
    console.log(`✅ Journal entry created and auto-posted: ${newEntry.nomorJurnal}`);
    
    // Trigger sync events (non-critical)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('journal-entry-posted', {
        detail: { journalEntry: newEntry }
      }));
    }, 100);
    
    return { success: true, data: newEntry };
  } catch (error: any) {
    console.error("Critical error in createJurnalEntry:", error);
    return { success: false, error: `Jurnal System Error: ${error.message || 'Kesalahan internal'}` };
  }
}

/**
 * Update journal entry
 */
export async function updateJurnalEntry(id: string, updates: Partial<JurnalEntry>): Promise<JurnalEntry> {
  const existing = await db.jurnal.get(id);
  
  if (!existing) {
    throw new Error("Jurnal tidak ditemukan");
  }
  
  const updatedEntry: JurnalEntry = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await db.jurnal.put(updatedEntry);
  
  return updatedEntry;
}

export async function deleteJurnalEntry(id: string): Promise<boolean> {
  const entry = await db.jurnal.get(id);
  
  if (!entry) {
    throw new Error("Jurnal tidak ditemukan");
  }
  
  if (entry.status === 'POSTED') {
    throw new Error("Jurnal yang sudah di-post tidak dapat dihapus");
  }
  
  await db.jurnal.delete(id);
  
  return true;
}

export async function postJurnalEntry(id: string): Promise<JurnalEntry> {
  const entry = await db.jurnal.get(id);
  
  if (!entry) {
    throw new Error("Jurnal tidak ditemukan");
  }
  
  if (entry.status !== 'DRAFT') {
    throw new Error("Hanya jurnal draft yang dapat di-post");
  }
  
  const updatedEntry: JurnalEntry = {
    ...entry,
    status: 'POSTED',
    updatedAt: new Date().toISOString()
  };
  
  await db.jurnal.put(updatedEntry);
  
  return updatedEntry;
}

export async function reverseJurnalEntry(id: string): Promise<JurnalEntry> {
  const entry = await db.jurnal.get(id);
  
  if (!entry) {
    throw new Error("Jurnal tidak ditemukan");
  }
  
  if (entry.status !== 'POSTED') {
    throw new Error("Hanya jurnal yang sudah di-post yang dapat di-reverse");
  }
  
  const updatedEntry: JurnalEntry = {
    ...entry,
    status: 'REVERSED',
    updatedAt: new Date().toISOString()
  };
  
  await db.jurnal.put(updatedEntry);
  
  return updatedEntry;
}

export function validateJurnalEntry(entry: Partial<JurnalEntry>): string[] {
  const errors: string[] = [];
  
  if (!entry.tanggal) {
    errors.push("Tanggal harus diisi");
  }
  
  if (!entry.deskripsi || entry.deskripsi.trim() === '') {
    errors.push("Deskripsi harus diisi");
  }
  
  if (!entry.details || entry.details.length === 0) {
    errors.push("Detail jurnal harus diisi");
  }
  
  if (entry.details && entry.details.length > 0) {
    const totalDebit = entry.details.reduce((sum, detail) => sum + (detail.debit || 0), 0);
    const totalKredit = entry.details.reduce((sum, detail) => sum + (detail.kredit || 0), 0);
    
    if (totalDebit !== totalKredit) {
      errors.push("Total debit dan kredit harus sama");
    }
    
    if (totalDebit === 0) {
      errors.push("Total debit dan kredit tidak boleh nol");
    }
    
    entry.details.forEach((detail, index) => {
      if (!detail.coaId) {
        errors.push(`Detail ${index + 1}: Akun harus dipilih`);
      }
      
      if (detail.debit === 0 && detail.kredit === 0) {
        errors.push(`Detail ${index + 1}: Debit atau kredit harus diisi`);
      }
      
      if (detail.debit > 0 && detail.kredit > 0) {
        errors.push(`Detail ${index + 1}: Tidak boleh mengisi debit dan kredit secara bersamaan`);
      }
    });
  }
  
  return errors;
}
