import type { FastifyPluginAsync } from "fastify";

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", app.controller.fetchAll);
  app.get("/:id", app.controller.fetchOne);
  app.put("/:id", app.controller.updateOne);
  app.post("/", app.controller.insertOne);
  app.delete("/:id", app.controller.deleteOne);
};
