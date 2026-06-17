import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { productRoutes } from "@routes";
import { RespondService, ProductService } from "@services";

process.loadEnvFile();

const server: FastifyInstance = Fastify({
  logger: true,
});

server.decorate("state", new ProductService());
server.decorate("reply", new RespondService());
server.register(productRoutes, { prefix: process.env.BASE_URL });

try {
  await server.listen({ port: Number(process.env.PORT) });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
