export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type ErrorType = {
  code: number;
  message: string;
};

export type UserBodyType = Omit<UserType, 'id'>;

export type BodyKeyType = keyof UserBodyType;

export type BodyValType = UserType[BodyKeyType];
