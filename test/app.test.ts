import request from 'supertest';

import { server } from '../src';

const app = request(server);

afterAll(() => {
  server.close();
});

describe('get success responses', () => {
  it('return an empty array with a GET request', async () => {
    const { statusCode, body } = await app.get('/api/users');
    expect(statusCode).toBe(200);
    expect(body).toHaveLength(0);
  });

  let userId: string;

  it('return new user with a POST request', async () => {
    const user = { username: 'Eugene', age: 35, hobbies: ['js', 'ts'] };
    const { statusCode, body } = await app.post('/api/users').send(user);

    expect(statusCode).toBe(201);
    expect(body.username).toBe('Eugene');
    expect(body.age).toBe(35);
    expect(body.hobbies).toHaveLength(2);
    expect(body.hobbies).toEqual(['js', 'ts']);

    userId = body.id;
  });

  it('return new user with a GET request by id', async () => {
    const { statusCode, body } = await app.get(`/api/users/${userId}`);

    expect(statusCode).toBe(200);
    expect(body.username).toBe('Eugene');
    expect(body.age).toBe(35);
    expect(body.hobbies).toHaveLength(2);
    expect(body.hobbies).toEqual(['js', 'ts']);
  });

  it('return users array with a GET request', async () => {
    const { statusCode, body } = await app.get('/api/users');

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].username).toBe('Eugene');
    expect(body[0].age).toBe(35);
    expect(body[0].hobbies).toEqual(['js', 'ts']);
  });
});
