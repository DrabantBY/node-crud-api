import type { ParamsBody, ParamsId, RequestParams } from "@models";
import type { ProductService, RespondService } from "@services";
import {
  productBodyValidator,
  productPartValidator,
  productUUIDValidator,
} from "@validators";
import type { FastifyReply, FastifyRequest } from "fastify";

export class ProductController {
  readonly #state: ProductService;
  readonly #reply: RespondService;

  constructor(state: ProductService, reply: RespondService) {
    this.#state = state;
    this.#reply = reply;
  }

  fetchAll = async (_: FastifyRequest, res: FastifyReply) => {
    const products = this.#state.fetchAll();
    return this.#reply.sendSuccess(res, 200, products);
  };

  fetchOne = async (
    { params }: FastifyRequest<ParamsId>,
    res: FastifyReply,
  ) => {
    if (!productUUIDValidator(params.id))
      return this.#reply.sendError(res, 400);

    const product = this.#state.fetchOne(params.id);

    return product
      ? this.#reply.sendSuccess(res, 200, product)
      : this.#reply.sendError(res, 404);
  };

  insertOne = async (
    { body }: FastifyRequest<ParamsBody>,
    res: FastifyReply,
  ) => {
    if (!productBodyValidator(body) || body.price <= 0)
      return this.#reply.sendError(res, 400, "Request body has invalid field");

    const product = this.#state.insertOne(body);
    return this.#reply.sendSuccess(res, 201, product);
  };

  updateOne = async (
    { params, body }: FastifyRequest<RequestParams>,
    res: FastifyReply,
  ) => {
    if (!productUUIDValidator(params.id))
      return this.#reply.sendError(res, 400);

    if (
      !productPartValidator(body) ||
      (body.price !== undefined && body.price <= 0)
    )
      return this.#reply.sendError(res, 400, "Request body has invalid field");

    const product = this.#state.updateOne(params.id, body);

    return product
      ? this.#reply.sendSuccess(res, 200, product)
      : this.#reply.sendError(res, 404);
  };

  deleteOne = async (
    { params }: FastifyRequest<ParamsId>,
    res: FastifyReply,
  ) => {
    if (!productUUIDValidator(params.id))
      return this.#reply.sendError(res, 400);

    const success = this.#state.deleteOne(params.id);

    return success
      ? this.#reply.sendSuccess(res, 204)
      : this.#reply.sendError(res, 404);
  };
}
