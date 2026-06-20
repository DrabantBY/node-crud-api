import { ProductController } from "@controllers";
import { productRoutes } from "@routes";
import { ProductService, RespondService } from "@services";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

process.loadEnvFile();

const server: FastifyInstance = Fastify({
  logger: true,
});

server.decorate(
  "controller",
  new ProductController(new ProductService(), new RespondService()),
);

server.setNotFoundHandler(({ url }, res) => {
  res.code(404).send({
    message: `Route ${url} doesn't exist`,
  });
});

server.setErrorHandler((err, req, res) => {
  req.log.error(err);
  res.code(500).send({
    message: "Internal server error.",
  });
});

server.register(productRoutes, { prefix: process.env.BASE_URL });

try {
  await server.listen({ port: Number(process.env.PORT) });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
