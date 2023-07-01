import { IncomingMessage, ServerResponse } from 'http';
import { error, PATH_ERROR } from './controllers/response';
import get from './controllers/get';
import put from './controllers/put';
import post from './controllers/post';
import remove from './controllers/remove';
import isValidUrl from './utils/isValidUrl';
import isValidUrlById from './utils/isValidUrlById';

const handleServer = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
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
};

export default handleServer;
