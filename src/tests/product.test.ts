import { deepEqual, equal } from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { Product } from "@models";
import type { FastifyInstance } from "fastify";
import { createServerInstance } from "../app";

const BASE_URL = "/api/products";

const PRODUCT_BODY = {
  name: "Mac Studio",
  description: "M3 Ultra chip",
  price: 4.199,
  category: "electronics",
  inStock: true,
};

const PRODUCT_PART = { price: 1000, inStock: false };

let app: FastifyInstance;

beforeEach(async () => {
  app = createServerInstance({ logger: false });
  await app.ready();
});

afterEach(async () => {
  await app.close();
});

describe("Test success CRUD operations", () => {
  it("should return success response for request methods", async () => {
    const postRes = await app.inject({
      method: "POST",
      url: BASE_URL,
      payload: PRODUCT_BODY,
    });
    equal(postRes.statusCode, 201);
    const PRODUCT_FULL = postRes.json<Product>();

    const { id } = PRODUCT_FULL;
    const url = `${BASE_URL}/${id}`;

    deepEqual(PRODUCT_FULL, { id, ...PRODUCT_BODY });

    const getRes = await app.inject({ method: "GET", url });
    equal(getRes.statusCode, 200);
    deepEqual(getRes.json<Product>(), PRODUCT_FULL);

    const updateRes = await app.inject({
      method: "PUT",
      url,
      payload: PRODUCT_PART,
    });
    equal(updateRes.statusCode, 200);
    deepEqual(updateRes.json<Product>(), {
      ...PRODUCT_FULL,
      ...PRODUCT_PART,
    });

    const getAllRes = await app.inject({
      method: "GET",
      url: BASE_URL,
    });
    equal(getAllRes.statusCode, 200);
    deepEqual(getAllRes.json(), [
      {
        ...PRODUCT_FULL,
        ...PRODUCT_PART,
      },
    ]);

    const deleteRes = await app.inject({ method: "DELETE", url });
    equal(deleteRes.statusCode, 204);
    equal(deleteRes.body, "");

    const getResEmpty = await app.inject({
      method: "GET",
      url: BASE_URL,
    });
    equal(getResEmpty.statusCode, 200);
    deepEqual(getResEmpty.json(), []);
  });
});

describe("Test validation errors", () => {
  it("should throw an error 400 for an invalid request id (non-UUID)", async () => {
    const url = `${BASE_URL}/not-a-uuid`;

    const getRes = await app.inject({ method: "GET", url });
    equal(getRes.statusCode, 400);

    const putRes = await app.inject({
      method: "PUT",
      url,
      payload: PRODUCT_PART,
    });
    equal(putRes.statusCode, 400);

    const deleteRes = await app.inject({ method: "DELETE", url });
    equal(deleteRes.statusCode, 400);
  });

  it("should throw an error 400 for an invalid POST request body", async () => {
    const part = await app.inject({
      method: "POST",
      url: BASE_URL,
      payload: PRODUCT_PART,
    });
    equal(part.statusCode, 400);

    const extra = await app.inject({
      method: "POST",
      url: BASE_URL,
      payload: { ...PRODUCT_BODY, id: randomUUID() },
    });
    equal(extra.statusCode, 400);

    const type = await app.inject({
      method: "POST",
      url: BASE_URL,
      payload: { ...PRODUCT_BODY, isStock: "yes" },
    });
    equal(type.statusCode, 400);

    const price = await app.inject({
      method: "POST",
      url: BASE_URL,
      payload: { ...PRODUCT_BODY, price: 0 },
    });
    equal(price.statusCode, 400);
  });

  it("should throw an error 400 for an invalid PUT request body", async () => {
    const url = `${BASE_URL}/${randomUUID()}`;

    const empty = await app.inject({
      method: "PUT",
      url,
      payload: {},
    });
    equal(empty.statusCode, 400);

    const unknown = await app.inject({
      method: "PUT",
      url,
      payload: { color: "black" },
    });
    equal(unknown.statusCode, 400);

    const price = await app.inject({
      method: "PUT",
      url,
      payload: { price: -5 },
    });
    equal(price.statusCode, 400);
  });
});

describe("Test not found errors", () => {
  it("should throw an error 404 for non-existent request UUID", async () => {
    const url = `${BASE_URL}/${randomUUID()}`;

    const getRes = await app.inject({ method: "GET", url });
    equal(getRes.statusCode, 404);

    const putRes = await app.inject({
      method: "PUT",
      url,
      payload: PRODUCT_PART,
    });
    equal(putRes.statusCode, 404);

    const deleteRes = await app.inject({ method: "DELETE", url });
    equal(deleteRes.statusCode, 404);
  });

  it("should throw an error 404 for an unknown route", async () => {
    const res = await app.inject({ method: "GET", url: "/api/unknown" });
    equal(res.statusCode, 404);
  });
});
