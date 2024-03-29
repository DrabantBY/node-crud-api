import request from 'supertest';
import { server } from '../src';
import 'dotenv/config';

const app = request(server);

const changeErrorData = (
  statusCode: number,
  errorCode: number,
  body: { message: string },
  errorMessage: string
) => {
  expect(statusCode).toBe(errorCode);
  expect(body.message).toBe(errorMessage);
};

let userId: string;
const INVALID_URL = '/invalidUrl';
const user = { username: 'Eugene', age: 35, hobbies: ['js', 'ts'] };
const data = { username: 'Simon', age: 25, hobbies: ['soccer'] };
const invalidUser = { username: 'Alex', age: 45, status: 'developer' };
const invalidData = { username: 'Michael', age: 0 };
const invalidJSON = '{ "username" "John" age: 30 }';

afterAll(() => {
  server.close();
});

describe('return success responses', () => {
  it('return an empty array by GET request', async () => {
    const { statusCode, body } = await app.get(process.env.BASE_URL!);

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(0);
  });

  it('return new user by POST request', async () => {
    const { statusCode, body } = await app
      .post(process.env.BASE_URL!)
      .send(user);

    expect(statusCode).toBe(201);
    expect(body.username).toBe('Eugene');
    expect(body.age).toBe(35);
    expect(body.hobbies).toHaveLength(2);
    expect(body.hobbies).toEqual(['js', 'ts']);

    userId = body.id;
  });

  it('return new user by GET request by id', async () => {
    const { statusCode, body } = await app.get(
      process.env.BASE_URL + '/' + userId
    );

    expect(statusCode).toBe(200);
    expect(body.username).toBe('Eugene');
    expect(body.age).toBe(35);
    expect(body.hobbies).toHaveLength(2);
    expect(body.hobbies).toEqual(['js', 'ts']);
  });

  it('return users array by GET request', async () => {
    const { statusCode, body } = await app.get(process.env.BASE_URL!);

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].username).toBe('Eugene');
    expect(body[0].age).toBe(35);
    expect(body[0].hobbies).toEqual(['js', 'ts']);
  });

  it('update user by PUT request', async () => {
    const { statusCode, body } = await app
      .put(process.env.BASE_URL + '/' + userId)
      .send(data);

    expect(statusCode).toBe(200);
    expect(body.username).toBe('Simon');
    expect(body.age).toBe(25);
    expect(body.hobbies).toHaveLength(1);
    expect(body.hobbies).toEqual(['soccer']);
  });

  it('return updated user by GET request by id', async () => {
    const { statusCode, body } = await app.get(
      process.env.BASE_URL + '/' + userId
    );

    expect(statusCode).toBe(200);
    expect(body.username).toBe('Simon');
    expect(body.age).toBe(25);
    expect(body.hobbies).toHaveLength(1);
    expect(body.hobbies).toEqual(['soccer']);
  });

  it('return updated users array by GET request', async () => {
    const { statusCode, body } = await app.get(process.env.BASE_URL!);

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].username).toBe('Simon');
    expect(body[0].age).toBe(25);
    expect(body[0].hobbies).toEqual(['soccer']);
  });

  it('remove user by DELETE request', async () => {
    const { statusCode, body } = await app.delete(
      process.env.BASE_URL + '/' + userId
    );

    expect(statusCode).toBe(204);
    expect(body).toBeUndefined;
  });

  it('return an empty array by GET request', async () => {
    const { statusCode, body } = await app.get(process.env.BASE_URL!);

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(0);
  });
});

describe('return error 404 by invalid url', () => {
  it('return error by GET request', async () => {
    const { statusCode, body } = await app.get(INVALID_URL);

    changeErrorData(
      statusCode,
      404,
      body,
      process.env.PATH_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by POST request', async () => {
    const { statusCode, body } = await app.post(INVALID_URL).send(user);

    changeErrorData(
      statusCode,
      404,
      body,
      process.env.PATH_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by PUT request', async () => {
    const { statusCode, body } = await app.put(INVALID_URL).send(data);

    changeErrorData(
      statusCode,
      404,
      body,
      process.env.PATH_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by DELETE request', async () => {
    const { statusCode, body } = await app.delete(INVALID_URL);

    changeErrorData(
      statusCode,
      404,
      body,
      process.env.PATH_ERROR_MESSAGE ?? ''
    );
  });
});

describe('return error 400 by invalid id', () => {
  it('return error by GET request', async () => {
    const { statusCode, body } = await app.get(
      process.env.BASE_URL + INVALID_URL
    );

    changeErrorData(
      statusCode,
      400,
      body,
      process.env.USER_ID_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by PUT request', async () => {
    const { statusCode, body } = await app
      .put(process.env.BASE_URL + INVALID_URL)
      .send(data);

    changeErrorData(
      statusCode,
      400,
      body,
      process.env.USER_ID_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by DELETE request', async () => {
    const { statusCode, body } = await app.delete(
      process.env.BASE_URL + INVALID_URL
    );

    changeErrorData(
      statusCode,
      400,
      body,
      process.env.USER_ID_ERROR_MESSAGE ?? ''
    );
  });
});

describe('return error 400 by invalid request body', () => {
  it('return error by POST request', async () => {
    const { statusCode, body } = await app
      .post(process.env.BASE_URL!)
      .send(invalidUser);

    changeErrorData(
      statusCode,
      400,
      body,
      process.env.BODY_ERROR_MESSAGE ?? ''
    );
  });

  it('return error by PUT request', async () => {
    const response = await app.post(process.env.BASE_URL!).send(user);

    userId = response.body.id;

    const { statusCode, body } = await app
      .put(process.env.BASE_URL + '/' + userId)
      .send(invalidData);

    changeErrorData(
      statusCode,
      400,
      body,
      process.env.BODY_ERROR_MESSAGE ?? ''
    );
  });
});

describe('return internal error', () => {
  it('return error 500 by POST request', async () => {
    const { statusCode, body } = await app
      .post(process.env.BASE_URL!)
      .send(invalidJSON);

    changeErrorData(
      statusCode,
      500,
      body,
      process.env.SERVER_ERROR_MESSAGE ?? ''
    );
  });

  it('return error 500 by PUT request', async () => {
    const response = await app.post(process.env.BASE_URL!).send(user);

    userId = response.body.id;

    const { statusCode, body } = await app
      .put(process.env.BASE_URL + '/' + userId)
      .send(invalidJSON);

    changeErrorData(
      statusCode,
      500,
      body,
      process.env.SERVER_ERROR_MESSAGE ?? ''
    );
  });
});
