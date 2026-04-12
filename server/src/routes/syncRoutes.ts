import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { transaksiSyncSchema } from '../schemas/transaksiSchema.js';

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

    // SaaS SYNC LOGIC:
    // 1. We MUST use the ID from the client (data.id) to maintain IndexedDB <-> Neon sync.
    // 2. Do NOT generate a new ID on the server.
    
    try {
      // MOCK DB REPOSITORY (Replace with Neon/Prisma/Postgres call)
      // const exists = await db.transaksi.findUnique({ where: { id: data.id } });
      const mockDatabase: any[] = []; // In-memory mock for demo
      const exists = mockDatabase.find(t => t.id === data.id);

      if (exists) {
        return reply.status(409).send({
          success: false,
          error: `ID Collision: Transaksi dengan ID ${data.id} sudah tersinkronisasi.`
        });
      }

      // INSERT LOGIC (Atomic)
      // await db.transaksi.create({ data });
      console.log(`📥 Syncing transaction from client: ${data.id} (#${data.nomorTransaksi})`);

      return reply.status(201).send({
        success: true,
        message: 'Transaksi berhasil disinkronkan ke server',
        data
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Terjadi kesalahan sistem saat sinkronisasi data.'
      });
    }
  });
}
