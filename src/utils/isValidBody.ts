import { UserBodyType, BodyValType, BodyKeyType } from './../../types';

const isValidName = ([key, value]: [BodyKeyType, BodyValType]) =>
  key === 'username' && typeof value === 'string';

const isValidAge = ([key, value]: [BodyKeyType, BodyValType]) =>
  key === 'age' &&
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value > 0;

const isValidHobbies = ([key, value]: [BodyKeyType, BodyValType]) =>
  key === 'hobbies' &&
  Array.isArray(value) &&
  (value.length === 0 || value.every((val) => typeof val === 'string'));

const isValidSize = (method: 'put' | 'post', body: Partial<UserBodyType>) => {
  const size = Object.keys(body).length;
  return method === 'put' ? size >= 1 && size <= 3 : size === 3;
};

const checkKeyVal = (body: Partial<UserBodyType>) => {
  const arr = Object.entries(body) as [BodyKeyType, BodyValType][];
  for (let i = 0; i < arr.length; i++) {
    if (
      !isValidName(arr[i]!) &&
      !isValidAge(arr[i]!) &&
      !isValidHobbies(arr[i]!)
    )
      return false;
  }
  return true;
};

export const isValidBody = (
  method: 'post' | 'put',
  body: Partial<UserBodyType>
) => {
  const flag = isValidSize(method, body);
  return flag ? checkKeyVal(body) : flag;
};
