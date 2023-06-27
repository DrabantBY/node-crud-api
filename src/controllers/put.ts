import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import {
  error,
  success,
  USER_ID_ERROR,
  BODY_ERROR,
  SERVER_ERROR,
  USER_ERROR,
} from './response';
import { isValidBody } from '../utils/isValidBody';
import { UserBodyType } from '../../types';
import users from '../db';

const changeUser = (id: string, data: string) => {
  const body = JSON.parse(data) as UserBodyType;
  if (!isValidBody('put', body)) return null;
  const user = users.find((user) => user.id === id);
  if (user) {
    // for (const key in body) {
    //   if (Object.hasOwn(body, key)) {
    //     user[key] = body[key];
    //   }
    // }
    'username' in body && (user.username = body.username);
    'age' in body && (user.age = body.age);
    'hobbies' in body && (user.hobbies = body.hobbies);
  }
  return user;
};

export const put = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/').at(-1);
  if (id && validate(id)) {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        const newUser = changeUser(id, data);
        if (newUser) success(res, 200, newUser);
        else if (newUser === undefined) error(res, USER_ERROR);
        else if (newUser === null) error(res, BODY_ERROR);
      } catch {
        error(res, SERVER_ERROR);
      }
    });
  } else error(res, USER_ID_ERROR);
};

export default put;
