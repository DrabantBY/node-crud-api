import { deepEqual, equal } from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";
import type { Product } from "@models";
import request from "supertest";
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

const useServer = () => {
  const app = createServerInstance({ logger: false });
  before(() => app.ready());
  after(() => app.close());
  return () => request(app.server);
};

describe("Test success CRUD operations", () => {
  let product: Product;
  const server = useServer();

  const testFetchList = async (expect: Product[]) => {
    const { status, body } = await server().get(BASE_URL);
    equal(status, 200);
    deepEqual(body, expect);
  };

  it("should return success response for GET request method", () =>
    testFetchList([]));

  it("should return success response for POST request method", async () => {
    const { status, body } = await server().post(BASE_URL).send(PRODUCT_BODY);
    equal(status, 201);
    deepEqual(body, { ...PRODUCT_BODY, id: body.id });
    product = body;
  });

  it("should return success response for GET request method by ID", async () => {
    const { status, body } = await server().get(`${BASE_URL}/${product.id}`);
    equal(status, 200);
    deepEqual(body, product);
  });

  it("should return success response for GET request method", () =>
    testFetchList([product]));

  it("should return success response for PUT request method", async () => {
    const { status, body } = await server()
      .put(`${BASE_URL}/${product.id}`)
      .send(PRODUCT_PART);
    equal(status, 200);
    deepEqual(body, { ...product, ...PRODUCT_PART });
    product = body;
  });

  it("should return success response for GET request method by ID", async () => {
    const { status, body } = await server().get(`${BASE_URL}/${product.id}`);
    equal(status, 200);
    deepEqual(body, product);
  });

  it("should return success response for GET request method", () =>
    testFetchList([product]));

  it("should return success response for DELETE request method", async () => {
    const { status, body } = await server().delete(`${BASE_URL}/${product.id}`);
    equal(status, 204);
    deepEqual(body, {});
  });

  it("should return success response for GET request method", () =>
    testFetchList([]));
});

describe("Test errors for invalid route id param (non-UUID)", () => {
  const url = `${BASE_URL}/not-an-uuid`;
  const server = useServer();

  it("should throw an error 400 for GET request method", () => {
    server().get(url).expect(400);
  });

  it("should throw an error 400 for PUT request method", () => {
    server().put(url).send(PRODUCT_PART).expect(400);
  });

  it("should throw an error 400 for DELETE request method", () => {
    server().delete(url).expect(400);
  });
});

describe("Test errors for POST request method with invalid body", () => {
  const server = useServer();

  it("should throw an error 400 for a body without required fields", () => {
    server().post(BASE_URL).send(PRODUCT_PART).expect(400);
  });

  it("should throw an error 400 for a body with some extra fields", () => {
    server()
      .post(BASE_URL)
      .send({ ...PRODUCT_BODY, id: randomUUID() })
      .expect(400);
  });

  it("should throw an error 400 for a body with incorrect field type", () => {
    server()
      .post(BASE_URL)
      .send({ ...PRODUCT_BODY, isStock: "yes" })
      .expect(400);
  });

  it("should throw an error 400 for a body with incorrect price field", () => {
    server()
      .post(BASE_URL)
      .send({ ...PRODUCT_BODY, price: 0 })
      .expect(400);
  });
});

describe("Test errors for PUT request method with invalid body", () => {
  const url = `${BASE_URL}/${randomUUID()}`;
  const server = useServer();

  it("should throw an error 400 for a body without any fields", () => {
    server().put(url).send({}).expect(400);
  });

  it("should throw an error 400 for a body with incorrect field", () => {
    server().put(url).send({ color: "black" }).expect(400);
  });

  it("should throw an error 400 for a body with incorrect field type", () => {
    server().put(url).send({ isStock: "yes" }).expect(400);
  });

  it("should throw an error 400 for a body with incorrect price field", () => {
    server().put(url).send({ price: 0 }).expect(400);
  });
});

describe("Test not found errors", () => {
  const server = useServer();

  it("should throw an error 404 for non-existent route", () => {
    server().get("/non-existent-route").expect(404);
  });

  it("should throw an error 404 for non-existent UUID route param", () => {
    server().delete(`${BASE_URL}/${randomUUID()}`).expect(404);
  });
});
