import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

export async function authRoutes(fastify: FastifyInstance) {
  
  fastify.post('/auth/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      })
    }
  }, async (request, reply) => {
    const { email, password } = request.body as any;

    try {
      // 1. Find User by Email
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return reply.status(401).send({ success: false, error: 'Email atau password salah' });
      }

      // 2. Verify Password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
         return reply.status(401).send({ success: false, error: 'Email atau password salah' });
      }

      // 3. Return User Data (Sanitized)
      // Note: We're keeping the response format compatible with frontend ExtendedUser
      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nama: user.nama,
          email: user.email,
          roleId: user.role_id,
          anggotaId: user.anggota_id,
          aktif: user.aktif,
          lastLogin: user.last_login,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      };

    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: 'Terjadi kesalahan pada server' });
    }
  });
}
