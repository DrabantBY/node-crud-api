import type { FastifyReply } from "fastify";

export interface RespondRequest<T> {
  sendError(res: FastifyReply, code: number): unknown;
  sendSuccess(res: FastifyReply, code: number, data: T): unknown;
}
