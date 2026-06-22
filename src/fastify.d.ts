import type { ProductController } from "@controllers";

declare module "fastify" {
  interface FastifyInstance {
    controller: ProductController;
  }
}
