import { ServerResponse } from 'http';
import { validate } from 'uuid';
import { error, success, USER_ID_ERROR, USER_ERROR } from './response.js';
import users from '../db.js';

const handleUrl = (res: ServerResponse, url: string) => {
  const id = url.split('/').at(-1);
  if (id && validate(id)) {
    const user = users.find((user) => user.id === id);
    if (user) success(res, 200, user);
    else error(res, USER_ERROR);
  } else {
    error(res, USER_ID_ERROR);
  }
};

const get = (res: ServerResponse, url?: string) => {
  if (url) handleUrl(res, url);
  else success(res, 200, users);
};

export default get;
