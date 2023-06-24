import { createServer } from 'http';

import isValidUrl from './utils/isValidUrl';
import isValidUrlById from './utils/isValidUrlById';

import get from './controllers/get';
import addUser from './controllers/post';
import { error, PATH_ERROR } from './controllers/response';

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
      addUser(req, res);
      break;

    // case method === 'PUT' && isValidUrlById(url!):
    //   patchUser(req, res);
    //   break;

    // case method === 'DELETE' && isValidUrlById(url!):
    //   deleteUser(url!, res);
    //   break;

    default:
      error(res, PATH_ERROR);
  }
});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`current PORT: ${PORT}`));
