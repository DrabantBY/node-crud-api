import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuid } from 'uuid';

import users from '../db';
import * as response from './response';
// import { UserBodyType } from '../../types';
// import { showError, BODY_ERROR, SERVER_ERROR } from '../utils/errors';

// export const createUser = (body: UserBodyType) => {
//     if (isValidData('post', body)) {
//   const newUser = { id: uuid(), ...body };
//   users.push(newUser);
//   return newUser;
//     }
//     return null;
// };

const post = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', (chunk) => (body += chunk));

  req.on('end', () => {
    // try {

    const user = { id: uuid(), ...JSON.parse(body) };

    users.push(user);

    const responseData = {
      res,
      code: 200,
      data: user,
    };

    response.success(responseData);

    // if (data) success({ res, code, data });
    //   else showError(res, BODY_ERROR);
    // } catch {
    //   showError(res, SERVER_ERROR);
    // }
  });
};

export default post;
