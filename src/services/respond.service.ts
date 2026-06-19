import type { FastifyReply } from "fastify";

export class RespondService {
  readonly #message: Record<number, string> = {
    404: "An entity with this id doesn't exist",
    400: "The passed entity id doesn't match UUID",
  };

  sendError(
    res: FastifyReply,
    code: number,
    message: string = this.#message[code] ?? "Unexpected error",
  ) {
    return res.status(code).send({ message });
  }

  sendSuccess<T>(res: FastifyReply, code: number, data?: T) {
    return res.status(code).send(data);
  }
}
