import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuid } from 'uuid';
import { success, error, BODY_ERROR, SERVER_ERROR } from './response';
import { isValidBody } from '../utils/isValidBody';
import { UserBodyType } from '../../types';
import users from '../db';

const handleBody = (data: string) => {
  const body = JSON.parse(data) as UserBodyType;
  if (!isValidBody('post', body)) return null;
  const user = { id: uuid(), ...body };
  users.push(user);
  return user;
};

const post = (req: IncomingMessage, res: ServerResponse) => {
  let data = '';

  req.on('data', (chunk) => (data += chunk));

  req.on('end', () => {
    try {
      const user = handleBody(data);

      if (user) {
        success(res, 201, user);
      } else {
        error(res, BODY_ERROR);
      }
    } catch {
      error(res, SERVER_ERROR);
    }
  });
};

export default post;
