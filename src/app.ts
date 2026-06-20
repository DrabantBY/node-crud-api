import { ProductController } from "@controllers";
import { productRoutes } from "@routes";
import { ProductService, RespondService } from "@services";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import Fastify from "fastify";

export const createServerInstance = (
  options: FastifyServerOptions,
): FastifyInstance => {
  const app = Fastify(options);

  app.decorate(
    "controller",
    new ProductController(new ProductService(), new RespondService()),
  );

  app.setNotFoundHandler(({ url }, res) => {
    res.code(404).send({
      message: `Route ${url} doesn't exist`,
    });
  });

  app.setErrorHandler((err, req, res) => {
    req.log.error(err);
    res.code(500).send({
      message: "Internal server error.",
    });
  });

  app.register(productRoutes, {
    prefix: process.env.BASE_URL ?? "/api/products",
  });

  return app;
};
