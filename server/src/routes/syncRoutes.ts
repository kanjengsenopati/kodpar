import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { transaksiSyncSchema } from '../schemas/transaksiSchema.js';
import { pool } from '../db/connection.js';
import { generateJurnalNumber, generateUUIDv7 } from '../utils/jurnalUtils.js';
import { generateSakEpDetails } from '../utils/accountingLogic.js';
import { z } from 'zod';

export async function syncRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post('/sync/transaksi', {
    schema: {
      body: transaksiSyncSchema,
      response: {
        201: z.object({
          success: z.boolean(),
          message: z.string(),
          data: z.any()
        }),
        409: z.object({
          success: z.boolean(),
          error: z.string()
        }),
        500: z.object({
          success: z.boolean(),
          error: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. ATOMIC INSERT WITH IDEMPOTENCY GUARD
      const insertTxSql = `
        INSERT INTO transaksi (
          id, nomor_transaksi, tanggal, jenis, kategori,
          jumlah, anggota_id, keterangan, nominal_pokok, nominal_jasa, referensi_pinjaman_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;

      const txValues = [
        data.id,
        data.nomorTransaksi,
        data.tanggal,
        data.jenis,
        data.kategori || null,
        data.jumlah,
        data.anggotaId,
        data.keterangan || null,
        data.nominalPokok || 0,
        data.nominalJasa || 0,
        data.referensiPinjamanId || null
      ];

      const txResult = await client.query(insertTxSql, txValues);

      if (txResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return reply.status(409).send({
          success: false,
          error: `ID Collision: Transaksi ${data.id} sudah ada di server.`
        });
      }

      // 2. LINK PAYMENT TO INSTALLMENT SCHEDULE (If Angsuran)
      if (data.jenis === 'Angsuran' && data.referensiPinjamanId) {
        // Find first UNPAID installment
        const findInstallmentSql = `
          SELECT id FROM jadwal_angsuran
          WHERE loan_id = $1 AND status = 'BELUM_BAYAR'
          ORDER BY angsuran_ke ASC
          LIMIT 1
          FOR UPDATE; -- Lock the row to prevent race conditions
        `;

        const instResult = await client.query(findInstallmentSql, [data.referensiPinjamanId]);

        if (instResult.rows.length > 0) {
          const installmentId = instResult.rows[0].id;
          const updateInstallmentSql = `
            UPDATE jadwal_angsuran
            SET status = 'DIBAYAR',
                tanggal_bayar = $1,
                transaksi_id = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3;
          `;
          await client.query(updateInstallmentSql, [data.tanggal, data.id, installmentId]);
          console.log(`✅ [NEON-SYNC] Linked payment ${data.id} to installment ${installmentId}`);
        } else {
          // Warning: No unpaid installments found, but we still allow the transaction
          console.warn(`⚠️ [NEON-SYNC] No unpaid installments found for loan ${data.referensiPinjamanId}`);
        }
      }

      // 3. GENERATE SAK-EP JOURNAL ENTRIES
      const journalDetails = generateSakEpDetails(data);
      const nomorJurnal = await generateJurnalNumber(client);
      const jurnalId = generateUUIDv7();

      const insertJurnalSql = `
        INSERT INTO jurnal (
          id, nomor_jurnal, tanggal, deskripsi, referensi, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, 'POSTED', CURRENT_TIMESTAMP);
      `;

      await client.query(insertJurnalSql, [
        jurnalId,
        nomorJurnal,
        data.tanggal,
        data.keterangan || `Transaksi ${data.jenis} #${data.nomorTransaksi}`,
        `TXN-${data.id}`
      ]);

      for (const detail of journalDetails) {
        const insertJurnalDetailSql = `
          INSERT INTO jurnal_detail (
            id, jurnal_id, coa_id, debit, kredit
          ) VALUES ($1, $2, $3, $4, $5);
        `;
        await client.query(insertJurnalDetailSql, [
          generateUUIDv7(),
          jurnalId,
          detail.coaId,
          detail.debit,
          detail.kredit
        ]);
      }

      await client.query('COMMIT');
      console.log(`✅ [NEON-SYNC] Atomic transaction success: ${data.id} (#${data.nomorTransaksi})`);

      return reply.status(201).send({
        success: true,
        message: 'Transaksi berhasil disinkronkan secara atomik ke NeonDB',
        data
      });
    } catch (error: any) {
      await client.query('ROLLBACK');
      fastify.log.error(error);

      if (error.code === '23505') {
        return reply.status(409).send({
          success: false,
          error: `Nomor Transaksi ${data.nomorTransaksi} sudah digunakan.`
        });
      }

      return reply.status(500).send({
        success: false,
        error: `Database Atomic Error: ${error.message}`
      });
    } finally {
      client.release();
    }
  });

  server.get('/sync/pull', async (request, reply) => {
    try {
      console.log('📥 [NEON-PULL] Fetching master data for rehydration...');

      const [
        resAnggota, resTransaksi, resCOA, resSettings, resUnitKerja,
        resRoles, resMstJenis, resUsers, resPermissions,
        resProduk, resPemasok, resPenjualan, resPenjualanItem,
        resBom, resBomItem, resWorkOrder, resPembelian, resPembelianItem,
        resJadwal
      ] = await Promise.all([
        pool.query('SELECT * FROM anggota ORDER BY nama ASC'),
        pool.query('SELECT * FROM transaksi ORDER BY tanggal DESC LIMIT 500'),
        pool.query('SELECT * FROM coa'),
        pool.query('SELECT * FROM settings'),
        pool.query('SELECT * FROM unit_kerja'),
        pool.query('SELECT * FROM roles'),
        pool.query('SELECT * FROM mst_jenis'),
        pool.query('SELECT id, username, nama, email, role_id, anggota_id, aktif, last_login, created_at, updated_at FROM users'),
        pool.query('SELECT * FROM permissions'),
        pool.query('SELECT * FROM mst_produk'),
        pool.query('SELECT * FROM mst_pemasok'),
        pool.query('SELECT * FROM pos_penjualan ORDER BY tanggal DESC LIMIT 100'),
        pool.query('SELECT * FROM pos_penjualan_item'),
        pool.query('SELECT * FROM mfg_bom'),
        pool.query('SELECT * FROM mfg_bom_item'),
        pool.query('SELECT * FROM mfg_work_order'),
        pool.query('SELECT * FROM pos_pembelian'),
        pool.query('SELECT * FROM pos_pembelian_item'),
        pool.query('SELECT * FROM jadwal_angsuran')
      ]);

      return reply.send({
        success: true,
        data: {
          anggota: resAnggota.rows,
          transaksi: resTransaksi.rows,
          coa: resCOA.rows,
          settings: resSettings.rows,
          unitKerja: resUnitKerja.rows,
          roles: resRoles.rows,
          mstJenis: resMstJenis.rows,
          users: resUsers.rows,
          permissions: resPermissions.rows,
          produk: resProduk.rows,
          pemasok: resPemasok.rows,
          penjualan: resPenjualan.rows,
          penjualanItem: resPenjualanItem.rows,
          bom: resBom.rows,
          bomItem: resBomItem.rows,
          workOrder: resWorkOrder.rows,
          pembelian: resPembelian.rows,
          pembelianItem: resPembelianItem.rows,
          jadwalAngsuran: resJadwal.rows
        }
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: `Master Data Pull Failed: ${error.message}`
      });
    }
  });
}
