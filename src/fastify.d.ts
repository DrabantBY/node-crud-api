import type { ProductDbState, RespondRequest } from "@models";

declare module "fastify" {
  interface FastifyInstance {
    state: ProductDbState;
    reply: RespondRequest;
  }
}

export {};
