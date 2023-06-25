import { createServer } from 'http';
import { error, PATH_ERROR } from './controllers/response.js';
import isValidUrl from './utils/isValidUrl.js';
import isValidUrlById from './utils/isValidUrlById.js';
import get from './controllers/get.js';
import put from './controllers/put.js';
import post from './controllers/post.js';
import remove from './controllers/remove.js';
import 'dotenv/config';

const server = createServer((req, res) => {
  const { method, url } = req;

  switch (true) {
    case method === 'GET' && isValidUrl(url!):
      get(res);
      break;

    case method === 'GET' && isValidUrlById(url!):
      get(res, url!);
      break;

    case method === 'POST' && isValidUrl(url!):
      post(req, res);
      break;

    case method === 'PUT' && isValidUrlById(url!):
      put(req, res);
      break;

    case method === 'DELETE' && isValidUrlById(url!):
      remove(res, url!);
      break;

    default:
      error(res, PATH_ERROR);
  }
});

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => console.log(`current PORT: ${PORT}`));
