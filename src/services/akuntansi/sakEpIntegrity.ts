
import { Transaksi } from "@/types";
import { JurnalDetail } from "@/types/akuntansi";
import { db } from "@/db/db";

/**
 * SAK EP (Standar Akuntansi Keuangan Entitas Privat) Integrity Engine
 * Centralizes all Debit/Kredit mappings for cooperative transactions.
 */

// Dynamic COA Mapping Utility (SaaS Ready)
// In a full SaaS, these would be fetched from the database per-tenant.
const COA_MAP = {
  KAS: "coa-kas",
  PIUTANG: "coa-piutang-anggota",
  SIMPANAN_POKOK: "coa-simpanan-pokok",
  SIMPANAN_WAJIB: "coa-simpanan-wajib",
  SIMPANAN_SUKARELA: "coa-simpanan-sukarela",
  PENDAPATAN_JASA: "coa-pendapatan-jasa-pinjaman"
};

// Jenis ID Constants (Shared global defaults)
const ID_SIMPANAN_POKOK = "018e6a12-8c1d-7a01-8000-000000000501";
const ID_SIMPANAN_WAJIB = "018e6a12-8c1d-7a01-8000-000000000502";

/**
 * Generate Double-Entry details based on SAK EP mappings
 */
export function generateSakEpDetails(transaksi: Transaksi): JurnalDetail[] {
  const details: JurnalDetail[] = [];
  const jumlah = transaksi.jumlah || 0;

  switch (transaksi.jenis) {
    case "Simpan":
      // (D) Kas -> (K) Simpanan
      details.push({ coaId: COA_MAP.KAS, debit: jumlah, kredit: 0 });
      
      let targetCoa = COA_MAP.SIMPANAN_SUKARELA;
      if (transaksi.kategori === ID_SIMPANAN_POKOK || transaksi.kategori === "Simpanan Pokok") {
        targetCoa = COA_MAP.SIMPANAN_POKOK;
      } else if (transaksi.kategori === ID_SIMPANAN_WAJIB || transaksi.kategori === "Simpanan Wajib") {
        targetCoa = COA_MAP.SIMPANAN_WAJIB;
      }
      
      details.push({ coaId: targetCoa, debit: 0, kredit: jumlah });
      break;

    case "Pinjam":
      // (D) Piutang -> (K) Kas
      details.push({ coaId: COA_MAP.PIUTANG, debit: jumlah, kredit: 0 });
      details.push({ coaId: COA_MAP.KAS, debit: 0, kredit: jumlah });
      break;

    case "Angsuran":
      // (D) Kas -> (K) Piutang + (K) Pendapatan Jasa
      const totalDebit = transaksi.jumlah || 0;
      details.push({ coaId: COA_MAP.KAS, debit: totalDebit, kredit: 0 });

      let nominalPokok = transaksi.nominalPokok || 0;
      let nominalJasa = transaksi.nominalJasa || 0;
      
      const currentSum = nominalPokok + nominalJasa;
      if (currentSum !== totalDebit) {
        if (currentSum === 0) {
          nominalPokok = totalDebit;
        } else {
          const diff = totalDebit - currentSum;
          nominalPokok += diff;
        }
      }

      if (nominalPokok > 0) {
        details.push({ coaId: COA_MAP.PIUTANG, debit: 0, kredit: nominalPokok });
      }
      if (nominalJasa > 0) {
        details.push({ coaId: COA_MAP.PENDAPATAN_JASA, debit: 0, kredit: nominalJasa });
      }
      break;

    case "Penarikan":
      // (D) Simpanan -> (K) Kas
      let sourceCoa = COA_MAP.SIMPANAN_SUKARELA;
      if (transaksi.kategori === ID_SIMPANAN_POKOK || transaksi.kategori === "Simpanan Pokok") {
        sourceCoa = COA_MAP.SIMPANAN_POKOK;
      } else if (transaksi.kategori === ID_SIMPANAN_WAJIB || transaksi.kategori === "Simpanan Wajib") {
        sourceCoa = COA_MAP.SIMPANAN_WAJIB;
      }

      details.push({ coaId: sourceCoa, debit: jumlah, kredit: 0 });
      details.push({ coaId: COA_MAP.KAS, debit: 0, kredit: jumlah });
      break;
  }

  return details;
}

/**
 * Validate balanced SAK EP transaction
 */
export function validateSakEpBalance(details: JurnalDetail[]): boolean {
  if (details.length < 2) return false;
  const totalDebit = details.reduce((sum, d) => sum + d.debit, 0);
  const totalKredit = details.reduce((sum, d) => sum + d.kredit, 0);
  return totalDebit > 0 && totalDebit === totalKredit;
}
