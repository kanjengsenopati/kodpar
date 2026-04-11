
import { Transaksi } from "@/types";
import { JurnalDetail } from "@/types/akuntansi";

/**
 * SAK EP (Standar Akuntansi Keuangan Entitas Privat) Integrity Engine
 * Centralizes all Debit/Kredit mappings for cooperative transactions.
 */

// Chart of Account Constants (SSOT from coaService)
const COA_KAS = "coa-kas"; 
const COA_PIUTANG = "coa-piutang-anggota";
const COA_SIMPANAN_POKOK = "coa-simpanan-pokok";
const COA_SIMPANAN_WAJIB = "coa-simpanan-wajib";
const COA_SIMPANAN_SUKARELA = "coa-simpanan-sukarela";
const COA_PENDAPATAN_JASA = "coa-pendapatan-jasa-pinjaman";

// Jenis ID Constants (SSOT from jenisService)
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
      details.push({ coaId: COA_KAS, debit: jumlah, kredit: 0 });
      
      let targetCoa = COA_SIMPANAN_SUKARELA;
      if (transaksi.kategori === ID_SIMPANAN_POKOK || transaksi.kategori === "Simpanan Pokok") {
        targetCoa = COA_SIMPANAN_POKOK;
      } else if (transaksi.kategori === ID_SIMPANAN_WAJIB || transaksi.kategori === "Simpanan Wajib") {
        targetCoa = COA_SIMPANAN_WAJIB;
      }
      
      details.push({ coaId: targetCoa, debit: 0, kredit: jumlah });
      break;

    case "Pinjam":
      // (D) Piutang -> (K) Kas
      details.push({ coaId: COA_PIUTANG, debit: jumlah, kredit: 0 });
      details.push({ coaId: COA_KAS, debit: 0, kredit: jumlah });
      break;

    case "Angsuran":
      // (D) Kas -> (K) Piutang + (K) Pendapatan Jasa
      const nominalPokok = transaksi.nominalPokok || 0;
      const nominalJasa = transaksi.nominalJasa || 0;
      const total = nominalPokok + nominalJasa;

      details.push({ coaId: COA_KAS, debit: total, kredit: 0 });
      
      if (nominalPokok > 0) {
        details.push({ coaId: COA_PIUTANG, debit: 0, kredit: nominalPokok });
      }
      if (nominalJasa > 0) {
        details.push({ coaId: COA_PENDAPATAN_JASA, debit: 0, kredit: nominalJasa });
      }
      
      // Safety check: if total doesn't match sum of details, force balance to Pendapatan or general
      const currentKredit = details.reduce((sum, d) => sum + d.kredit, 0);
      if (currentKredit !== total) {
        const diff = total - currentKredit;
        if (diff !== 0) {
          // If we only have 'jumlah' but no breakdown, attribute everything to Piutang (Conservative approach)
          if (details.length === 1) {
            details.push({ coaId: COA_PIUTANG, debit: 0, kredit: total });
          }
        }
      }
      break;

    case "Penarikan":
      // (D) Simpanan -> (K) Kas
      let sourceCoa = COA_SIMPANAN_SUKARELA;
      if (transaksi.kategori === ID_SIMPANAN_POKOK || transaksi.kategori === "Simpanan Pokok") {
        sourceCoa = COA_SIMPANAN_POKOK;
      } else if (transaksi.kategori === ID_SIMPANAN_WAJIB || transaksi.kategori === "Simpanan Wajib") {
        sourceCoa = COA_SIMPANAN_WAJIB;
      }

      details.push({ coaId: sourceCoa, debit: jumlah, kredit: 0 });
      details.push({ coaId: COA_KAS, debit: 0, kredit: jumlah });
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
