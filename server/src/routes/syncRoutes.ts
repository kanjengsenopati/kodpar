import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { transaksiSyncSchema } from '../schemas/transaksiSchema.js';
import { query } from '../db/connection.js';

export async function syncRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post('/sync/transaksi', {
    schema: {
      body: transaksiSyncSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object', additionalProperties: true }
          }
        },
        409: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    
    try {
      // ATOMIC INSERT WITH IDEMPOTENCY GUARD
      // We use ON CONFLICT to prevent double-sync from same client
      const sql = `
        INSERT INTO transaksi (
          id, nomor_transaksi, tanggal, jenis, kategori, 
          jumlah, anggota_id, keterangan, nominal_pokok, nominal_jasa
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;

      const values = [
        data.id, 
        data.nomorTransaksi, 
        data.tanggal, 
        data.jenis, 
        data.kategori || null,
        data.jumlah, 
        data.anggotaId, 
        data.keterangan || null,
        data.nominalPokok || 0,
        data.nominalJasa || 0
      ];

      const result = await query(sql, values);

      if (result.rowCount === 0) {
        // ID was already in database (Conflict)
        return reply.status(409).send({
          success: false,
          error: `ID Collision: Transaksi ${data.id} sudah ada di server.`
        });
      }

      console.log(`✅ [NEON-SYNC] Saved transaction: ${data.id} (#${data.nomorTransaksi})`);

      return reply.status(201).send({
        success: true,
        message: 'Transaksi berhasil disinkronkan ke NeonDB',
        data
      });
    } catch (error: any) {
      fastify.log.error(error);
      
      // Handle Unique Constraint on nomor_transaksi
      if (error.code === '23505') {
        return reply.status(409).send({
          success: false,
          error: `Nomor Transaksi ${data.nomorTransaksi} sudah digunakan.`
        });
      }

      return reply.status(500).send({
        success: false,
        error: `Database Error: ${error.message}`
      });
    }
  });

  /**
   * UNIVERSAL PULL ENDPOINT (NeonDB -> Client)
   * Fetches all master data for initial rehydration.
   */
  server.get('/sync/pull', async (request, reply) => {
    try {
      console.log('📥 [NEON-PULL] Fetching master data for rehydration...');

      const [
        resAnggota, resTransaksi, resCOA, resSettings, resUnitKerja, 
        resRoles, resMstJenis, resUsers, resPermissions,
        resProduk, resPemasok, resPenjualan, resPenjualanItem,
        resBom, resBomItem, resWorkOrder, resPembelian, resPembelianItem
      ] = await Promise.all([
        query('SELECT * FROM anggota ORDER BY nama ASC'),
        query('SELECT * FROM transaksi ORDER BY tanggal DESC LIMIT 500'),
        query('SELECT * FROM coa'),
        query('SELECT * FROM settings'),
        query('SELECT * FROM unit_kerja'),
        query('SELECT * FROM roles'),
        query('SELECT * FROM mst_jenis'),
        query('SELECT id, username, nama, email, role_id, anggota_id, aktif, last_login, created_at, updated_at FROM users'),
        query('SELECT * FROM permissions'),
        query('SELECT * FROM mst_produk'),
        query('SELECT * FROM mst_pemasok'),
        query('SELECT * FROM pos_penjualan ORDER BY tanggal DESC LIMIT 100'),
        query('SELECT * FROM pos_penjualan_item'),
        query('SELECT * FROM mfg_bom'),
        query('SELECT * FROM mfg_bom_item'),
        query('SELECT * FROM mfg_work_order'),
        query('SELECT * FROM pos_pembelian'),
        query('SELECT * FROM pos_pembelian_item')
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
          pembelianItem: resPembelianItem.rows
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


