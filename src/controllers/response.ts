import { ServerResponse } from 'http';
import { ErrorType, UserType } from '../../types';
import 'dotenv/config';

const RES_HEADER = { 'Content-Type': 'application/json' };

export const PATH_ERROR = {
  code: 404,
  message: process.env.PATH_ERROR_MESSAGE ?? '',
};

export const USER_ID_ERROR = {
  code: 400,
  message: process.env.USER_ID_ERROR_MESSAGE ?? '',
};

export const BODY_ERROR = {
  code: 400,
  message: process.env.BODY_ERROR_MESSAGE ?? '',
};

export const USER_ERROR = {
  code: 404,
  message: process.env.USER_ERROR_MESSAGE ?? '',
};

export const SERVER_ERROR = {
  code: 500,
  message: process.env.SERVER_ERROR_MESSAGE ?? '',
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
