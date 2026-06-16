import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

process.loadEnvFile();

const server: FastifyInstance = Fastify({
  logger: true,
});

// Declare a route
server.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

// Run the server!
try {
  await server.listen({ port: Number(process.env.PORT) });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
