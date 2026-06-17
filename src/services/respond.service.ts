import type { FastifyReply } from "fastify";
import type { RespondRequest } from "@models";

export class RespondService<T> implements RespondRequest<T> {
  readonly #message: Record<number, string> = {
    404: "Requested entity doesn't exist",
    400: "Request body has invalid field",
  };

  sendError(res: FastifyReply, code: number) {
    return res.status(code).send({ message: this.#message[code] });
  }

  sendSuccess(res: FastifyReply, code: number, data: T) {
    return res.status(code).send(data);
  }
}
