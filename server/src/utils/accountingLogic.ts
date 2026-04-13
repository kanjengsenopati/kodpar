export const COA_MAP = {
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

export function generateSakEpDetails(transaksi: any) {
  const details: any[] = [];
  const jumlah = Number(transaksi.jumlah) || 0;

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
      const totalDebit = jumlah;
      details.push({ coaId: COA_MAP.KAS, debit: totalDebit, kredit: 0 });

      let nominalPokok = Number(transaksi.nominalPokok) || 0;
      let nominalJasa = Number(transaksi.nominalJasa) || 0;

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
