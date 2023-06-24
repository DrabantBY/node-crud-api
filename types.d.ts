import { ServerResponse } from 'http';

export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type UserBodyType = Omit<UserType, 'id'>;

export type SuccessType = {
  res: ServerResponse;
  code: number;
  data?: UserType | UserType[];
};

export type ErrorType = {
  code: number;
  message: string;
};

//

// export type values = string | number | string[];

// export type error = [number, string];
