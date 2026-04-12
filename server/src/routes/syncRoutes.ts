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
}

