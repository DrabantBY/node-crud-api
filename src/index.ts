import { createServer } from 'http';
import { error, PATH_ERROR } from './controllers/response';
import isValidUrl from './utils/isValidUrl';
import isValidUrlById from './utils/isValidUrlById';
import get from './controllers/get';
import put from './controllers/put';
import post from './controllers/post';
import remove from './controllers/remove';
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
