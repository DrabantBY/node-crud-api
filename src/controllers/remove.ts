import { ServerResponse } from 'http';
import { validate } from 'uuid';
import { success, error, USER_ERROR, USER_ID_ERROR } from './response.js';
import users from '../db.js';

const remove = (res: ServerResponse, url: string) => {
  const id = url.split('/').at(-1);
  if (id && validate(id)) {
    const index = users.findIndex((user) => user.id === id);
    if (index > -1) {
      users.splice(index, 1);
      success(res, 204);
    } else error(res, USER_ERROR);
  } else error(res, USER_ID_ERROR);
};

export default remove;
