import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { syncRoutes } from './routes/syncRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import * as dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true,
});

// Configure Zod Type Provider
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Configure CORS for Frontend connectivity
await server.register(cors, {
  origin: true, // In production, replace with specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Register Routes
await server.register(syncRoutes, { prefix: '/api' });
await server.register(authRoutes, { prefix: '/api' });


const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Fastify Koperasi Sync Server running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
