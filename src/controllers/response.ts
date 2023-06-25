import { ServerResponse } from 'http';
import { ErrorType, UserType } from '../../types';

const RES_HEADER = { 'Content-Type': 'application/json' };

export const PATH_ERROR = {
  code: 404,
  message: "such path doesn't exist",
};

export const USER_ID_ERROR = {
  code: 400,
  message: 'such user Id is invalid (not uuid)',
};

export const BODY_ERROR = {
  code: 400,
  message: "request body doesn't contain required fields",
};

export const USER_ERROR = {
  code: 404,
  message: "such user Id doesn't exist",
};

export const SERVER_ERROR = {
  code: 500,
  message: 'an internal server error has occurred',
};

export const success = (
  res: ServerResponse,
  code: number,
  data?: UserType | UserType[]
) => {
  res.writeHead(code, RES_HEADER);
  if (data) res.end(JSON.stringify(data));
  else res.end();
};

export const error = (res: ServerResponse, errorData: ErrorType) => {
  res.writeHead(errorData.code, RES_HEADER);
  res.end(JSON.stringify(errorData));
};
