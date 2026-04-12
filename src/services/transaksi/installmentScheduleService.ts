import { db } from "@/db/db";
import { Transaksi, JadwalAngsuran } from "@/types";
import { calculateLoanDetails } from "@/utils/loanCalculations";
import { generateUUIDv7 } from "../../utils/idUtils";

/**
 * Generate and persist an initial installment schedule for a new loan.
 * Strictly starts from the month FOLLOWING the approval date.
 */
export async function generateInitialSchedule(loan: Transaksi): Promise<JadwalAngsuran[]> {
  const { nominalPokok, nominalJasa, tenor, angsuranPerBulan } = calculateLoanDetails(
    loan.kategori || "Reguler",
    loan.jumlah,
    loan.tenor
  );

  const schedule: JadwalAngsuran[] = [];
  const approvalDate = new Date(loan.tanggal);
  const now = new Date().toISOString();

  const monthlyPokok = Math.round(nominalPokok / (tenor || 12));
  let remainingPokok = nominalPokok;

  // Create entries for each installment
  for (let i = 1; i <= (tenor || 12); i++) {
    const dueDate = new Date(approvalDate);
    dueDate.setMonth(approvalDate.getMonth() + i);

    const periodeOptions: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const periode = new Intl.DateTimeFormat('id-ID', periodeOptions).format(dueDate);

    let currentMonthlyPokok = monthlyPokok;
    if (i === (tenor || 12)) {
      currentMonthlyPokok = remainingPokok;
    } else {
      remainingPokok -= monthlyPokok;
    }

    const entry: JadwalAngsuran = {
      id: generateUUIDv7(),
      loanId: loan.id,
      anggotaId: loan.anggotaId,
      angsuranKe: i,
      periode,
      tanggalJatuhTempo: dueDate.toISOString(),
      nominalPokok: currentMonthlyPokok,
      nominalJasa: Math.round(nominalJasa),
      totalTagihan: Math.round(currentMonthlyPokok + nominalJasa),
      status: "BELUM_BAYAR",
      createdAt: now,
      updatedAt: now
    };

    schedule.push(entry);
  }

  // Persist to database
  if (schedule.length > 0) {
    await db.jadwal_angsuran.bulkAdd(schedule);
  }
  return schedule;
}

/**
 * Fetch the persisted schedule for a specific loan
 */
export async function getScheduleByLoanId(loanId: string): Promise<JadwalAngsuran[]> {
  return await db.jadwal_angsuran
    .where('loanId')
    .equals(loanId)
    .sortBy('angsuranKe');
}

/**
 * Update installment status when a payment is recorded
 * Logic: Matches the payment to the first UNPAID installment
 */
export async function linkPaymentToSchedule(payment: Transaksi): Promise<void> {
  if (payment.jenis !== "Angsuran" || !payment.referensiPinjamanId) return;

  const schedule = await getScheduleByLoanId(payment.referensiPinjamanId);
  const firstUnpaid = schedule.find(s => s.status === "BELUM_BAYAR");

  if (firstUnpaid && firstUnpaid.id) {
    await db.jadwal_angsuran.update(firstUnpaid.id, {
      status: "DIBAYAR",
      tanggalBayar: payment.tanggal,
      transaksiId: payment.id,
      updatedAt: new Date().toISOString()
    });
  }
}
