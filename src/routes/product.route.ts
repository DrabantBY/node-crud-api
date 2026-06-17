import type { FastifyPluginAsync, FastifyReply } from "fastify";

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (_, res: FastifyReply) => {
    const products = await app.state.fetchAll();
    return app.reply.sendSuccess(res, 200, products);
  });

  app.get<{ Params: Record<"id", string> }>("/:id", async (req, res) => {
    const product = await app.state.fetchOne(req.params.id);

    return product
      ? app.reply.sendSuccess(res, 200, product)
      : app.reply.sendError(res, 404);
  });

  app.post("/", async (req, res) => {
    const product = await app.state.insertOne(req.body);
    return app.reply.sendSuccess(res, 201, product);
  });

  app.put<{ Params: Record<"id", string> }>("/:id", async (req, res) => {
    const product = await app.state.upsertOne(req.params.id, req.body);
    return product
      ? app.reply.sendSuccess(res, 200, product)
      : app.reply.sendError(res, 404);
  });

  app.delete<{ Params: Record<"id", string> }>("/:id", async (req, res) => {
    const success = await app.state.deleteOne(req.params.id);
    return success
      ? app.reply.sendSuccess(res, 204)
      : app.reply.sendError(res, 404);
  });
};
