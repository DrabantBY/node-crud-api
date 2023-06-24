import { ServerResponse } from 'http';
import { validate } from 'uuid';

import users from '../db';
import { error, success, USER_ID_ERROR, USER_ERROR } from './response';

import { UserType } from '../../types';

const responseSuccess = (res: ServerResponse, data: UserType | UserType[]) => {
  const responseData = {
    res,
    code: 200,
    data,
  };
  success(responseData);
};

const handleUrl = (res: ServerResponse, url: string) => {
  const id = url.split('/').at(-1);

  if (id && validate(id)) {
    const user = users.find((user) => user.id === id);
    if (user) {
      responseSuccess(res, user);
    } else {
      error(res, USER_ERROR);
    }
  } else {
    error(res, USER_ID_ERROR);
  }
};

const get = (res: ServerResponse, url?: string) => {
  if (url) {
    handleUrl(res, url);
  } else {
    responseSuccess(res, users);
  }
};

export default get;
